(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var DataGrid = ns.DataGrid = function(element, options) {
		this.$element = $(element);
		$.extend(this, options);
	};

	DataGrid.prototype.render = function() {
		var header = '<table class="table table-bordered datagrid-header">';
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
		header += colgroup + thead + '</table>';

		var body = '<div class="datagrid-body" style="height:' + this.height + 'px"><table class="table table-hover">' + colgroup;
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

		this.$element.find('.datagrid-body').on('click', $.proxy(this._clickHandler, this));
	};

	DataGrid.prototype.selectedIndex = function(index) {

	};

	DataGrid.prototype.selectedItem = function(item) {

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

	DataGrid.prototype._clickHandler = function(event) {
		if (event.target.tagName === 'TD') {
			var tr = event.target.parentElement;
			var active = this.$element.find('.active');
			if (active.length > 0) {
				active.removeClass('active');
			}
			$(tr).addClass('active');
		}
	}
})(window.jQuery);