(function($) {
  var ns = ztesoft.namespace('ztesoft.components');

  var TabNavigator = ns.TabNavigator = function(element, options) {
    this.$element = $(element);
  };

  $.extend(TabNavigator.prototype, ztesoft.events.Event);

  TabNavigator.prototype.render = function() {
    this.$tabBar = this.$element.children('.nav');
    this.$tabConent = this.$element.children('.tab-content');
    this._selectedIndex = 0;
    this.$tabBar.on('click', $.proxy(this._tabClickHandler, this));
  };

  TabNavigator.prototype.selectedIndex = function(index) {
    if (arguments.length === 0) {
      return this._selectedIndex;
    }

    this._setSelectedIndex(index);
  }

  TabNavigator.prototype._setSelectedIndex = function(index) {
    var $li;
    if (this._selectedIndex === index) {
      return;
    }

    this.$tabBar.children().filter('.active').removeClass('active');
    this.$tabConent.children().filter('.active').removeClass('active');

    $li = this.$tabBar.children().eq(index);
    $li.addClass('active');
    this.$tabConent.children().filter($li.children('a').attr('href')).addClass('active');
    this._selectedIndex = index;
    this.trigger('change', index);
  };

  TabNavigator.prototype._tabClickHandler = function(event) {
    event.preventDefault();
    var $li = $(event.target).closest('li');
    this._setSelectedIndex(this.$tabBar.children().index($li));
  };
})(jQuery);