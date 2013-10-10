(function(_, undefined) {
	var ztesoft = window.ztesoft;
	var ns = ztesoft.namespace("ztesoft.collections");

	var ArrayList = ns.ArrayList = function(source) {
		this.source = source;
	}

	ztesoft.inherit(ArrayList, ztesoft.events.Event);

	ArrayList.prototype.source = function() {
		return this.source;
	}

	ArrayList.prototype.addItem = function(item) {
		this.addItemAt(item, this.source.length);
	};

	ArrayList.prototype.addItemAt = function(item, index) {
		this.source.splice(index, 0, item);
		this.trigger('add', item, index);
	};

	ArrayList.prototype.removeItem = function(item) {
		var index = this.getItemIndex(item);
		var result = index >= 0;
		if (result) {
			this.removeItemAt(index);
		}

		return result;
	};

	ArrayList.prototype.removeItemAt = function(index) {
		var removed = this.source.splice(index, 1)[0];
		this.trigger('remove', index);
		return removed;
	};

	ArrayList.prototype.getItemIndex = function(item) {
		return _.indexOf(this.source, item);
	};

	ArrayList.prototype.getItemAt = function(index) {
		return this.source[index];
	};

}(window._));