var ABChart = function (configId) {
    var self = this;
    var configData, contentId1, contentId2, startDate, endDate, showRateInPercent1, showRateInPercent2;

    // canvas
    var ctxCTRa = document.getElementById("ctra").getContext('2d');
    var ctxCTRb = document.getElementById("ctrb").getContext('2d');

    this.init = function () {
        var request = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/config/get/query/" + configId,
            dataType: "json"
        });

        request.done(function (data) {
            configData = data['config'][0];
            contentId1 = configData.contentId1;
            contentId2 = configData.contentId2;
            startDate = configData.startDate;
            endDate = configData.endDate;
            showRateInPercent1 = configData.showRateInPercent1;
            showRateInPercent2 = configData.showRateInPercent2;
        });

        return request;
    };

    this.loadPieCharts = function () {
        var ctxCTR = document.getElementById("ctr").getContext('2d');
        var ctxClicks = document.getElementById("clicks").getContext('2d');
        var ctxViews = document.getElementById("views").getContext('2d');

        var requestContentId1 = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/track/get/contentid/?configId=" + configId + "&contentId=" + contentId1,
            dataType: "json"
        });

        requestContentId1.done(function (dataContentId1) {
            var requestContentId2 = jQuery.ajax({
                method: "GET",
                url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/track/get/contentid/?configId=" + configId + "&contentId=" + contentId2,
                dataType: "json"
            });

            requestContentId2.done(function (dataContentId2) {
                var dataId1 = dataContentId1.Items[0];
                var dataId2 = dataContentId2.Items[0];

                var clicks = new Chart(ctxClicks, {
                    type: 'doughnut',
                    data: {
                        labels: ["contentId " + dataId1.contentId, "contentId " + dataId2.contentId],
                        datasets: [{
                            label: 'clicks',
                            data: [dataId1.clicks, dataId2.clicks],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 50,
                                right: 0,
                                top: 0,
                                bottom: 50
                            }
                        },
                        title: {
                            display: true,
                            text: 'clicks',
                            fontSize: 22
                        }
                    }
                });
                var views = new Chart(ctxViews, {
                    type: 'doughnut',
                    data: {
                        labels: ["contentId " + dataId1.contentId, "contentId " + dataId2.contentId],
                        datasets: [{
                            label: 'views',
                            data: [dataId1.views, dataId2.views],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 50,
                                right: 0,
                                top: 0,
                                bottom: 50
                            }
                        },
                        title: {
                            display: true,
                            text: 'views',
                            fontSize: 22
                        }
                    }
                });
                var ctr = new Chart(ctxCTR, {
                    type: 'doughnut',
                    data: {
                        labels: ["contentId " + dataId1.contentId, "contentId " + dataId2.contentId],
                        datasets: [{
                            label: 'show-rate-in-percent',
                            data: [showRateInPercent1, showRateInPercent2],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 50,
                                right: 0,
                                top: 0,
                                bottom: 50
                            }
                        },
                        title: {
                            display: true,
                            text: 'show-rate-in-percent',
                            fontSize: 22
                        }
                    }
                });
            });
        });
    };

    this.loadLineCharts = function (timeInterval, chartSize) {
        var dates = [];
        var chartDates = [];
        var sortedArray = [];
        var clicksChart = [];
        var viewsChart = [];
        var totalClicks = [0, 0];
        var totalViews = [0, 0];
        var chartEndDate = "";

        var requestContentId1 = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/track/get/charts/?configId=" + configId + "&contentId=" + contentId1,
            dataType: "json"
        });

        requestContentId1.done(function (dataContentId1) {
            var requestContentId2 = jQuery.ajax({
                method: "GET",
                url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/track/get/charts/?configId=" + configId + "&contentId=" + contentId2,
                dataType: "json"
            });

            requestContentId2.done(function (dataContentId2) {
                var dateDiff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * timeInterval);
                var date, clickThroughRateA = 0, clickThroughRateB = 0;
                var dataContent = [dataContentId1, dataContentId2];
                var chartClickPoints = [];
                var chartViewPoints = [];

                for (var a = 0; a < chartSize; a++) {
                    chartViewPoints[a] = "rgba(255, 99, 132, 0.7)";
                    chartClickPoints[a] = "rgba(54, 162, 235, 0.7)";
                }

                // push all current dates in array
                for (var i = 0; i < dateDiff; i++) {
                    if (new Date() > new Date(new Date(startDate).getTime() + (1000 * 60 * timeInterval * i))) {
                        date = new Date(new Date(startDate).getTime() + (1000 * 60 * timeInterval * i));
                        dates.push(date.getFullYear() + "-" + ((parseInt(date.getMonth()+1) >= 10) ? parseInt(date.getMonth()+1) : "0" + parseInt(date.getMonth()+1)) + "-" + ((date.getDate() >= 10) ? date.getDate() : "0" + date.getDate()) + " " + ((date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()) + ":" + ((date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()) + ":" + ((date.getSeconds() >= 10) ? date.getSeconds() : "0" + date.getSeconds()));
                    }
                }

                if (typeof jQuery("#charts0")[0] !== typeof undefined || typeof jQuery("#charts1")[0] !== typeof undefined) {
                    jQuery("#charts0")[0].remove();
                    jQuery("#charts1")[0].remove();
                }

                if (typeof jQuery("#table0 tr")[0] !== typeof undefined || typeof jQuery("#table1 tr")[0] !== typeof undefined) {
                    $("#table0").find('tbody tr').remove();
                    $("#table1").find('tbody tr').remove();
                }

                if (dataContentId1.Count > 0 && dataContentId2.Count > 0) {
                    var currentDate = new Date(new Date(date) - (1000 * 60 * timeInterval * (chartSize + 1)));

                    $("#table0").show();
                    $("#table1").show();

                    $(".line-container").css("background-color", "rgba(0,0,0,0.0)");
                    for (var j = dates.length - chartSize; j < dates.length; j++) {
                        if (typeof dates[j] !== typeof undefined) {
                            chartDates.push(dates[j]);
                        }
                    }

                    for (var k = 0; k < 2; k++) {
                        if (typeof dataContent[k].Items[k] !== typeof undefined) {
                            clicksChart[k] = [];
                            viewsChart[k] = [];

                            for (var m = 0; m < chartSize; m++) {
                                clicksChart[k][m] = 0;
                                viewsChart[k][m] = 0;
                            }

                            for (var x = 0; x < dataContent[k].Items.length; x++) {
                                sortedArray[k] = dataContent[k].Items.sort(function (a, b) {
                                    return a.trackingChartsId - b.trackingChartsId
                                });
                                chartEndDate = sortedArray[k][x].endDate;

                                // fetch data
                                if (new Date(sortedArray[k][x].endDate) > currentDate) {
                                    for (var y = 0; y < chartDates.length; y++) {
                                        if (chartEndDate === chartDates[y]) {
                                            clicksChart[k][y] = parseInt(sortedArray[k][x].clicks);
                                            viewsChart[k][y] = parseInt(sortedArray[k][x].views);

                                            // add total clicks
                                            totalClicks[k] += clicksChart[k][y];
                                            totalViews[k] += viewsChart[k][y];

                                            // build table
                                            buildTable("table" + k, y + 1, (sortedArray[k][x].startDate.split(' '))[1], chartEndDate.split(' ')[1], clicksChart[k][y], viewsChart[k][y]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    $("#table0").hide();
                    $("#table1").hide();

                    var elem = jQuery(".line-container");
                    $(".line-container").css("background-color", "rgba(0,0,0,0.7)");

                    for (var z = 0; z < elem.length; z++) {
                        var content = document.createElement("div");

                        content.id = "charts" + z;
                        content.style.color = "rgba(255, 255, 255, 1)";
                        content.style.position = "absolute";
                        content.style.top = "50%";
                        content.style.left = "25%";

                        var contentParagraph = document.createElement("p");
                        var contentNode = document.createTextNode("Es stehen nicht genügend Daten zur Verfügung!");

                        elem[z].appendChild(content);
                        content.appendChild(contentParagraph);
                        contentParagraph.appendChild(contentNode);
                    }
                }

                // calculate click-through-rate
                if ((totalViews[0] !== 0 || totalViews[1] !== 0) && (totalClicks[0] !== 0 || totalClicks[1] !== 0)) {
                    clickThroughRateA = (totalClicks[0] / totalViews[0]) * 100;
                    clickThroughRateB = (totalClicks[1] / totalViews[1]) * 100;
                }

                $("#click-through-rate1").html(clickThroughRateA);
                $("#click-through-rate2").html(clickThroughRateB);

                var ctrA = new Chart(ctxCTRa, {
                    type: 'line',
                    data: {
                        labels: chartDates,
                        datasets: [{
                            label: 'views',
                            data: viewsChart[0],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            pointHoverBackgroundColor: chartViewPoints,
                            pointHoverBorderColor: chartViewPoints,
                            borderWidth: 1,
                            fill: false,
                            lineTension: 0
                        }, {
                            label: 'clicks',
                            data: clicksChart[0],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            backgroundColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            pointHoverBackgroundColor: chartClickPoints,
                            pointHoverBorderColor: chartClickPoints,
                            borderWidth: 1,
                            fill: false,
                            lineTension: 0
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'clicks & views #A ' + "(" + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ")",
                            fontSize: 22
                        }
                    }
                });
                var ctrB = new Chart(ctxCTRb, {
                    type: 'line',
                    data: {
                        labels: chartDates,
                        datasets: [{
                            label: 'views',
                            data: viewsChart[1],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            pointHoverBackgroundColor: chartViewPoints,
                            pointHoverBorderColor: chartViewPoints,
                            borderWidth: 1,
                            fill: false,
                            lineTension: 0
                        }, {
                            label: 'clicks',
                            data: clicksChart[1],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            backgroundColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            pointHoverBackgroundColor: chartClickPoints,
                            pointHoverBorderColor: chartClickPoints,
                            borderWidth: 1,
                            fill: false,
                            lineTension: 0
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'clicks & views #B ' + "(" + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ")",
                            fontSize: 22
                        }
                    }
                });
            });
        });
    };

    this.loadConfigPanel = function () {
        // fill data
        $("#panel-configId").html(configId);
        $("#panel-contentId1").html(contentId1);
        $("#panel-contentId2").html(contentId2);
        $("#panel-startDate").html(startDate);
        $("#panel-endDate").html(endDate);
    };

    this.loadConfigContentPanel = function () {
        var requestContent1 = jQuery.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/get/" + contentId1,
            dataType: "json"
        });

        requestContent1.done(function (dataContent1) {
            var requestContent2 = jQuery.ajax({
                method: "GET",
                url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/get/" + contentId2,
                dataType: "json"
            });

            requestContent2.done(function (dataContent2) {
                var c = [dataContent1, dataContent2];

                $("#contentModal-configId").html(configId);
                $("#contentModal-startDate").html(startDate);
                $("#contentModal-endDate").html(endDate);

                for (var k = 0; k < 2; k++) {
                    $("#contentModal-cContent" + k).html(c[k].content[0].cContent);
                    $("#contentModal-cName" + k).html(c[k].content[0].cName);
                    $("#contentModal-contentId" + k).html(c[k].content[0].contentId);
                    $("#contentModal-fName" + k).html(c[k].content[0].fName);
                    $("#contentModal-fContent" + k).html(c[k].content[0].fContent);
                    $("#contentModal-pName" + k).html(c[k].content[0].pName);
                }
            })
        })
    };

    function buildTable(id, number, startDate, endDate, clicks, views) {
        if ($("#" + id).find('tbody tr').length < 7) {
            $("#" + id).find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .append(number)
                    )
                    .append($('<td>')
                        .append(startDate)
                    )
                    .append($('<td>')
                        .append(endDate)
                    )
                    .append($('<td>')
                        .append(clicks)
                    )
                    .append($('<td>')
                        .append(views)
                    )
                )
            ;
        }
    }

    this.init();
};