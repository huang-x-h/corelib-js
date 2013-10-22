(function() {
	var ns = ztesoft.namespace("ztesoft.validators");

	var StringValidator = ns.StringValidator = function(element, options) {
		this.element = element;
		this.$element = $(element);
		this.$element.on('focus', $.proxy(this._focusHandler, this));
		this.$element.on('blur', $.proxy(this._blurHandler, this));
	};

	StringValidator.prototype = {
		'validate': function() {

		}
	};

	StringValidator.prototype.errorString = function(errorString) {
		if (arguments.length === 0) {
			return this.$element.data('errorString');
		}

		this.$element.data({'errorString': errorString});
	};

	StringValidator.prototype._focusHandler = function() {
		if (this.element.disabled === false && this.errorString()) {
			this.popover = this.$element.popover({'content': this.errorString()});
			this.popover.show();
		}
	};

	StringValidator.prototype._blurHandler = function() {
		this.popover.hide();
	}
})();