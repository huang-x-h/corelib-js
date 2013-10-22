(function() {
	var ns = ztesoft.namespace('ztesoft.components');

	var TabNavigator = ns.TabNavigator = function(element, options) {
		this.element = element;
		this.tabBar = this.element.querySelector('.nav');
		this.tabConent = this.element.querySelector('.tab-content');
		this._selectedIndex = 0;
		$(this.tabBar).on('click', _.bind(this._tabClickHandler, this));
	};

	_.extend(TabNavigator.prototype, ztesoft.events.Event);

	TabNavigator.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	}

	TabNavigator.prototype._setSelectedIndex = function(index) {
		var oldIndex = this._selectedIndex;
		if (oldIndex === index) {
			return;
		}

		var children = this.tabBar.children;
		if (oldIndex !== -1) {
			ztesoft.removeClass(children[oldIndex], 'active');
			ztesoft.removeClass(this.tabConent.querySelector(children[oldIndex].firstChild.getAttribute('href')), 'active');
		}

		ztesoft.addClass(children[index], 'active');
		ztesoft.addClass(this.tabConent.querySelector(children[index].firstChild.getAttribute('href')), 'active');
		this._selectedIndex = index;
		this.trigger('change');
	};

	TabNavigator.prototype._tabClickHandler = function(event) {
		var element = event.target;
		if (element.tagName == 'A') {
			event.preventDefault();
			this._setSelectedIndex(_.indexOf(this.tabBar.children, element.parentElement));
		}
	}
})();