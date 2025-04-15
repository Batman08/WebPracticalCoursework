class CommonHelpers {

    //#region Date Helpers

    static FormatDateTime(strDateTime) {
        const formattedDateTime = new Date(strDateTime).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return formattedDateTime;
    }

    //#endregion
}

module.exports = CommonHelpers;