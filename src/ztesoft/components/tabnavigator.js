(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var TabNavigator = ns.TabNavigator = function(element, options) {
		this.options = options;
		this.$element = $(element);

		this.$element.data('TabNavigator', this);
	};

	ztesoft.inherit(TabNavigator, ztesoft.events.Event);

	TabNavigator.prototype.init = function() {
		this.viewstack = this.$element.children('div').viewstack();
		this.$element.children('ul').on('click', $.proxy(_tabClickHandler, this));
	}

	TabNavigator.prototype.selectedIndex = function(index) {
		var $children = this.$element.children();
		var $activeItem = this.$element.children('.active');
		var selectedIndex = $children.index($activeItem);

		if (arguments.length === 0) {
			return this.viewstack.selectedIndex();
		}

		if (index < 0 || index > $children.length) {
			return;
		}

		this.viewstack.selectedIndex(index);

		$children.eq(index).addClass('active');

		this.trigger('change');
	}

	TabNavigator.prototype._tabClickHandler = function(event) {
		var $li = $(event.target).parent('li');
		var selectedIndex = 
	}

	var old = $.fn.tab;

	$.fn.tabnavigator = function(options) {
		return this.each(function() {
			new TabNavigator(this, options);
		})
	}

	$.fn.tabnavigator.noConflict = function() {
		$.fn.tabnavigator = old;
		return this;
	}

}(window.jQuery));