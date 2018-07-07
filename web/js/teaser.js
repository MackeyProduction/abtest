"use strict";

var teaserId, teaserName, teaserContent, portal, formatName = "", formatContent = "", startDate, endDate, clickChecked, mouseInChecked, event, json, teaserContentIds, showRateInPercent1, showRateInPercent2;

$(function () {
    /**
     * Fügt einen neuen Teaser zur Datenbank hinzu
     */
    function addTeaserContent()
    {
        $("#btnAddTeaserContent").on('click', function () {
            teaserName = $("#teaserName").val();
            teaserContent = $("#teaserContent").val();
            portal = $("#portal :selected")[0].id;
            formatName = $("#format :selected")[0].id;
            formatContent = $("#format :selected").val();

            json = JSON.stringify({
                "cName": teaserName,
                "cContent": teaserContent,
                "pName": portal,
                "fName": formatName,
                "fContent": formatContent
            });

            teaser.sendPostRequest("https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/add", json);
        });
    }

    /**
     * Bearbeitet den aktuellen Content des Teasers.
     */
    function editTeaserContent()
    {
        $("#btnEditTeaserContent").on('click', function () {
            teaserId = $("#contentId").val();
            teaserName = $("#teaserName").val();
            teaserContent = $("#teaserContent").val();
            portal = $("#portal :selected")[0].id;

            if (typeof $("#format :selected")[0] !== typeof undefined) {
                formatName = $("#format :selected")[0].id;
            }

            if ($("#format :selected").val() !== "") {
                formatContent = $("#format :selected").val();
            }

            json = JSON.stringify({
                "contentId": teaserId.toString(),
                "cName": teaserName,
                "cContent": teaserContent,
                "pName": portal,
                "fName": formatName,
                "fContent": formatContent
            });

            teaser.sendPostRequest("https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/edit", json);
        });
    }

    /**
     * Fügt ein neues Tracking-Ereignis zur Datenbank hinzu.
     */
    function addTeaserTracking()
    {
        $("#btnAddTeaserTracking").on('click', function () {
            startDate = $("#start").val() + " " + $("#startHoursA").val() + ":" + $("#startMinutesA").val() + ":" + $("#startSecondsA").val();
            endDate = $("#end").val() + " " + $("#startHoursB").val() + ":" + $("#startMinutesB").val() + ":" + $("#startSecondsB").val();
            showRateInPercent1 = $("#showRateInPercentVariantA-modal").val();
            showRateInPercent2 = $("#showRateInPercentVariantB-modal").val();
            teaserContentIds = [];
            var teaserNameA = teaser.sendGetRequest("https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/get/cname/?cName=", $("#teaserNameA").val());
            var teaserNameB = teaser.sendGetRequest("https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/get/cname/?cName=", $("#teaserNameB").val());

            teaserNameA.done(function (responseA) {
                teaserNameB.done(function (responseB) {
                    post(responseA.Items[0].contentId, responseB.Items[0].contentId, startDate, endDate, showRateInPercent1, showRateInPercent2);
                });
            });
        });
    }

    function post(contentId1, contentId2, startDate, endDate, showRateInPercent1, showRateInPercent2)
    {
        json = JSON.stringify({
            "startDate": startDate,
            "endDate": endDate,
            "contentId1": contentId1,
            "contentId2" : contentId2,
            "showRateInPercent1" : showRateInPercent1,
            "showRateInPercent2" : showRateInPercent2
        });

        teaser.sendPostRequest("https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/config/add", json);
    }

    addTeaserContent();
    addTeaserTracking();
    editTeaserContent();
});