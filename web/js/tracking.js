var Tracking = function (id, configId, contentId) {
    var self = this;

    /**
     * Initialisierung der Tracking-Klasse.
     */
    this.init = function () {
        if (typeof configId !== typeof undefined) {
            self.events();
        }
    };

    /**
     * Überprüfung der Klicks.
     */
    this.events = function () {
        jQuery(".teaser-box").click(function () {
            self.clickTeaser(contentId);
        });
    };

    /**
     * Generierter Klick wird in die Datenbank übernommen.
     * @param contentId
     */
    this.clickTeaser = function (contentId) {
        var clickRequest = jQuery.ajax({
            method: "POST",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/track/add/click",
            data: JSON.stringify({
                "configId": configId.toString(),
                "contentId": contentId.toString()
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8"
        });

        clickRequest.done(function (resp) {
            console.log(resp);
        });

        clickRequest.fail(function (jqXHR, textStatus) {
            console.log(textStatus);
        });
    };

    self.init();
};