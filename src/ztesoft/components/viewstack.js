(function() {
	var ns = ztesoft.namespace('ztesoft.components');

	var ViewStack = ns.ViewStack = function(element, options) {
		this.element = element;
		
		var div = this.element.querySelector('.active');
		if (div) {
			this._selectedIndex = _.indexOf(this.element.children, div);
		}
		else {
			this._selectedIndex = -1;
		}
	};

	_.extend(ViewStack.prototype, ztesoft.events.Event);

	ViewStack.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	};

	ViewStack.prototype.append = function(element) {
		this.element.appendChild(li);
	};

	ViewStack.prototype.appendAt = function(element, index) {
		var refElement = this.element.children[index];
		this.element.insertBefore(element, refElement);
	};

	ViewStack.prototype._setSelectedIndex = function(index) {
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
		this.trigger('change');
	};

})();