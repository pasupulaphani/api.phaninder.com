;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $('input, textarea').placeholder();
    // animate after load
    setTimeout(function(){
      $('#gavatar').addClass("bounce");
    }, 500)
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

  $(window).scroll(function(e){
    window.scrollY>130 ? ($("#home").addClass("fix")) : ($("#home").removeClass("fix"));
  });

  // animate depending on the scroll position
  $(window).scroll(function() {
    $('#shareposticons').each(function(){
      var imagePos = $(this).offset().top;

      var topOfWindow = $(window).scrollTop();
      if (imagePos < topOfWindow+1000) {
        $(this).addClass("slideExpandUp");
      }
    });
    $('#findmeicons').each(function(){
      var imagePos = $(this).offset().top;

      var topOfWindow = $(window).scrollTop();
      if (imagePos < topOfWindow+1000) {
        $(this).addClass("hatch");
      }
    });
  });

  $('#shareposticons li').hover(function(){
    $(this).addClass("pulse");
  }, function(){
      setTimeout(function(){
        $(this).removeClass("pulse");
      }.bind(this), 2000)
  });

  $('#findmeicons .anime').hover(function(){
    $(this).addClass("floating");
  }, function(){
    $(this).removeClass("floating");
  });


  $('#gavatar').hover(function(){
    $(this).addClass("tossing");
  }, function(){
      $(this).removeClass("tossing");
      $(this).removeClass("bounce");
  });

})(jQuery, this);