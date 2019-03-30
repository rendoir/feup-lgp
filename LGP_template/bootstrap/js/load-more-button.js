$(function(){
    $(".moreBox").slice(0, 9).show(); // select the first ten
    $("#loadMore").click(function(e){ // click event for load more
        e.preventDefault();
        let $moreBoxHidden = $(".moreBox:hidden");
        $moreBoxHidden.slice(0, 6).show(); // select next 10 hidden divs and show them
        if($moreBoxHidden.length === 0){ // check if any hidden divs still exist
            $("#loadMore").hide();   // hides the button
        }
    });
});