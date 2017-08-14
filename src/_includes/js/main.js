(function($, win, doc, undefined){
    var resizeCallbackObj;
    var $rowEqualHeightColSet;
    var $equalHeightColFlexChildSet;
    var $moveBtnToBottomSet;
    var $moveBtnToBottomBtnSet;
    var $equalHeightColSet;
    var equalizeColumns = function equalizeColumns(){
        //Remove styles if this has been called before
        //console.log('FIRED');
        cleanupButtonMargins();
        cleanupColumnsHeights();
        if($('body').outerWidth() > 767){
            $rowEqualHeightColSet.each(function(){
                var $this = $(this);
                var largestHeight = 0;
                var $colSet = $this.children('.equal-height-col');
                $colSet.each(function(){
                    if($(this).innerHeight() > largestHeight){
                        largestHeight = $(this).innerHeight();
                    } 
                });
                if(largestHeight > 0) {
                    $colSet.each(function(){
                        var $this = $(this);
                        $this.innerHeight(largestHeight);
                        var extraHeight = largestHeight;
                        $this.children(':not(.equal-height-col-flex-child)').each(function(){
                            extraHeight = extraHeight - $(this).outerHeight();
                        });
                        if(extraHeight > 0){
                            $this.children('.equal-height-col-flex-child').height(extraHeight);
                        }
                    });
                    
                }
            });
            $('body').trigger('emory.equalizedheight');
        } else {
            $('body').trigger('emory.equalizedheight');
        }
    };
    cleanupColumnsHeights = function cleanupColumnsHeights() {
        $equalHeightColSet.removeAttr('style');
        $equalHeightColFlexChildSet.removeAttr('style');
    }
    cleanupButtonMargins = function cleanupButtonMargins() {
        $moveBtnToBottomBtnSet.removeAttr('style');
    }
    
    $(doc).ready(function(){
        //Setup global set for callback functions
        $rowEqualHeightColSet = $('.row-equal-height-col');
        $moveBtnToBottomSet = $('.move-btn-to-bottom');
        $equalHeightColSet = $('.row-equal-height-col > .equal-height-col');
        $equalHeightColFlexChildSet = $('.equal-height-col-flex-child');
        $moveBtnToBottomBtnSet = $('.move-btn-to-bottom > .btn');
        $('.points-of-pride .container').each(function(){
            $this = $(this);
            $points = $this.find('.media').detach();
            $this.append($points[Math.floor(Math.random()*$points.length)]);
        });
        if (!("ontouchstart" in win) && !navigator.msMaxTouchPoints) {
            $('body').addClass('no-touch');
        }
        setSubnavMargin();
        
        //remove margin from accordion panels in wysiwyg
        $( ".panel-group" ).parent(".pull-right").css( "margin-left", "0" );
        $( ".panel-group" ).parent(".pull-left").css( "margin-right", "0" );
    });
    
    $('body').on('emory.equalizedheight', function(){
        cleanupButtonMargins();
        $moveBtnToBottomSet.each(function(){
            var $this = $(this);
            var extraHeight = $this.innerHeight();
            var $theButton = $this.children('.btn');
            $this.children(':not(.btn)').each(function(){
                extraHeight = extraHeight - $(this).outerHeight();
            });
            if(extraHeight - $theButton.outerHeight(true) > 0){
                $theButton.css('margin-top', '0');
                $theButton.css('margin-top', (extraHeight - $theButton.outerHeight(true)) +'px');
            }
        });
    });
    
    $(win).load(function(){
        equalizeColumns();
    });
    $(win).resize(function() {
        setSubnavMargin();
        clearTimeout(resizeCallbackObj);
        // Long enough not to be trigger during active resizing && short enough not to a significant delay 
        resizeCallbackObj = setTimeout(equalizeColumns, 100);
    });
    
    setSubnavMargin = function setSubnavMargin() {
        if ($('#main-image').length){
            if ($(window).width() <= 768) {
                $('#subnav').css("margin-top", "20px");
            }
            else {
                $('#subnav').css("margin-top", "-50px");
            }
            
        }
    }
    
    $('a[href^="#"]').on('click', function (event) {
        var target = $($(this).attr('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
     
})(jQuery, window, document);