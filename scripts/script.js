var totalWidth = 0; 
var modules = []; // created on load and checked at every resize
var dragState =  false;

var reformat = function(){
    // Size wrapper elements
    var headfinal = $(window).width(); // final width of the header taking into account the navbar
    var wH = $(window).height();
    var wrapperH = wH-40;
    var tab = wrapperH-80;

    $('#ht-head').css({ width : headfinal + 'px' } );
    $('#ht-wrapper').css({ width : headfinal + 'px', height: wrapperH + "px" } );
    $('.ht-tab').css({ height: tab + 'px'});

    // Adjust slider on changes
    $('#ht-slider').width( Math.pow(headfinal, 2) / $('#ht-content').width() + 'px')
        .css('left', $('#ht-wrapper').scrollLeft() * $('#ht-head').width()/$('#ht-content').width() + 'px');
    // Resize header modules 
    for(var i = 0; i < modules.length; i++){
        var o = modules[i]; 
        var contentWidth = $('#ht-content').width();  // width of the module
        var headWidth = $('#ht-head').width();  

        // +40 = fix for margin space
        var width = ($('.ht-tab[data-id="'+o.id+'"]').width()+40)/contentWidth*100;
        $('.ht-hdiv[data-hid="'+o.id+'"]').css( { width : width+'%'});    
    }
    $(".grid").css({ height : '400px' } );
};

// Build the header modules from the modules loaded 
$('.ht-tab').each(function(){
    var header = $(this).children('.ht-tab-header');
    var id = $(this).attr('data-id'); // Get id 
    var title = header.find("h3").text(); // Get the title
    var width = $(this).width();  // Get the width 
    totalWidth = totalWidth+width;
    var bg = header.attr("data-bg");
    
    // Build the head 
    // $('#ht-head').append('<div class="ht-hdiv bg-'+bg+'" data-hid="'+id+'" ><span class="ht-hdiv-content">'+title+'</span></div>')
    $('#ht-head').append('<div class="ht-hdiv bg-'+bg+'" data-hid="'+id+'" >'+title+'</div>');

    //below is an example with space between header mods, doesn't look great......
    // var space = 40/$('#ht-content').width();
    // $('#ht-head').append('<div class="ht-hdiv background-color:black; width:'+ space +'px;"></div><div class="ht-hdiv bg-'+bg+'" data-hid="'+id+'" >'+title+'</div>');

    // ScrollTo initialization. 
    $(document).on('click', '.ht-hdiv', function(){
        var id = $(this).attr('data-hid');
        $('#ht-wrapper').scrollTo($('.ht-tab[data-id="'+id+'"]'), 200,  {offset:-50});
    }
    );
    modules.push({id : id, width : width, title : title});
    reformat();  
});

// jquery-ui Resizable options
$('.ht-tab').resizable({
    grid: 100,
    minWidth : 600,
    maxWidth: 1200,
    // could be one, no need ielse
    stop: function( event, ui ) {
        if(ui.size.width > ui.originalSize.width){
            console.log(ui.size.width, ui.originalSize.width);
            var change = ui.size.width - ui.originalSize.width;
            var contentSize = $('#ht-content').width()+change;
            $('#ht-content').css({width : contentSize+'px'});
            reformat();
        } else {
            var change = ui.size.width - ui.originalSize.width;
            var contentSize = $('#ht-content').width()+change;
            $('#ht-content').css({width : contentSize+'px'});
            reformat();
        }
    }
});
    $('.grid > div').resizable({
        grid : 50,
        stop : function(){
            $(".grid").trigger("ss-rearrange");
        }
    });

    $(".grid").shapeshift({
        minColumns: 3,
        align: "left",
        colWidth : 120
    });
    $containers = $(".grid");
    $containers.on('ss-added', function(e, selected){
        var iwidth = $(selected).width();
        var cwidth = $(this).width();
        $(this).closest('.ht-tab').width(cwidth+iwidth);
        reformat();
    });
    $containers.on('ss-removed', function(e, selected){
        var iwidth = $(selected).width();
        var cwidth = $(this).width();
        $(this).closest('.ht-tab').width(cwidth-iwidth);
        reformat();
    });

    var htOnScroll = function() {     
        $('#ht-slider').css('left', $('#ht-wrapper').scrollLeft()*$('#ht-head').width()/$('#ht-content').width() + 'px');
    };
    $('#ht-wrapper').on('scroll', htOnScroll );

$('#ht-slider').draggable({ axis: "x", containment: 'window' });

$('#ht-slider').mousedown(
    function(){$('#ht-wrapper').off('scroll' );}
    );

