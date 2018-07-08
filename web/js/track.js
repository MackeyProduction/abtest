"use strict";

$(function () {
    var self = this;
    var date = new Date();
    var configId, abChart, request, startDate, endDate, dateDiff, interval;

    this.init = function () {
        $("#winner").hide();
        $("#clicksViews").hide();

        var formattedDate = date.getFullYear() + "-" + ((date.getMonth() >= 10) ? parseInt(date.getMonth() + 1) : "0" + parseInt(date.getMonth()+1)) + "-" + ((date.getDate() >= 10) ? date.getDate() : "0" + date.getDate());
        var formattedTime = ((date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()) + ":" + ((date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()) + ":" + ((date.getSeconds() >= 10) ? date.getSeconds() : "0" + date.getSeconds());
        $("#startDate").val(formattedDate);
        $("#endDate").val(formattedDate);
        $("#startTime").val(formattedTime);
        $("#endTime").val(formattedTime);

        self.events();
    };

    this.events = function () {
        $("#startDate").on('change', function () {
            self.loadTrackingList();
        });

        $("#endDate").on('change', function () {
            self.loadTrackingList();
        });

        $("#startTime").on('change', function () {
            self.loadTrackingList();
        });

        $("#endTime").on('change', function () {
            self.loadTrackingList();
        });

        $("#tracking-list").on('change', function () {
            $("#clicksViews").fadeIn(500);

            configId = $("#tracking-list option:selected")[0].id;
            abChart = new ABChart(configId);
            request = abChart.init();
            self.loadWinner();

            request.done(function () {
                startDate = $("#tracking-list option:selected").attr("data-startdate");
                endDate = $("#tracking-list option:selected").attr("data-enddate");
                dateDiff = self.calculateDateDiff(60);

                if (dateDiff <= 24) {
                    interval = 30;
                } else if (dateDiff > 24 && dateDiff < 168) {
                    interval = 60;
                } else {
                    interval = 1440;
                }

                dateDiff = self.calculateDateDiff(interval);
                abChart.loadLineCharts(parseInt(interval), parseInt(dateDiff));
            });
        });
    };

    this.calculateDateDiff = function (interval) {
        return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * interval);
    };

    this.loadTrackingList = function () {
        var trackingListRequest = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/config/get/query/date/?startDate=" + $("#startDate").val() + " " + $("#startTime").val() + "&endDate=" + $("#endDate").val() + " " + $("#endTime").val(),
            dataType: "json"
        });

        trackingListRequest.done(function (trackingListResponse) {
            $("#tracking-list").find('option').remove();
            for (var i = 0; i < trackingListResponse.Count; i++) {
                $("#tracking-list")
                    .append($('<option>')
                        .append("configId: " + trackingListResponse.Items[i].configId + "; Startdatum: " + trackingListResponse.Items[i].startDate + "; Enddatum: " + trackingListResponse.Items[i].endDate)
                        .attr("id", trackingListResponse.Items[i].configId)
                        .attr("data-startdate", trackingListResponse.Items[i].startDate)
                        .attr("data-enddate", trackingListResponse.Items[i].endDate)
                        .attr("data-contentId1", trackingListResponse.Items[i].contentId1)
                        .attr("data-contentId2", trackingListResponse.Items[i].contentId2)
                    )
                ;
            }
        });
    };

    this.loadWinner = function () {
        var trackingWinner = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/config/get/compare/?configId=" + configId,
            dataType: "json"
        });

        trackingWinner.done(function (trackingWinnerResponse) {
            var variant = "";

            if (trackingWinnerResponse == $("#tracking-list option:selected").attr("data-contentId1")) {
                variant = "A";
            } else {
                variant = "B";
            }

            $("#winner").html("<strong>Es hat Variante " + variant + " gewonnen.");
            $("#winner").fadeIn(500);
        });
    };

    self.init();
});