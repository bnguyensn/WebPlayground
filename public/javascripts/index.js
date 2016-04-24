$(document).ready(function() {

    const size_small = 75;
    const margin_small = 3;

    var size_state = 3;

    $("#resizer").click(function() {

        var count = 0;

        if (size_state == 3) {size_state = 1;} else {size_state += 1;}
        var new_size = size_small * size_state;
        var new_margin = 1 + margin_small * size_state;

        $("#main").find("img").each(function() {
            count += 1;
            TweenLite.to($(this), .5, {
                ease: Power2.easeOut,
                width: new_size, height: new_size,
                margin: new_margin});
        });

        console.log("Number of image resized: " + count);
    });
});