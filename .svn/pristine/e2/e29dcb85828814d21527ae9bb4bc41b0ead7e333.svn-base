"use strict";

$(function () {
    function initToggle() {
        var nav = $(".nav-justified li").map(function(i, dom) { return dom.id; });
        var sections = $("section").map(function(i, dom) { return dom.id; });

        $.each(nav, function(i, val) {
            $("#" + val).click(function () {
                $("#" + this.id).attr("class", "active");
                $("#" + sections[i]).fadeIn(500);

                $.each(sections, function (j, val1) {
                    if (j !== i) {
                        $("#" + val1).hide();
                        $("#" + nav[j]).attr("class", "");
                    }
                });
            });
        });
    }

    function initToggleSidebar()
    {
        var nav = $(".sidebar-nav a").map(function(i, dom) { return dom.id; });

        $.each(nav, function(i, val) {
            if (val + "-active" === $(".sidebar-sticky")[0].id) {
                $("#" + val).attr("class", "nav-link active");
            }
        });
    }

    function initViews() {
        $("#view").on('change', function () {
            var viewId = $("#view :selected")[0].id;
            if (viewId === "admin") {
                $("#user-view").hide();
                $("#admin-view").fadeIn(500);
            } else if (viewId === "user") {
                $("#admin-view").hide();
                $("#user-view").fadeIn(500);
            }
        });
    }

    function trackingSelection(msg, variant) {
        for (var i = 0; i < msg.Count; i++) {
            if ($("#teaserName" + variant + " :selected").val() === msg.Items[i].cName) {
                $("#teaserContent" + variant).val(msg.Items[i].cContent);
                $("#teaserPortal" + variant).val(msg.Items[i].pName);
                $("#teaserFormat" + variant).val(msg.Items[i].fName);
            }
        }
    }

    function initTracking() {
        var request = $.ajax({
            method: "GET",
            url: "https://v5ju1xklz1.execute-api.eu-central-1.amazonaws.com/prod/content/get/",
            dataType: "json"
        });

        request.done(function (msg) {
            $("#teaserContentA").val(msg.Items[0].cContent);
            $("#teaserPortalA").val(msg.Items[0].pName);
            $("#teaserFormatA").val(msg.Items[0].fName);
            $("#teaserContentB").val(msg.Items[0].cContent);
            $("#teaserPortalB").val(msg.Items[0].pName);
            $("#teaserFormatB").val(msg.Items[0].fName);

            $("#teaserNameA").on('change', function () {
                trackingSelection(msg, 'A');
            });

            $("#teaserNameB").on('change', function () {
                trackingSelection(msg, 'B');
            });

            $("#portal").on('change', function () {
                $("#format").html(new Option("-- Bitte auswählen --", 1));

                for (var i = 0; i < msg.Count; i++) {
                    if ($("#portal :selected").val() === msg.Items[i].pName) {
                        if (msg.Items[i].fContent !== "NULL") {
                            if ($("#format").val() !== msg.Items[i+2].fContent) {
                                $("#format").append('<option id="' + msg.Items[i].fName + '">' + msg.Items[i].fContent + '</option>');
                            }
                        }
                    }
                }
            });
        });
    }

    initToggle();
    initToggleSidebar();
    initViews();
    initTracking();
});