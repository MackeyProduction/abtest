"use strict";

$(function () {
    var self = this;

    this.init = function () {
        self.events();
    };

    this.events = function () {
        $('span[class*=reportBox__headline__span]').each(function (k, v) {
            $("#" + v.id).on('click', function () {
                if (v.className === "glyphicon glyphicon-chevron-right reportBox__headline__span reportBox__headline__span--arrowDown") {
                    $("#" + v.id).attr("class", "glyphicon glyphicon-chevron-right reportBox__headline__span reportBox__headline__span--arrowUp");
                } else {
                    $("#" + v.id).attr("class", "glyphicon glyphicon-chevron-right reportBox__headline__span reportBox__headline__span--arrowDown");
                }
            });
        })
    };

    self.init();
});