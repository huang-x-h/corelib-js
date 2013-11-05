(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var DatePicker = ns.DatePicker = function(element, options) {
		this.$element = $(element);
    $.extend(this, DatePicker.DEFAULTS, options);
	};

	DatePicker.DEFAULTS = {
		'days':["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		'months':['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		'formatString':'yyyy-MM-dd',
		'weekStart':0,
		'disabledDays':[],
		'selectableRange':[]
	};

	DatePicker.prototype.render = function() {
		this.date = new Date();

		this._picker = document.createElement('div');
		this._picker.className = 'datepicker popup';
		this._picker.innerHTML = '<table class="table-condensed">'+
				'<thead>'+
					'<tr>'+
						'<th class="prev">&laquo;</th>'+
						'<th colspan="5" class="datepicker-switch"></th>'+
						'<th class="next">&raquo;</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody><tr><td colspan="7"></td></tr></tbody>'+
			'</table>';

		this._updateMonth();

		var html = ['<tr>'];
		var dowCnt = this.weekStart;
		while (dowCnt < this.weekStart + 7) {
			html.push('<th class="dow">' + this.days[dowCnt] + '</th>');
			dowCnt++;
		}
		html.push('</tr>')
		var thead = this._picker.querySelector('thead');
		thead.innerHTML += html.join('');

		this._updateFillDays();
		this.$element.append(this._picker);

    this.$element.on('click', '.input-group-addon', $.proxy(this.show, this));
		$(this._picker).on('click', $.proxy(this._clickHandler, this));
		$(this._picker).on('dblclick', $.proxy(this._okHandler, this));
//		$(document).on('click', $.proxy(this._mouseClickOutsideHandler, this));
	};

	DatePicker.prototype._updateMonth = function() {
		this._picker.querySelector('.datepicker-switch').textContent = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
	};

	DatePicker.prototype._updateFillDays = function() {
		var year = this.date.getFullYear();
		var month = this.date.getMonth();
		var offset = this._getOffsetOfMonth(year, month);
		var days = this._getNumberOfDaysInMonth(year, month);
		var html = ['<tr>'];

		for (var i = 0; i < offset; i++) {
			html.push('<td></td>');
		}

		i = 1;
		while (i <= days) {
			if (offset == 0) {
				html.push('<tr>');
			}

			html.push('<td class="day">' + i + '</td>');

			if (offset == 6) {
				html.push('</tr>');
				offset = 0;
			}
			else {
				offset++;
			}

			i++;			
		}

		this._picker.querySelector('tbody').innerHTML = html.join('');
	};

	DatePicker.prototype._getOffsetOfMonth = function(year, month) {
		var first = new Date(year, month, 1);
		var offset = first.getDay() - this.weekStart;
		return offset < 0 ? offset + 7 : offset;
	};

	DatePicker.prototype._getNumberOfDaysInMonth = function(year, month) {
		var n;

		if (month == 1) {
			if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
				n = 29;
			else 
				n = 28;
		}
		else if (month == 3 || month == 5 || month == 8 || month == 10)
			n = 30;
		else
			n = 31;
		return n;
	};

	DatePicker.prototype._clickHandler = function(event) {
		var target = event.target;
		if (target.tagName == 'TD' && target.textContent) {
			var active = this._picker.querySelector('.active');
			if (active) {
				ztesoft.removeClass(active, 'active');
			}
			ztesoft.addClass(target, 'active');
		}
		else if (target.className == 'prev') {
			this.date = ztesoft.utils.DateUtil.addMonths(this.date, -1);
			this._updateMonth();
			this._updateFillDays();
		}
		else if (target.className == 'next') {
			this.date = ztesoft.utils.DateUtil.addMonths(this.date, 1);
			this._updateMonth();
			this._updateFillDays();
		}
	};

	DatePicker.prototype._okHandler = function(event) {
		var target = event.target;
		if (target.tagName == 'TD' && target.textContent) {
			this.date.setDate(parseInt(target.textContent));
			this.$element.find('input').val(ztesoft.utils.DateUtil.format(this.date, 'yyyy-mm-dd'));
			this.hide();
		}
	};

	DatePicker.prototype._mouseClickOutsideHandler = function(event) {
		if (!((event.target == this.element) || (event.target == this._picker) || this._picker.contains(event.target))) {
			this.hide();
		}
	}

	DatePicker.prototype.show = function() {
    this.$element.addClass('open');
	};

	DatePicker.prototype.hide = function() {
    this.$element.removeClass('open');
	};

	DatePicker.prototype.destory = function() {
		this._picker.remove();
	};
})(window.jQuery);