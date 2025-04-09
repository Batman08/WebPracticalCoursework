const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

class PageHelpers {
    //#region RenderView

    static #rootDir = path.resolve(__dirname, "../");
    static #bundleConfig = JSON.parse(fs.readFileSync(path.join(this.#rootDir, "bundles.json"), "utf-8")).Bundles;

    static RenderView(res, req, viewName, data = {}) {
        const token = req.cookies.jwt;
        if (token) jwt.verify(token, process.env.JWT_SECRET, (err, user) => { if (!err) req.user = user; });
        
        data.user = req.user || null; //set user data

        //render the main page (content)
        res.render(viewName, data, (err, content) => {
            if (err) {
                res.status(500).send('Error rendering view');
            }

            const layoutBundleName = 'b-layout';
            data.bundleName = `b-${data.bundleName}`;

            //bind style  bundles
            const styleBundles = [
                this.#GenerateAssetTags(layoutBundleName, 'css'),
                this.#GenerateAssetTags(data.bundleName, 'css')
            ].join('\n');

            // bind script bundles
            const scriptBundles = [
                this.#GenerateAssetTags(layoutBundleName, 'js'),
                this.#GenerateAssetTags(data.bundleName, 'js')
            ].join('\n');

            //render the layout with the content injected into it
            res.render('layouts/layout', {
                pageTitle: data.pageTitle || 'My Site',
                content: content,
                styles: styleBundles,
                scripts: scriptBundles,
                user: data.user
            });
        });
    }

    static #GenerateAssetTags(bundleName, type) {
        const bundle = this.#bundleConfig.find(bundle => bundle.Name.toLowerCase() === bundleName.toLowerCase());

        if (!bundle) return ""; //return empty if bundle not found

        let assetTags = "";
        const files = type === "css" ? bundle.CssFiles || [] : bundle.JsFiles || [];
        files.forEach(file => {
            let url = `/${file}?v=${this.#GetFileVersion(file)}`;
            assetTags += type === "css" ? `<link rel="stylesheet" href="${url}">\n` : `<script src="${url}"></script>\n`;
        });

        console.log(`[DEBUG] assetLoader("${bundleName}", "${type}") => \n`, assetTags);

        return assetTags;
    }

    static #GetFileVersion(filePath) {
        try {
            const stats = fs.statSync(path.join(__dirname, filePath));
            return stats.mtimeMs; //last modified timestamp
        } catch (error) {
            return Date.now(); //fallback timestamp
        }
    }

    //#endregion


    static GetController(page) {
        const controllerPath = path.join(__dirname, `../controllers/pages/${page}Controller.js`);
        if (fs.existsSync(controllerPath)) {
            return require(controllerPath); //load controller dynamically
        }
        return null; //no controller found
    }
}

module.exports = PageHelpers;
