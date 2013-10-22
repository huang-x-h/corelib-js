(function() {
  var ztesoft = window.ztesoft = window.ztesoft || {};

  var StringProto = String.prototype;
  var nativeTrim = StringProto.trim;

  var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  ztesoft.trim = nativeTrim ? 
    function(text) {
      return text == null ? "" : nativeTrim.call(text);
    } :
    function(text) {
      return text == null ? "" : text.replace(rtrim, '');
    }
  ;

  ztesoft.addClass = function(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                              .replace(/[\n\t]/g, " ");

      _.each(cssClasses.split(' '), function(cssClass) {
        cssClass = ztesoft.trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });

      element.setAttribute('class', ztesoft.trim(existingClasses));
    }
  };

  ztesoft.removeClass = function(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      _.each(cssClasses.split(' '), function(cssClass) {
        element.setAttribute('class', ztesoft.trim(
            (" " + (element.getAttribute('class') || '') + " ")
            .replace(/[\n\t]/g, " ")
            .replace(" " + ztesoft.trim(cssClass) + " ", " "))
        );
      });
    }
  };

  ztesoft.on = function(element, eventType, handler) {

  };

  ztesoft.off = function(element, eventType, handler) {

  };

  ztesoft.inherit = function(childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    /** @override */
    childCtor.prototype.constructor = childCtor;
  }

  ztesoft.namespace = function(name) {
    var parts = name.split('.');
    var ns = window;

    for (var part; parts.length && (part = parts.shift());) {
      if (ns[part]) {
        ns = ns[part];
      } else {
        ns = ns[part] = {};
      }
    }

    return ns;
  };

})();