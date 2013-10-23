(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var NumericStepper = ns.NumericStepper = function(element, options) {
		this._value = 0;
		this.element = element;
		this.textfield = element.querySelector('input');
		this.upButton = element.querySelector('.glyphicon-chevron-up');
		this.downButton = element.querySelector('.glyphicon-chevron-down');

		_.extend(this, NumericStepper.DEFAULTS, options);
	};

	_.extend(NumericStepper.prototype, ztesoft.events.Event);

	NumericStepper.prototype.render = function() {
		this.textfield.addEventListener('blur', _.bind(this._textFeildBlurHandler, this));
		this.upButton.addEventListener('click', _.bind(this._upButtonClickHandler, this));
		this.downButton.addEventListener('click', _.bind(this._downButtonClickHandler, this));
	};

	NumericStepper.prototype.value = function(value) {
		if (arguments.length === 0) {
			return this._value;
		}

		this._setValue(value);
	};

	NumericStepper.prototype._stepValue = function(step) {
		this.value(this._value + step);
	}

	NumericStepper.prototype._setValue = function(value) {
		this.textfield.value = this._value = this._checkValue(value);
		this.trigger('change');
	};

	NumericStepper.prototype._checkValue = function(value) {
		if (isNaN(value))
      return this._value;

	  if (value > this.maximum)
	      return this.loop ? this.minimum : this.maximum;
	  else if (value < this.minimum)
	      return this.loop ? this.maximum : this.minimum;
	  else
	      return value;
	};

	NumericStepper.prototype._textFeildBlurHandler = function(event) {
		this._setValue(parseInt(this.textfield.value));
	};

	NumericStepper.prototype._upButtonClickHandler = function(event) {
		this._stepValue(this.stepSize);
	};

	NumericStepper.prototype._downButtonClickHandler = function(event) {
		this._stepValue(-this.stepSize);
	};

	NumericStepper.DEFAULTS = {
		loop: true,
		minimum: 0,
		maximum: 10,
		stepSize: 1
	};
})();