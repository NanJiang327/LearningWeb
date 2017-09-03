$(function () {
    $('.prev-slide').on('click',function () {
        $('#slideshow').carousel('prev');
    });


    $('.next-slide').on('click',function () {
        $('#slideshow').carousel('next');
    });

    $(document).on('keydown',function (e) {
        switch (e.which){
            case 37:
                $('#slideshow').carousel('prev');
                break;
            case 39:
                $('#slideshow').carousel('next');
                break;
        }
    });

});
