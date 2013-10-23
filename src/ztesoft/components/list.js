(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var List = ns.List = function(element, options) {
		this.dataSource = null;
		this._selectedItem = null;
		this._selectedIndex = -1;

		this.element = element;

		_.extend(this, List.DEFAULTS, options);
	};

	_.extend(List.prototype, ztesoft.events.Event);

	List.prototype.render = function() {
		var _this = this;
		var html = [];

		_.each(this.dataSource, function(item, index){
			html.push('<li><a>' + _this.itemToLabel(item) + '</a></li>');
		});

		this.element.innerHTML = html.join('');
		this.element.addEventListener('click', _.bind(this._clickHandler, this));
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

		this._setSelectedIndex(index);
	};

	List.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this.selectedIndex(_.indexOf(this.dataSource, value))
	};

	List.prototype.append = function(item) {
		var li = document.createElement('li');
		li.innerHTML = this.itemToLabel(item);
		this.element.appendChild(li);
		this.dataSource.push(item);
	};

	List.prototype.appendAt = function(item, index) {
		var li = document.createElement('li');
		li.innerHTML = this.itemToLabel(item);

		var refLi = this.element.children[index];
		this.element.insertBefore(li, refLi);
		this.dataSource.splice(index, 0, item);
	};

	List.prototype.remove = function(index) {
		this.element.removeChild(this.element.children[index]);
		this.dataSource.splice(index, 1);
	};

	List.prototype.update = function(item) {
		var index = _.indexOf(this.dataSource, item);
		var li = this.element.children[index];
		li.innerHTML = this.itemToLabel(item);
	};

	List.prototype.destory = function() {
		this.element.remove();
	};

	List.prototype.seekSelectedItem = function(data) {
		var i, index = -1, n = this.dataSource.length;
		if (this.dataKeyField) {
			for (i = 0; i < n; i++) {
				if (this.dataSource[i][dataKeyField] == data) {
					index = i;
					break;
				}
			}
		}
		else {
			for (i = 0; i < n; i++) {
				if (this.dataSource[i] == data) {
					index = i;
					break;
				}
			}
		}

		if (index != -1) {
			this._setSelectedIndex(index);
		}
	};

	List.prototype._setSelectedIndex = function(index) {
		var oldIndex = this._selectedIndex;
		if (oldIndex === index) {
			return;
		}

		var children = this.element.children;
		if (oldIndex !== -1) {
			ztesoft.removeClass(children[oldIndex], 'active');
		}

		ztesoft.addClass(children[index], 'active');
		this._selectedIndex = index;
		this._selectedItem = this.dataSource[index];
		this.trigger('change');
	};

	List.prototype._clickHandler = function(event) {
		if (event.target.tagName === 'A') {
			var index = _.indexOf(this.element.children, event.target.parentElement);
			this.selectedIndex(index);
			this.trigger('itemClick');
		}
	};

	List.DEFAULTS = {
		rowCount: 6,
		labelField:null,
		labelFunction:null,
		dataKeyField:null
	};
})();