$(document).mouseup(
    function(){$('#ht-wrapper').on('scroll', htOnScroll);}
    );

$('#ht-slider').on('drag', function(){
    $('#ht-wrapper').scrollTo($('#ht-slider').offset().left*$('#ht-content').width()/$('#ht-head').width(),0);
});

$(window).resize(reformat); 

    $('#1min').one("click", mminimize);

    function mminimize() {
        $('#1min').attr('expand-size', $('#1tab').width());
        $('#1content').hide();
        $('#1tabhead').hide();
        // $("#1tab").animate({
        //     width: '39px'
        // }, 200);
        $("#1tab").css("width", '39px' );
        reformat();
        $('#1tab .fa-minus').hide();
        $('#1tab .fa-plus').show();
        $(this).one("click", mmaximize);
        reformat();
    }

    function mmaximize() {
        // $("#1tab").animate({
        //     width: $('#1min').attr('expand-size') + 'px'
        // }, 200);
        $("#1tab").css("width", $('#1min').attr('expand-size') + 'px' );
        $(this).one("click", mminimize);
        $('#1tab .fa-minus').show();
        $('#1tab .fa-plus').hide();
        $('#1content').show();
        $('#1tabhead').show();
        reformat();
    }

    // shrink the state to show all mods
    $('#stupid').click(function(){
        $('#stupid').hide();
        $('#exposeOff').show();
        var headfinal = $(window).width();
        var wH = $(window).height();
        var modlens = 0; // full lenght of mods
        $.each(modules, function(i, module) {
           // modlens += $('.ht-tab[data-id="'+i+'"]').width() + 40; 
           modlens += module.width + 40;
        });

        for(var i = 0; i < modules.length; i++){
            var o = modules[i]; 
            $('.ht-tab[data-id="'+o.id+'"] .ht-tab-content').hide();
            var contentWidth = $('#ht-content').width();  // width of the module
            // $('ht-tab-content').attr('restore-width', contentWidth);
            var headWidth = $('#ht-head').width();  
        
            var modwidth = $('.ht-tab[data-id="'+o.id+'"]').width() +2; //  +2 compensates
            var width = (modwidth-40)/(modlens+80);
            console.log(modwidth);
            $('.ht-tab[data-id="'+o.id+'"]').attr('restore-width', modwidth);
            // $('.ht-tab[data-id="'+o.id+'"]').css( { width : width*headfinal+'px'});
            // $('.ht-tab[data-id="'+o.id+'"]').css( { height : 300 +'px'});    
            $('.ht-tab[data-id="'+o.id+'"]').animate( { width : width*headfinal+'px', height : 300 +'px' }, 200);
            // $('.ht-tab[data-id="'+o.id+'"]').animate( { width : width*headfinal+'px'}, 200);
            $( "#ht-content" ).sortable("enable");
            // reformat();
        }
    });
    // re expand the state 
    $('#exposeOff').click(function(){
        $('#stupid').show();
        $('#exposeOff').hide();

        var headfinal = $(window).width(); // final width of the header taking into account the navbar
        var wH = $(window).height();
        var wrapperH = wH-26;
        var tab = wrapperH-60;

        // $('.ht-tab').css({ height: tab + 'px'});

        for(var i = 0; i < modules.length; i++){
            var o = modules[i]; 
            var width = $('.ht-tab[data-id="'+o.id+'"]').attr('restore-width');
            // $('.ht-tab[data-id="'+o.id+'"]').css( { width : width+ 'px'});
            // $('.ht-tab[data-id="'+o.id+'"]').animate( { width : width+ 'px', height: tab + 'px'},200);
            $('.ht-tab[data-id="'+o.id+'"]').animate( { width : width},200);
            $('.ht-tab[data-id="'+o.id+'"] .ht-tab-content').show();
            $("#ht-content").sortable("disable");
            setTimeout(function(){
                reformat();
            }, 200);
        }
    });
    // let escape key exit expanded state

    // add sortable, refresh modules,
    $(function() {
        $("#ht-content").sortable({
            placeholder: "ghost-element ht-tab ui-state-default"
            // update:function(){
            //     modules = [];
            //     $('.ht-tab').each(function(){
            //     var header = $(this).children('.ht-tab-header');
            //     var id = $(this).attr('data-id'); // Get id 
            //     var title = header.find("h3").text(); // Get the title
            //     var width = $(this).width();  // Get the width 
            // //     modules.push({id : id, width : width, title : title});
            //     // reformat();
            //     });
            // }
            });

        $("#ht-content").sortable( "disable" );
        $("#ht-content").disableSelection();
  });