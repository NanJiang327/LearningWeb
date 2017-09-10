;(function () {
    'use strict';

    setCss();

    var sidebar = $('#sidebar')
        , mask = $('#mask')
        , trigger = $('#trigger')
        , display = true
        , backBtn = $('.backToTop')
        , moreBtn = $('#more');

    trigger.on('click', function () {
        if (display) {
            mask.css('display', 'block');
            sidebar.css('right', 0);
        } else {
            mask.css('display', 'none');
            sidebar.css('right', -sidebar.width());
        }
        display = !display;
    })

    mask.on('click', function () {

    })

    mask.mouseover(function () {
        mask.css('display', 'none');
        sidebar.css('right', -sidebar.width());
    });

    backBtn.on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    })

    moreBtn.on('click', function () {
        $('html, body').animate({
            scrollTop: 1008
        }, 500);
    })

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 0)
            backBtn.fadeIn();
        else
            backBtn.fadeOut();
    })


    function setCss() {
        $('.article-preview:nth-child(odd)').css('background', 'rgba(255,255,255,0.05)');
        var opacity = 0;
        for (var i = 1; i < $('.card').length + 1; i++) {
            opacity += 0.03;
            $('.card:nth-child(' + i + ')').css('background', 'rgba(0,0,0,' + opacity + ')');
        }

    }

})();
