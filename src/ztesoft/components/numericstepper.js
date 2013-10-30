(function($, undefined) {
	var ns = ztesoft.namespace("ztesoft.components");

	var NumericStepper = ns.NumericStepper = function(element, options) {
		this._value = 0;
		this.$element = $(element);

		$.extend(this, NumericStepper.DEFAULTS, options);
	};

	$.extend(NumericStepper.prototype, ztesoft.events.Event);

	NumericStepper.prototype.render = function() {
    this.$textfield = this.$element.find('input');
    this.$textfield.on('blur', $.proxy(this._textFeildBlurHandler, this));

    this.$upbutton = this.$element.find('.glyphicon-chevron-up').parent();
    this.$upbutton.on('click', $.proxy(this._upButtonClickHandler, this));

    this.$downbutton = this.$element.find('.glyphicon-chevron-down').parent();
    this.$downbutton.on('click', $.proxy(this._downButtonClickHandler, this));
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
		this.$textfield.val(this._value = this._checkValue(value));
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
		this._setValue(parseInt(this.$textfield.val()));
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
})(window.jQuery);