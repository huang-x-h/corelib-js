(function($, undefined) {
	var ns = ztesoft.namespace("ztesoft.components");

	var ComboBox = ns.ComboBox = function(element, options) {
		this.$element = $(element);
		this.$element.data('ComboBox', this);
	};

	ztesoft.inherit(ComboBox, ztesoft.events.Event);

	ComboBox.prototype.dataSource = function(array) {
		if (arguments.length === 0) {
			return this._dataSource;
		}

		this._dataSource = array;
		this._setDataSource();
	}

	ComboBox.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	}

	ComboBox.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this._selectedItem = value;
	}

	ComboBox.prototype._setSelectedIndex = function(index) {
		if (this._selectedIndex === index) {
			return;
		}

		var $children = this.$element.children();

		if (this._selectedIndex >= 0) {
			$children.eq(this._selectedIndex).removeProp('selected');
		}
		
		$children.eq(index).prop('selected');
		this._selectedIndex = index;
	}

	ComboBox.prototype._setDataSource = function() {
		var html = [];
		$.each(this._dataSource, function(index, element) {
			html.push('<option>' + element + '</option>');
		});

		this.$element.append(html.join(''));
		this.selectedIndex = 0;
	}

	var old = $.fn.combobox;

	$.fn.combobox = function(options) {
		return this.each(function() {
			new ComboBox(this, options);
		})
	}

	$.fn.combobox.noConflict = function() {
		$.fn.combobox = old;
		return this;
	}

}(window.jQuery));