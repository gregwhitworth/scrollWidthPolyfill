// This will determine if you need to polyfill for an interopable scroll width
var polyScrollWidth = (function (document, window) {
    var startTime = new Date().getTime();
    var polyScrollWidth = window.polyScrollWidth || {
      version: 0.1,
      getScrollWidth: getScrollWidth,
      getPadding: getPadding,
      duration: 0
    };
  
    // Get Scroll Width
    // --------------------------------------------------------
    // Will get all necessary information from the input to
    // completely polyfill el.scrollWidth
    function getScrollWidth(el) {
      var fontSize, padding, width, value, scrollWidth, expectedContentLength, fontFamily, fontWeight, node;
      
      scrollWidth = el.scrollWidth;
      padding = getPadding(el);     
      width = window.getComputedStyle(el, null).getPropertyValue("width");
      width = parseInt(width);
      node = el.nodeName;
      
      if(scrollWidth != (padding+width)) return scrollWidth;
          
      fontSize = window.getComputedStyle(el, null).getPropertyValue("font-size");
      fontFamily = window.getComputedStyle(el, null).getPropertyValue("font-family");
      fontWeight = window.getComputedStyle(el, null).getPropertyValue("font-weight"); 
      value = el.value;
      
      expectedContentLength = createMeasurementDiv(value, fontSize, padding, fontFamily, fontWeight, width, node)
      
      polyScrollWidth.duration = new Date().getTime() - startTime;
      
      return Math.max(width, expectedContentLength); //scrollWidth returns the max of content or element width
    }
    
    // Create Measurement Div
    // --------------------------------------------------------
    // Unfortunately we don't have any font metric api's so to know
    // how wide the content would have been rendered we have to produce
    // an invisible div, get it's width and then send that back.
    function createMeasurementDiv(value, fontsize, padding, fontfamily, fontWeight, width, node) {
          var div, id, contentMeasure;
          
          // Create new div so that we get accurate font measurement
          id = "swMeasure-" + new Date().toJSON().slice(0,10);
          div = document.createElement('div');
          div.id = id;
          div.style.position = "absolute";
          div.style.float = "left";
          //div.style.visibility = "hidden";
          div.style.fontWeight = fontWeight;          
          div.style.fontSize = fontsize;
          div.style.fontFamily = fontfamily;
          div.style.padding = padding/2;
          if(node == "TEXTAREA") {
                div.style.width = width + "px";
          }
          else {
                div.style.whiteSpace = "nowrap";
          }
          div.textContent = value;
          
          document.getElementsByTagName('body')[0].appendChild(div);
          
          // Now get the width
          div = document.getElementById(id);
          contentMeasure = div.clientWidth;
          
          // Remove pointless div
          div.outerHTML = "";
          delete div;
          
          return contentMeasure;
    }
  
    // Get Padding
    // --------------------------------------------------------
    // For some reason I wasn't getting my expected result from
    // the padding computed style and find it works better by getting left and right
    // and then combining the two back together.
    function getPadding(el) {
      var paddingLeft, paddingRight, padding;
      
      paddingLeft = window.getComputedStyle(el, null).getPropertyValue("padding-left");
      paddingRight = window.getComputedStyle(el, null).getPropertyValue("padding-right");
      paddingLeft = parseInt(paddingLeft);
      paddingRight = parseInt(paddingRight);
      padding = paddingLeft + paddingRight;
      return padding;
    }
    
    return polyScrollWidth;
})(document, window);