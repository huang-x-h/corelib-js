/**
 * Title: modal.js
 * Description: modal.js
 * Author: huang.xinghui
 * Created Date: 13-11-8 下午2:33
 * Copyright: Copyright 2013 ZTESOFT, Inc.
 */
(function($) {
  var ns = ztesoft.namespace("ztesoft.components");

  var Modal = ns.Modal = function(options) {
    $.extend(this, Modal.DEFAULTS, options);
  };

  $.extend(Modal.prototype, ztesoft.events.Event);

  Modal.DEFAULTS = {
    'title': 'Modal',
    'content': '',
    'modal': false,
    'template': '<div class="modal">' +
        '<div class="modal-dialog">' +
          '<div class="modal-header">' +
            '<button type="button" class="close js-close">&times;</button>' +
            '<h4 class="modal-title"><%= title %></h4>' +
          '</div>' +
          '<div class="modal-body">' +
            '<p><%= content %></p>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default js-close">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>'
  }

  Modal.prototype.render = function() {
    this.$element = $(_.template(Modal.DEFAULTS.template, {'title': this.title, 'content': this.content}));
    this.$element.appendTo(document.body);

    this.$element.find('.js-close').on('click', $.proxy(this._closeHandler, this));
    this._place();
  };

  Modal.prototype.show = function() {
    this.$element.addClass('show');
    this.trigger('show');
  };

  Modal.prototype.hide = function() {
    this.$element.removeClass('show');
    this.trigger('hide');
  };

  Modal.prototype._place = function() {
  };

  Modal.prototype._closeHandler = function(event) {
    this.hide();
  };
})(jQuery);