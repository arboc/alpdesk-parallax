$(document).ready(function () {

  (function () {

    $.fn.isInViewport = function () {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    var parallaxElements = [];
    var visibleElements = [];

    function prepareBackgroundvAlign(nodeHeight, srcHeight, vAlign) {
      var yPos = 0; // top
      if (vAlign === 'center') {
        yPos = Math.floor((nodeHeight / 2) - (srcHeight / 2));
      } else if (vAlign === 'bottom') {
        yPos = Math.floor(nodeHeight - (srcHeight));
      }
      return yPos;
    }

    function scroll() {
      for (var i = 0; i < parallaxElements.length; i++) {
        var parent = parallaxElements[i].node.parentNode;
        if ($(parent).hasClass('parallax')) {
          if ($(parent).isInViewport() && !checkVisibleExists(parallaxElements[i].node)) {
            visibleElements.push({
              node: parallaxElements[i].node,
              vAlign: parallaxElements[i].vAlign,
              hAlign: parallaxElements[i].hAlign
            });
          }
        }
      }
      updateVisibleElements();
    }

    function checkVisibleExists(element) {
      for (var i = 0; i < visibleElements.length; i++) {
        if (visibleElements[i].node === element) {
          return true;
        }
      }
      return false;
    }

    function updateVisibleElements() {
      for (var i = 0; i < visibleElements.length; i++) {
        setPosition(visibleElements[i]);
      }
    }

    function setPosition(element) {
      var vAlign = parseInt($(element.node).attr('data-parallax-valign'));
      var hAlign = $(element.node).attr('data-parallax-halign');
      var factor = 0.15;
      if (element.vAlign === 'bottom') {
        factor = factor * -1;
      }
      var yPos = (vAlign + (factor * ($(window).scrollTop() - element.node.getBoundingClientRect().top)));
      if (yPos > 0) {
        $(element.node).css({
          backgroundPositionY: yPos + 'px'
        });
      }
      $(element.node).css({
        backgroundPositionX: hAlign
      });

    }

    function init() {

      $('.has-responsive-background-image').each(function (index) {

        var el = $(this);
        var node = el.find('div.parallax-bgimage');
        if (node !== null) {

          var parallaxActive = node.data('isparallax');
          var sizeModus = node.data('sizemodus');
          var hAlign = node.data('halign');
          var vAlign = node.data('valign');
          var src = node.data('src');
          var srcHeight = node.data('srcheight');
          var srcWidth = node.data('srcwidth');

          node.css({
            backgroundImage: 'url(' + src + ')',
            backgroundSize: sizeModus
          });

          if (parallaxActive === 1) {

            if (sizeModus === 'cover') {
              node.height($(this).height() * 2);
              node.css({
                top: -($(this).height())
              });
            }

            node.attr('data-parallax-valign', prepareBackgroundvAlign(node.height(), srcHeight, vAlign));
            node.attr('data-parallax-halign', hAlign);

            parallaxElements.push({
              node: node[0],
              vAlign: vAlign,
              hAlign: hAlign
            });

            scroll();

          } else {

            node.css({
              backgroundPositionX: hAlign,
              backgroundPositionY: vAlign
            });

          }

        }

      });
    }

    init();

    if (!parallaxElements.length)
      return;

    $(window).on('scroll', scroll);
    $(window).on('resize', init);

  })();
});