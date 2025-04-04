const path = require("path");
const fs = require("fs");

// Helper Class
class PageHelpers {
    //get the directory of the root project
    static rootDir = path.resolve(__dirname, "../");
    static bundleConfig = JSON.parse(fs.readFileSync(path.join(this.rootDir, "bundles.json"), "utf-8")).Bundles;

    static GetController(page) {
        const controllerPath = path.join(__dirname, `../controllers/pages/${page}Controller.js`);
        if (fs.existsSync(controllerPath)) {
            return require(controllerPath); // Load controller dynamically
        }
        return null; // No controller found
    }

    static GenerateAssetTags(bundleName, type) {
        let assetTags = "";
        const bundle = this.bundleConfig.find(bundle => bundle.Name.toLowerCase() === bundleName.toLowerCase());

        if (!bundle) return ""; // Return empty if bundle not found

        const files = type === "css" ? bundle.CssFiles || [] : bundle.JsFiles || [];

        files.forEach(file => {
            let url = `/${file}?v=${this.GetFileVersion(file)}`;
            assetTags += type === "css"
                ? `<link rel="stylesheet" href="${url}">\n`
                : `<script src="${url}"></script>\n`;
        });

        console.log(`[DEBUG] assetLoader("${bundleName}", "${type}") => \n`, assetTags);

        return assetTags;
    }

    static GetFileVersion(filePath) {
        try {
            const stats = fs.statSync(path.join(__dirname, filePath));
            return stats.mtimeMs; // Last modified timestamp
        } catch (error) {
            return Date.now(); // Fallback timestamp
        }
    }

    static RenderView(res, viewName, data = {}) {
        // Render the main page (content)
        res.render(viewName, data, (err, content) => {
          if (err) {
            return res.status(500).send('Error rendering view');
          }
      
          // Now render the layout with the content injected into it
          res.render('layouts/layout', {
            pageTitle: data.pageTitle || 'My Site',
            content: content, // Inject the rendered content into the layout
            styles: this.GenerateAssetTags(data.bundleName, 'css'), // Allow page to pass CSS
            scripts: this.GenerateAssetTags(data.bundleName, 'js') // Allow page to pass JS
          });
        });
      }
}

module.exports = PageHelpers;
