(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var ViewStack = ns.ViewStack = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this.$element.data('ViewStack', this);
	};

	ztesoft.inherit(ViewStack, ztesoft.events.Event);

	ViewStack.prototype.selectedIndex = function(index) {
		var $children = this.$element.children();
		var $activeItem = this.$element.children('.active');
		var selectedIndex = $children.index($activeItem);

		if (arguments.length === 0) {
			return selectedIndex;
		}

		if (index < 0 || index > $children.length) {
			return;
		}

		if (selectedIndex !== index) {
			$activeItem.removeClass('active');
		}

		$children.eq(index).addClass('active');

		this.trigger('change');
	}

	ViewStack.prototype.addChild = function(element) {
		var index = this.$element.children('.tab-pane').length;
		this.addChildAt(element, index);
	}

	ViewStack.prototype.addChildAt = function(element, index) {
		var $children = this.$element.children('.tab-pane');
		if (index === $children.length) {
			$element.append(element);
		}
		else {
			$children.eq(index).before(element);
		}
		
		this.trigger('childAdd', element, index);
	}

	var old = $.fn.viewstack;

	$.fn.viewstack = function(options) {
		return this.each(function() {
			new ViewStack(this, options);
		})
	}

	$.fn.viewstack.noConflict = function() {
		$.fn.viewstack = old;
		return this;
	}

}(window.jQuery));