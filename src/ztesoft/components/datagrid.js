(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var DataGrid = ns.DataGrid = function(element, options) {
    this._selectedItem = null;
    this._selectedIndex = -1;
		this.$element = $(element);
		$.extend(this, DataGrid.DEFAULTS, options, this.$element.data());
	};

  $.extend(DataGrid.prototype, ztesoft.events.Event);

  DataGrid.DEFAULTS = {
    'rowCount': 6,
    'rowHeight': 37
  };

	DataGrid.prototype.render = function() {
		var header = '<div class="datagrid-header"><table class="table table-bordered">';
		var colgroup = '<colgroup>';
		var thead = '<thead><tr>';
		$.each(this.columns, function(index, column) {
			if (column.width) {
				colgroup += '<col width=' + column.width + '></col>';
			}
			else {
				colgroup += '<col></col>';
			}
			thead += '<th>'+ (column.headerText || column.dataField) + '</th>';
		});

		colgroup += '</colgroup>';
		thead += '</tr></thead>';
		header += colgroup + thead + '</table></div>';

		var body = '<div class="datagrid-body" style="height:' + this.rowCount * this.rowHeight
        + 'px"><table class="table table-hover">' + colgroup;
		var tbody = '<tbody>';
		var tr;
		var that = this;
		$.each(this.dataSource, function(index, item) {
			tr = '<tr>';
			$.each(that.columns, function(index, column) {
				tr += '<td>' + that.itemToLabel(item, column) + '</td>';
			});
			tr += '</tr>';
			tbody += tr;
		});
		
		body += tbody + '</tbody></table></div>';

		this.$element.append(header + body);
    this.$body = this.$element.find('.datagrid-body');
		this.$body.on('click', $.proxy(this._clickHandler, this));
	};

	DataGrid.prototype.selectedIndex = function(index) {
    if (arguments.length === 0) {
      return this._selectedIndex;
    }

    var oldIndex = this._selectedIndex;
    if (oldIndex !== index) {
      this._setSelectedIndex(index);
    }
	};

	DataGrid.prototype.selectedItem = function(item) {
    if (arguments.length === 0) {
      return this._selectedItem;
    }

    this.selectedIndex(this.dataSource.indexOf(value))
	};

	DataGrid.prototype.itemToLabel = function(item, column) {
		if (!item) {
			return '';
		}

		if (column.labelFunction != null) {
			return column.labelFunction(item);
		}
		else if (column.dataField != null) {
			return item[column.dataField];
		}
		else {
			return item;
		}
	};

  DataGrid.prototype._setSelectedIndex = function(index) {
    var $tr = this.$body.find('tr');
    $tr.filter('.active').removeClass('active');
    $tr.eq(index).addClass('active');
    this._selectedIndex = index;
    this._selectedItem = this.dataSource[index];
    this.trigger('change');
  };

	DataGrid.prototype._clickHandler = function(event) {
    var $tr = $(event.target).closest('tr');
		if (!$tr.hasClass('active')) {
			var $active = this.$body.find('.active');;
      $active.removeClass('active');
      $tr.addClass('active');
      this.selectedIndex(this.$body.find('tr').index($tr));
      this.trigger('itemClick');
		}
	}
})(jQuery);