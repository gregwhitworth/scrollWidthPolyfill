// Scroll Width Polyfill version 1.1
// Github: https://github.com/gregwhitworth/scrollWidthPolyfill
// License: MIT License (http://opensource.org/licenses/MIT)
var polyScrollWidth = (function (document, window) {

    var polyScrollWidth = window.polyScrollWidth || {
        "needsPoly": false,
        "usedPoly": false,
        "version": 1.1
    };

    var origScrollWidth = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth').get;

    init();

    // Init
    // ---------------------------------------------
    // This initializes the polyfill and checks to see
    // if the scrollWidth method is producing a reasonable
    // result, if so then no need to polyfill.
    function init() {
       var needsPoly = featureDetect();
       if(!needsPoly) {
           polyScrollWidth.needsPoly = false;
           return polyScrollWidth;
       } else {
           polyScrollWidth.needsPoly = true;
       }

       // Create new polyfill for scrollWidth since we need to polyfill it
       Object.defineProperty(Element.prototype, "scrollWidth", { configurable: true, enumerable: true, get: getScrollWidth });
    }

    // Feature Detect
    // ---------------------------------------------
    // Unfortunately we're making this polyfill for interop reasons, so we
    // need to do a quick test to ensure that it is implemented correctly.
    // Because of this we will create two ghost elements and then match them
    // to see if they return reasonable results for scrollWidth
    function featureDetect() {
       var needsPoly = false;
       var overrideStyles = [
             {
                   "name":"float",
                   "value":"left"
             },
             {
                   "name":"paddingLeft",
                   "value":"0px"
             },
             {
                   "name":"paddingRight",
                   "value":"0px"
             },
             {
                   "name":"position",
                   "value":"absolute"
             },
             {
                 "name":"width",
                 "value":"0px"
             },
             {
                 "name":"borderRightWidth",
                 "value":"0px"
             },
             {
                 "name":"borderLeftWidth",
                 "value":"0px"
             },
             {
                 "name":"visibility",
                 "value":"hidden"
             }
       ];

       var ghostMeasureInput = createGhostElement("input", null, overrideStyles, "Test", true);

       // Check within +/- 2 pixels for reasonable results of scrollWidth in comparison to clientWidth [both should include padding]
       if(ghostMeasureInput.scrollWidth == 0) {
             needsPoly = true;
       }

       return needsPoly;
    }

    // Create Ghost Element
    // ---------------------------------------------
    // This will create the ghost items and then return the measured results. It also
    // deletes the node and removes the HTML after it's done.
    // <param name="elType"" type="string">This is the type of element you want to create, for example a div</param>
    // <param name="computedStyles" type="CSSStyleDeclaration">These are the computed styles of the element you're wanting your ghost element to match</param>
    // <param name="overrideStyles" type="[{name, value}]">These are the styles you want to override on the new element (eg: [{"name":"visibility", "value":"hidden"}])</param>
    // <param name="content" type="string">This is the content that you want to be included in the element for measurement</param>
    // <param name="callScrollWidth" type="bool">Do you want to call scrollWidth, if you set this to true and the polyfill has been set you'll end up in a loop</param>
    // <return name="ghostMeasure" type="{"scrollWidth", "clientWidth"}">These are the two widths that we care about and will pass these back to the methods that want to do something with them</param>
    function createGhostElement(elType, computedStyles, /* [{ name, value }] */ overrideStyles,  content, callScrollWidth) {
          var id, el, ghostMeasure;
          elType = elType.toLowerCase();

          id = "swMeasure-" + Date.now();
          el = document.createElement(elType);
          el.id = id;

          var initStyle = el.style;

          if(computedStyles !== null) {
              var csKeys = Object.keys(computedStyles.__proto__);
              csKeys.forEach(function(prop) {
                  initStyle[prop] = computedStyles[prop];
              })
              el.style = initStyle;
          }

          overrideStyles.forEach(function(overrideStyle) {
                el.style[overrideStyle.name] = overrideStyle.value;
          });

          if(elType == "input" || elType == "textarea") {
                el.value = content;
          }
          else {
            el.textContent = content;
          }

          document.getElementsByTagName('body')[0].appendChild(el);

          el = document.getElementById(id);

          ghostMeasure = {
                "scrollWidth": (callScrollWidth) ? el.scrollWidth : 0,
                "clientWidth": parseInt(el.clientWidth, 10)
          };

          el.outerHTML = "";
          delete el;

          return ghostMeasure;
    }

    // Get Scroll Width
    // --------------------------------------------------------
    // Will get all necessary information from the input to
    // completely polyfill el.scrollWidth
    // <return type="int">The max of the element width or the clientWidth</return>
    function getScrollWidth() {
      if(this.nodeName != "INPUT" && this.nodeName != "TEXTAREA") return origScrollWidth.call(this);

      polyScrollWidth.usedPoly = true;
      var width = "auto";
      var computedStyles = window.getComputedStyle(this, null);

      // We only want to set the width of the container if it is a textarea since
      // that will need accurate wrapping. For any other input we just want the
      // length of the text as one long string so width should be ""
      if(this.nodeName == "TEXTAREA") width = computedStyles.width;

      var overrideStyles = [
        {
            "name": "position",
            "value": "absolute"
        },
        {
           "name": "float",
           "value": "left"
        },
        {
           "name":"visibility",
           "value":"hidden"
        },
        // We don't want the width set
        {
            "name":"width",
            "value": width
        }
      ];

      var ghost = createGhostElement("div", computedStyles, overrideStyles, this.value, false);

      return Math.max(parseInt(computedStyles.width), ghost.clientWidth); //scrollWidth returns the max of content or element width
    }

    return polyScrollWidth;
})(document, window);