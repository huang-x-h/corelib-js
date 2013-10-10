(function($, undefined) {
	var ztesoft = window.ztesoft = window.ztesoft || {};


  ztesoft.inherit = function(childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    /** @override */
    childCtor.prototype.constructor = childCtor;
  };

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

}(window.jQuery));