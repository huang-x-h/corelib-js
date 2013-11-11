(function($) {
	var ns = ztesoft.namespace("ztesoft.components");

	var List = ns.List = function(element, options) {
    this.$element = $(element);
		this._selectedItem = null;
		this._selectedIndex = -1;

		$.extend(this, List.DEFAULTS, options);
	};

	$.extend(List.prototype, ztesoft.events.Event);

	List.prototype.render = function() {
		var _this = this;
		var html = ['<ul class="list">'];
        this.dataSource.forEach(function(item) {
            html.push('<li><a href="#">' + _this.itemToLabel(item) + '</a></li>');
        });
        html.push('</ul>');

        this.$ul = $(html.join(''));
		this.$element.append(this.$ul);
		this.$ul.on('click', $.proxy(this._clickHandler, this));
	};

	List.prototype.itemToLabel = function(data) {
		if (!data) {
			return '';
		}

		if (this.labelFunction != null) {
			return this.labelFunction(data);
		}
		else if (this.labelField != null) {
			return data[this.labelField];
		}
		else {
			return data;
		}
	};

	List.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		var oldIndex = this._selectedIndex;
		if (oldIndex !== index) {
			this._setSelectedIndex(index);
		}
	};

	List.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this.selectedIndex(this.dataSource.indexOf(value));
	};

	List.prototype.append = function(item) {
		this.$ul.append('<li><a href="#">' + this.itemToLabel(item) + '</a></li>');
		this.dataSource.push(item);
		this._setSelectedIndex(this.dataSource.length);
	};

	List.prototype.appendAt = function(item, index) {
		this.$ul.children().eq(index).before('<li><a href="#">' + this.itemToLabel(item) + '</a></li>');
		this.dataSource.splice(index, 0, item);
		this._setSelectedIndex(index);
	};

	List.prototype.remove = function(index) {
		this.$ul.children().eq(index).remove();
		this.dataSource.splice(index, 1);
		this._setSelectedIndex(index);
	};

	List.prototype.update = function(item) {
		var index = this.dataSource.indexOf(item);
		var li = this.$ul.children[index];
		li.innerHTML = '<a href="#">' + this.itemToLabel(item) + '</a>';
	};

	List.prototype.destroy = function() {
		this.$ul.remove();
	};

	List.prototype._setSelectedIndex = function(index) {
		var $li = this.$ul.children();
		$li.filter('.active').removeClass('active');
		$li.eq(index).addClass('active');
		this._selectedIndex = index;
		this._selectedItem = this.dataSource[index];
		this.trigger('change', this._selectedItem);
	};

	List.prototype._clickHandler = function(event) {
		event.preventDefault();
    var $li = $(event.target).closest('li');
    var index = this.$ul.children().index($li);
    this.selectedIndex(index);
    this.trigger('itemClick', this._selectedItem);
	};

	List.DEFAULTS = {
		rowCount: 6,
		labelField:null,
		labelFunction:null,
		dataKeyField:null
	};
})(jQuery);