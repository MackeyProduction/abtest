"use strict";

$(function () {
    var self = this;

    this.init = function () {
        self.events();
    };

    this.events = function () {
        $("tr a").each(function (key, val) {
            var id = (val.href).split("#")[1];
            $(val).on("click", function () {
                // change modal
                $("#btnAddTeaserContent").hide();
                $("#btnEditTeaserContent").show();

                // add content
                $("#contentId").val($("#col-teaserId-" + id).prop("innerHTML"));
                $("#teaserName").val($("#col-teaserName-" + id).prop("innerHTML"));
                $("#teaserContent").val($("#col-teaserContent-" + id).prop("innerHTML"));
                $("#portal").val($("#col-teaserPortal-" + id).prop("innerHTML"));
                $("#format").val($("#col-teaserFormatContent-" + id).prop("innerHTML"));

                $("#modalContent").modal('show');
            });
        });

        $("a[href*=modalContent]").on("click", function () {
            // change modal
            $("#btnAddTeaserContent").show();
            $("#btnEditTeaserContent").hide();

            // add content
            $("#teaserName").val("");
            $("#teaserContent").val("");
        });
    };

    self.init();
});