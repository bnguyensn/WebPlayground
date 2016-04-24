$(document).ready(function() {

    // Create ==========

    var grid_range = 10;  // Create a NxN grid

    var grid_box_size = 40;  // Outer width. Does not include margin
    var grid_box_border = 1;

    var grid_padding = 5;
    var grid_wh = grid_box_size * grid_range - grid_box_border * grid_range - grid_padding * 2;

    var $grid = $(".grid");

    $grid.css({
        "width": grid_wh + grid_padding * 2, "height": grid_wh + grid_padding * 2,
        "padding": grid_padding
    });

    var x; var y;
    for (x = 0; x < grid_range; x++) {
        for (y = 0; y < grid_range; y++) {
            $grid.append($("<div class='grid-box'></div>").css({
                "top": grid_padding + y * grid_box_size - y * grid_box_border ,
                "left": grid_padding + x * grid_box_size - x * grid_box_border
            }));
        }
    }

    // Interactive ==========

    var $gridboxes = $(".grid-box");

    $gridboxes.hover(function() {
        TweenLite.to($(this), .35, {backgroundColor: "#cce7ff"})
    }, function() {
        TweenLite.to($(this), .35, {backgroundColor: "#f0f8ff"})
    });

    // Create a circle at click point, increase circle's size and make it transparent at the same time
    

    // Present to user ==========

    $grid.removeClass("hidden");
});