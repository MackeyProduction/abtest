"use strict";

var teaser = function (app, $) {
    return {
        init: function () {
            $(this).ready(function () {
                $("#errorMessage").hide();
                $("#successMessage").hide();
                $("#addTracking").hide();
                $("#user-view").hide();
            });
        },
        sendPostRequest: function (endpoint, json) {
            var request = $.ajax({
                method: "POST",
                url: endpoint,
                data: json,
                dataType: "json",
                contentType: "application/json;charset=utf-8"
            });
            this.validate(request);

            return request;
        },
        sendGetRequest: function (endpoint, id) {
            return $.ajax({
                method: "GET",
                url: endpoint + id,
                dataType: "json"
            });
        },
        validate: function (request) {
            request.done(function (msg) {
                if (typeof msg.errorMessage !== typeof undefined) {
                    $("#successMessage").hide();
                    $("#errorMessage").fadeIn(500);
                    $("#errorOutput").html(msg.errorMessage);
                } else {
                    $("#errorMessage").hide();
                    $("#successMessage").fadeIn(500);
                    $("#successOutput").html("Teaser wurde erfolgreich hinzugefügt.");
                }
            });

            request.fail(function (jqXHR, textStatus) {
                $("#errorMessage").show();
                $("#output").html("Request failed: " + textStatus);
            });
        }
    };
}(window.teaser || {},
    jQuery);

teaser.init();