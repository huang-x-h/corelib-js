(function(){
	var ns = ztesoft.namespace('ztesoft.utils');

	var MILLIS_PER_SECOND = 1000;
	var MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND;
	var MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;
	var MILLIS_PER_DAY = 24 * MILLIS_PER_HOUR;

	function handleShorterMonth(originalDate, newDate) {
		var result = newDate;
		var originalDayOfMonth = originalDate.getDate();
		if (originalDayOfMonth > result.getDate()) 
		{
			result = DateUtil.addDays(newDate, -(newDate.getDate()));
		}
		return result;
	}

	function formatDate(date, format) {
		
	}

	function add(date, multiplier, num) {
		var resultTime = date.getTime() + multiplier * num;
		return new Date(resultTime);
	}

	var DateUtil = ns.DateUtil = {
		'addMonths': function(date, months) {
			var result = new Date(date.getTime());
			result.setMonth(date.getMonth() + months);
			result = handleShorterMonth(date, result);
			return result;
		},
		'addDays': function(date, days) {
			return add(date, MILLIS_PER_DAY, days);
		},
		'format': function(date, pattern) {

		}
	};
})();