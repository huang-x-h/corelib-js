(function() {
  var ztesoft = window.ztesoft = window.ztesoft || {};

  var StringProto = String.prototype;
  var nativeTrim = StringProto.trim;

  var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  ztesoft.trim = nativeTrim ? 
    function(text) {
      return text == null ? "" : nativeTrim.call(text);
    } :
    function(text) {
      return text == null ? "" : text.replace(rtrim, '');
    }
  ;

  ztesoft.addClass = function(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                              .replace(/[\n\t]/g, " ");

      _.each(cssClasses.split(' '), function(cssClass) {
        cssClass = ztesoft.trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });

      element.setAttribute('class', ztesoft.trim(existingClasses));
    }
  };

  ztesoft.removeClass = function(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      _.each(cssClasses.split(' '), function(cssClass) {
        element.setAttribute('class', ztesoft.trim(
            (" " + (element.getAttribute('class') || '') + " ")
            .replace(/[\n\t]/g, " ")
            .replace(" " + ztesoft.trim(cssClass) + " ", " "))
        );
      });
    }
  };

  ztesoft.on = function(element, eventType, handler) {

  };

  ztesoft.off = function(element, eventType, handler) {

  };

  ztesoft.inherit = function(childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    /** @override */
    childCtor.prototype.constructor = childCtor;
  }

  ztesoft.namespace = function(name) {
    var parts = name.split('.');
    var ns = window;

    for (var part; parts.length && (part = parts.shift());) {
      if (ns[part]) {
        ns = ns[part];
      } else {
        ns = ns[part] = {};
      }
    }

    return ns;
  };

})();
(function() {
  var ns = ztesoft.namespace("ztesoft.events");

  var array = [];
  var slice = array.slice;

  ns.Event = {
		on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }
	}

	var eventSplitter = /\s+/;

	var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

})();
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
(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var ComboBox = ns.ComboBox = function(element, options) {
		this.element = element;
		this.textField = this.element.querySelector('input');
		this.addOn = this.element.querySelector('.input-group-addon');
		_.extend(this, ComboBox.DEFAULTS, options);
		$(this.addOn).on('click', _.bind(this.show, this));
	};

	_.extend(ComboBox.prototype, ztesoft.events.Event);

	ComboBox.DEFAULTS = {
		'labelField': null,
		'labelFunction': null
	}

	ComboBox.prototype.render = function() {
		// $(this.element).append('<ul class="dropdown-menu"></ul>');
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'dropdown-menu');
		this.element.appendChild(ul);
		this.list = new ns.List(ul, {
			'labelField': this.labelField,
			'labelFunction': this.labelFunction,
			'dataSource': this.dataSource
		});
		this.list.render();
		this.list.on('itemClick', _.bind(this._itemClickHandler, this));
	};

	ComboBox.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	};

	ComboBox.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this._selectedItem = value;
	};

	ComboBox.prototype._setSelectedIndex = function(index) {
		
	};

	ComboBox.prototype._itemClickHandler = function() {
		this._selectedIndex = this.list.selectedIndex();
		this._selectedItem = this.list.selectedItem();
		this.textField.value = this.list.itemToLabel(this._selectedItem);
		this.hide();
	};

	ComboBox.prototype.show = function() {
		ztesoft.addClass(this.element, 'open');
	};

	ComboBox.prototype.hide = function() {
		ztesoft.removeClass(this.element, 'open');
	};

	ComboBox.prototype.destory = function() {
		this.list.remove();
		this.addOn.off('click');
	};

})();
(function() {
	var ns = ztesoft.namespace('ztesoft.components');

	var DatePicker = ns.DatePicker = function(element, options) {
		this.element = element;
		this.$element = $(element);
		_.extend(this, DatePicker.DEFAULTS, options);
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
		this._picker.className = 'datepicker-dropdown dropdown-menu';
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
		document.body.appendChild(this._picker);

		this.$element.on('click', _.bind(this.show, this));
		$(this._picker).on('click', _.bind(this._clickHandler, this));
		$(this._picker).on('dblclick', _.bind(this._okHandler, this));
		$(document).on('click', _.bind(this._mouseClickOutsideHandler, this));
	};

	DatePicker.prototype._updateMonth = function() {
		this._picker.querySelector('.datepicker-switch').textContent = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
	};

	DatePicker.prototype._updateFillDays = function() {
		var year = this.date.getFullYear();
		var month = this.date.getMonth();
		// var day = this.date.getDate();
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

			var year = this.date.getFullYear();
			var month = this.date.getMonth() + 1;
			var day = this.date.getDate();
			if (month < 10) month = '0' + month;
			if (day < 10) day = '0' + day;
			this.element.value = year + '-' + month + '-' + day;
			this.hide();
		}
	};

	DatePicker.prototype._mouseClickOutsideHandler = function(event) {
		if (!((event.target == this.element) || (event.target == this._picker) || this._picker.contains(event.target))) {
			this.hide();
		}
	}

	DatePicker.prototype.place = function() {
		var box = this.element.getBoundingClientRect();
		this._picker.style.left = box.left + 'px';
		this._picker.style.top = box.top + box.height + 'px'; 
	};

	DatePicker.prototype.show = function() {
		this._picker.style.display = 'block';
		this.place();
	};

	DatePicker.prototype.hide = function() {
		this._picker.style.display = 'none';
	};

	DatePicker.prototype.destory = function() {
		this._picker.remove();
	};
})();
(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var List = ns.List = function(element, options) {
		this.dataSource = null;
		this._selectedItem = null;
		this._selectedIndex = -1;

		this.element = element;
		this.$element = $(element);

		_.extend(this, List.DEFAULTS, options);
	};

	_.extend(List.prototype, ztesoft.events.Event);

	List.prototype.render = function() {
		var _this = this;
		var html = [];

		_.each(this.dataSource, function(item, index){
			html.push('<li><a>' + _this.itemToLabel(item) + '</a></li>');
		});

		this.element.innerHTML = html.join('');
		this.$element.on('click', _.bind(this._clickHandler, this));
	};

	List.prototype.itemToLabel = function(data) {
		if (!data) {
			return '';
		}

		if (this.labelFunction != null) {
			return this.labelFunction(data);
		}
		else if (this.labelField != null) {
			return data(this.labelField);
		}
		else {
			return data;
		}
	};

	List.prototype.selectedIndex = function(index) {
		if (arguments.length === 0) {
			return this._selectedIndex;
		}

		this._setSelectedIndex(index);
	};

	List.prototype.selectedItem = function(value) {
		if (arguments.length === 0) {
			return this._selectedItem;
		}

		this.selectedIndex(_.indexOf(this.dataSource, value))
	};

	List.prototype.append = function(item) {
		var li = document.createElement('li');
		li.innerHTML = this.itemToLabel(item);
		this.element.appendChild(li);
		this.dataSource.push(item);
	};

	List.prototype.appendAt = function(item, index) {
		var li = document.createElement('li');
		li.innerHTML = this.itemToLabel(item);

		var refLi = this.element.children[index];
		this.element.insertBefore(li, refLi);
		this.dataSource.splice(index, 0, item);
	};

	List.prototype.remove = function(index) {
		this.element.removeChild(this.element.children[index]);
		this.dataSource.splice(index, 1);
	};

	List.prototype.update = function(item) {
		var index = _.indexOf(this.dataSource, item);
		var li = this.element.children[index];
		li.innerHTML = this.itemToLabel(item);
	};

	List.prototype.destory = function() {
		this.element.remove();
	};

	List.prototype.seekSelectedItem = function(data) {
		var i, index = -1, n = this.dataSource.length;
		if (this.dataKeyField) {
			for (i = 0; i < n; i++) {
				if (this.dataSource[i][dataKeyField] == data) {
					index = i;
					break;
				}
			}
		}
		else {
			for (i = 0; i < n; i++) {
				if (this.dataSource[i] == data) {
					index = i;
					break;
				}
			}
		}

		if (index != -1) {
			this._setSelectedIndex(index);
		}
	};

	List.prototype._setSelectedIndex = function(index) {
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
		this._selectedItem = this.dataSource[index];
		this.trigger('change');
	};

	List.prototype._clickHandler = function(event) {
		if (event.target.tagName === 'A') {
			var index = _.indexOf(this.element.children, event.target.parentElement);
			this.selectedIndex(index);
			this.trigger('itemClick');
		}
	};

	List.DEFAULTS = {
		rowCount: 6,
		labelField:null,
		labelFunction:null,
		dataKeyField:null
	};
})();
(function() {
	var ns = ztesoft.namespace("ztesoft.components");

	var NumericStepper = ns.NumericStepper = function(element, options) {

		_.extend(this, NumericStepper.DEFAULTS, options);
	};

	_.extend(NumericStepper.prototype, ztesoft.events.Events);

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

	ViewStack.prototype._setSelectedId = function(id) {
		var child = this.element.querySelector('.active');
		this._setSelectedIndex(this.element.children.indexOf(child));
	}

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