"use strict";

$(function () {
    var self = this;
    var configId, abChart, request;

    this.init = function () {
        self.load();
        self.events();
    };

    this.events = function () {
        $('#configId').on('change', function () {
            self.load();
        });
    };

    this.load = function () {
        configId = $("#configId :selected")[0].id;
        abChart = new ABChart(configId);
        request = abChart.init();

        // load
        request.done(function () {
            abChart.loadConfigPanel();
            abChart.loadConfigContentPanel();
            self.loadDashboard(abChart);
        });
    };

    this.loadDashboard = function (abChart) {
        abChart.loadPieCharts();
        abChart.loadLineCharts(30, 7);
    };

    self.init();
});