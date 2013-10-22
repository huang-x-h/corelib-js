(function($, undefined) {
	var ns = ztesoft.namespace("ztesoft.components");

	var ComboBox = ns.ComboBox = function(element, options) {
		this.element = element;
		this.textField = this.element.querySelector('input');
		this.addOn = this.element.querySelector('.input-group-addon');
		_.extend(this, ComboBox.DEFAULTS, options);
		$(this.addOn).on('click', _.bind(this.show, this));
	};

	_.extend(ComboBox.prototype, ztesoft.events.Event);

	ComboBox.DEFAULTS = {
		'labelField': null,
		'labelFunction': null
	}

	ComboBox.prototype.render = function() {
		// $(this.element).append('<ul class="dropdown-menu"></ul>');
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'dropdown-menu');
		this.element.appendChild(ul);
		this.list = new ns.List(ul, {
			'labelField': this.labelField,
			'labelFunction': this.labelFunction,
			'dataSource': this.dataSource
		});
		this.list.render();
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
		
	};

	ComboBox.prototype._itemClickHandler = function() {
		this._selectedIndex = this.list.selectedIndex();
		this._selectedItem = this.list.selectedItem();
		this.textField.value = this.list.itemToLabel(this._selectedItem);
		this.hide();
	};

	ComboBox.prototype.enable = function() {

	};

	ComboBox.prototype.disable = function() {

	};

	ComboBox.prototype.show = function() {
		ztesoft.addClass(this.element, 'open');
	};

	ComboBox.prototype.hide = function() {
		ztesoft.removeClass(this.element, 'open');
	};

	ComboBox.prototype.destory = function() {
		this.list.remove();
		this.addOn.off('click');
	};

})(window.jQuery);