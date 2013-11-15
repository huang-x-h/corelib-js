/**
 * Title: popup.js
 * Description: popup.js
 * Author: huang.xinghui
 * Created Date: 13-11-15 上午11:06
 * Copyright: Copyright 2013 ZTESOFT, Inc.
 */
(function($) {
  var ns = ztesoft.namespace("ztesoft.components");

  var TEMPLATE = {
    'alert': '<div class="modal">' +
        '<div class="modal-header">' +
          '<button type="button" class="close js-close">&times;</button>' +
          '<h4 class="modal-title">Alert</h4>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p>{{message}}</p>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-default js-close">Close</button>' +
        '</div>' +
      '</div>',
    'info': '<div class="modal">' +
        '<div class="modal-header">' +
          '<button type="button" class="close js-close">&times;</button>' +
          '<h4 class="modal-title">Information</h4>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p>{{message}}</p>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-default js-close">Close</button>' +
        '</div>' +
      '</div>',
    'error': '<div class="modal">' +
        '<div class="modal-header">' +
          '<button type="button" class="close js-close">&times;</button>' +
          '<h4 class="modal-title">Error</h4>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p>{{message}}</p>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-default js-close">Close</button>' +
        '</div>' +
      '</div>',
    'confirm': '<div class="modal">' +
      '<div class="modal-header">' +
        '<button type="button" class="close js-close">&times;</button>' +
        '<h4 class="modal-title">Confirm</h4>' +
      '</div>' +
      '<div class="modal-body">' +
        '<p>{{message}}</p>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary js-ok">OK</button>' +
        '<button type="button" class="btn btn-default js-close">Cancel</button>' +
      '</div>' +
    '</div>'
  };

  function Alert(message) {
    this.message = message;
    this.init();
  };

  Alert.prototype.init = function() {
    this.$element = $(TEMPLATE.alert.replace('{{message}}', this.message));
    ns.Modal.addPopUp(this.$element, true);

    this.$element.find('.js-close').on('click', $.proxy(this._closeHandler, this));
  };

  Alert.prototype._closeHandler = function() {
    ns.Modal.removePopUp(this.$element);
  };

  function Information(message) {
    this.message = message;
    this.init();
  };

  Information.prototype.init = function() {
    this.$element = $(TEMPLATE.info.replace('{{message}}', this.message));
    ns.Modal.addPopUp(this.$element);

    this.$element.find('.js-close').on('click', $.proxy(this._closeHandler, this));
  };

  Information.prototype._closeHandler = function() {
    ns.Modal.removePopUp(this.$element);
  };

  function Confirm(message, closeHandler) {
    this.message = message;
    this.closeHandler = closeHandler;
    this.init();
  };

  Confirm.prototype.init = function() {
    this.$element = $(TEMPLATE.confirm.replace('{{message}}', this.message));
    ns.Modal.addPopUp(this.$element, true);

    this.$element.find('.js-close').on('click', $.proxy(this._closeHandler, this));
    this.$element.find('.js-ok').on('click', $.proxy(this._okHandler, this));
  };

  Confirm.prototype._closeHandler = function() {
    ns.Modal.removePopUp(this.$element);

    if (this.closeHandler) this.closeHandler(false);
  };

  Confirm.prototype._okHandler = function() {
    ns.Modal.removePopUp(this.$element);

    if (this.closeHandler) this.closeHandler(true);
  };

  ns.PopUp = {
    'alert': function(message){
      return new Alert(message);
    },
    'info': function(message){
      return new Information(message);
    },
    'confirm': function(message, closeHandler) {
      return new Confirm(message, closeHandler);
    }
  }
})(jQuery);