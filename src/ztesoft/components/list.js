(function($, window, document, undefined) {
	var ztesoft = window.ztesoft;
	var ns = ztesoft.namespace("ztesoft.components");

	var List = ns.List = function(element, options) {
		this.type = 'List';
		this.selectedIndex = -1;
		this.selectedItem = null;
		this.element = element;
		this.$element = $(element);
		this.options = options;
		this.metadata = this.$element.data('plugin.options');
		this.$element.data('List', this);
		this.$element.css('list-group');

		this.init();
	};

	ztesoft.inherit(List, ztesoft.events.Event);

	List.prototype.init = function() {
		this.config = $.extend({}, List.DEFAULTS, this.options, this.metadata);

		var _this = this;
		var html = [];

		$.each(this.config.dataSource.source, function(index, element){
			html.push('<li class="list-group-item">' + _this.itemToLabel(element) + '</li>');
		});

		this.$element.append(html.join(''));

		this.$element.on('click.' + this.type, $.proxy(this._clickHandler, this));
		this.config.dataSource.on('add', $.proxy(this._collectionAddHandler, this));
		this.config.dataSource.on('remove', $.proxy(this._collectionRemoveHandler, this));
	};

	List.prototype.itemToLabel = function(data) {
		if (!data) {
			return '';
		}

		if (this.labelFunction != null) {
			return this.labelFunction(data);
		} 
		else if (this.labelField != null) {
			return data(this.labelField);
		}
		else {
			return data;
		}
	};

	List.prototype.seekSelectedItem = function(data) {
		var i, index = -1, n = this.config.dataSource.length;
		if (this.dataKeyField) {
			for (i = 0; i < n; i++) {
				if (this.config.dataSource[i][dataKeyField] == data) {
					index = i;
					break;
				}
			}
		}
		else {
			for (i = 0; i < n; i++) {
				if (this.config.dataSource[i] == data) {
					index = i;
					break;
				}
			}
		}

		if (index != -1) {
			this._setSelected(index, this.$element.find('li').eq(index));
		}
	};

	List.prototype._setSelected = function(index, $item) {
		if (this.$selectedItem) {
			this.$selectedItem.removeClass('active');
		}

		this.$selectedItem = $item;
		this.$selectedItem.addClass('active');
		this.selectedIndex = index;
		this.selectedItem = this.config.dataSource.getItemAt(index);
		this.trigger('change.' + this.type);
	};

	List.prototype._clickHandler = function(event) {
		var $target = $(event.target);
		if ($target.is('li')) {
			this._setSelected(this.$element.find('li').index($target), $target);
			this.trigger('click.' + this.type);
		}
	};

	List.prototype._collectionAddHandler = function(item, index) {
		var $item = $('<li class="list-group-item">' + this.itemToLabel(item) + '</li>');
		this.$element.find('li').eq(index - 1).after($item);
		this._setSelected(index, $item);
	};

	List.prototype._collectionRemoveHandler = function(index) {
		this.$element.find('li').eq(index).remove();
	};

	List.DEFAULTS = {
		dataSource:[],
		rowCount: 6,
		labelField:null,
		labelFunction:null,
		dataKeyField:null
	}

	var old = $.fn.list;

	$.fn.list = function(options) {
		return this.each(function() {
			new List(this, options);
		})
	}

	$.fn.list.noConflict = function() {
		$.fn.list = old;
		return this;
	}

})(window.jQuery, window, document);