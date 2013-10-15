(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var NumericStepper = ns.NumericStepper = function(element, options) {

		_.extend(this, NumericStepper.DEFAULTS, options);
	};

	_.extend(NumericStepper.prototype, ztesoft.event.Events);

	NumericStepper.prototype.value = function(value) {
		if (arguments.length === 0) {
			return this._value;
		}

		this._setValue(value);
	};

	NumericStepper.prototype._setValue = function(value) {
		this.inputField.text = value;
		this._value = value;
		this.trigger('change');
	};

	NumericStepper.DEFAULTS = {
		minimum: 0,
		maximum: 10,
		stepSize: 1
	}
})();