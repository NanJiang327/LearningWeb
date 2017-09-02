$(function () {
    
    $('.on').click(function () {
        //$('.album').fadeIn('fast').fadeOut('fast').fadeIn('slow');
        $('.album:first').show('fast', function () {
            $(this).next().show('fast', arguments.callee);
        });
    });
    
    $('.off').click(function () {
        /*$('.album').fadeOut(1000, function () {

        });*/
        $('.album:last').hide('fast', function () {
            $(this).prev().hide('fast', arguments.callee);
        });
    });    
    
    $('.toggle').click(function () {
        $('.album').toggle();
    });       
})