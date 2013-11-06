(function($) {
	var ns = ztesoft.namespace("ztesoft.components");

	var ComboBox = ns.ComboBox = function(element, options) {
		this.$element = $(element);
		this.textField = this.$element.find('input');
		this.addOn = this.$element.find('.input-group-addon');
		$.extend(this, ComboBox.DEFAULTS, options);
		this.addOn.on('click', $.proxy(this.show, this));
	};

  $.extend(ComboBox.prototype, ztesoft.events.Event);

	ComboBox.DEFAULTS = {
		'labelField': null,
		'labelFunction': null
	};

	ComboBox.prototype.render = function() {
		this.list = new ns.List(this.$element[0], {
			'labelField': this.labelField,
			'labelFunction': this.labelFunction,
			'dataSource': this.dataSource
		});
		this.list.render();
    this.list.$ul.addClass('popup');
		this.list.on('itemClick', _.bind(this._itemClickHandler, this));
	};

	ComboBox.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	};

	ComboBox.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this._selectedItem = value;
	};

	ComboBox.prototype._setSelectedIndex = function(index) {
		this.list._setSelectedIndex(index);
		this._selectedIndex = this.list.selectedIndex();
		this._selectedItem = this.list.selectedItem();
		this.textField.val(this.list.itemToLabel(this._selectedItem));
		this.trigger('change', this._selectedItem);
	};

	ComboBox.prototype._itemClickHandler = function() {
		this._selectedIndex = this.list.selectedIndex();
		this._selectedItem = this.list.selectedItem();
		this.textField.val(this.list.itemToLabel(this._selectedItem));
		this.hide();
	};

	ComboBox.prototype.enable = function() {

	};

	ComboBox.prototype.disable = function() {

	};

	ComboBox.prototype.show = function() {
		this.$element.addClass('open');
	};

	ComboBox.prototype.hide = function() {
    this.$element.removeClass('open');
	};

	ComboBox.prototype.destory = function() {
		this.list.remove();
	};

})(jQuery);