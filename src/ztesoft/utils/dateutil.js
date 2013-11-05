(function(){
	var ns = ztesoft.namespace('ztesoft.utils');

	var MILLIS_PER_SECOND = 1000;
	var MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND;
	var MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;
	var MILLIS_PER_DAY = 24 * MILLIS_PER_HOUR;
  var token = /d{1,4}|m{1,4}|yyyy?|([HMs])\1?/g;
  var i18n = {
    dayNames: [
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
  };

	function handleShorterMonth(originalDate, newDate) {
		var result = newDate;
		var originalDayOfMonth = originalDate.getDate();
		if (originalDayOfMonth > result.getDate()) 
		{
			result = DateUtil.addDays(newDate, -(newDate.getDate()));
		}
		return result;
	}

	function formatDate(date, mask) {
    date = date ? new Date(date) : new Date();
		var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        D = date.getDay(),
        H = date.getHours(),
        M = date.getMinutes(),
        s = date.getSeconds(),
        flags = {
          d:    d,
          dd:   paddingRight(d),
          ddd:  i18n.dayNames[D],
          dddd: i18n.dayNames[D + 7],
          m:    m + 1,
          mm:   paddingRight(m + 1),
          mmm:  i18n.monthNames[m],
          mmmm: i18n.monthNames[m + 12],
          yyyy: y,
          H:    H,
          HH:   paddingRight(H),
          M:    M,
          MM:   paddingRight(M),
          s:    s,
          ss:   paddingRight(s)
        };
    return mask.replace(token, function($0) {
      return flags[$0];
    });
	}

  function paddingRight(value, length) {
    value = String(value);
    length = length || 2;
    while (value.length < length) {
      value = "0" + value;
    }
    return value;
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
		'format': function(date, mask) {
      return formatDate(date, mask);
		}
	};
})();