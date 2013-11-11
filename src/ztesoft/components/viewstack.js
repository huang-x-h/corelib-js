(function($) {
  var ns = ztesoft.namespace('ztesoft.components');

  var ViewStack = ns.ViewStack = function(element, options) {
    this.$element = $(element);
  };

  $.extend(ViewStack.prototype, ztesoft.events.Event);

  ViewStack.prototype.render = function() {
    var active = this.$element.children('.active');
    this._selectedIndex = this.$element.children().index(active);
  };

  ViewStack.prototype.selectedIndex = function(index) {
    if (arguments.length === 0) {
      return this._selectedIndex;
    }

    this._setSelectedIndex(index);
  };

  ViewStack.prototype._setSelectedIndex = function(index) {
    if (this._selectedIndex === index) {
      return;
    }

    this.$element.children('.active').removeClass('active');
    this.$element.children().eq(index).addClass('active');
    this.trigger('change', index);
  };

})(jQuery);