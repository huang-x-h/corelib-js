/**
 * Title: loadingbox.js
 * Description: loadingbox.js
 * Author: huang.xinghui
 * Created Date: 13-11-12 下午2:00
 * Copyright: Copyright 2013 ZTESOFT, Inc.
 */
(function($) {
  var ns = ztesoft.namespace('ztesoft.components');

  var instance;

  var LoadingBox = ns.LoadingBox = function() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.init();
  };

  LoadingBox.DEFAULTS = {
    'template': '<div class="modal">' +
        '<div class="modal-dialog">' +
        'Loading' +
        '</div>' +
      '</div>'
  };

  LoadingBox.prototype.init = function() {
    this.invokeCount = 0;
    this.$element = $(LoadingBox.DEFAULTS.template);
  };

  LoadingBox.prototype.show = function() {
    this.invokeCount++;

    if (this.invokeCount === 1) {
      ns.Modal.addPopUp(this.$element, true);
    }
  };

  LoadingBox.prototype.hide = function() {
    this.invokeCount--;

    if (this.invokeCount === 0) {
      ns.Modal.removePopUp(this.$element, true);
    }
  };
})(jQuery);