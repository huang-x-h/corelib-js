(function($, undefined) {
	var ns = ztesoft.namespace('ztesoft.components');

	var Tree = ns.Tree = function(element, options) {
		this.$element = $(element);

		$.extend(this, Tree.DEFAULTS, options);
	};

	$.extend(Tree.prototype, ztesoft.events.Event, ns.List.prototype);

	Tree.DEFAULTS = {
		'labelField': null,
		'labelFunction': null,
		'childrenField': 'children'
	};

	Tree.prototype.render = function() {
		this.$element.append(this._createChildrenList(this.dataSource));
		this.$element.on('click', $.proxy(this._clickHandler, this));
	};

	Tree.prototype._createChildrenList = function(children) {
		var that = this;
		var html = ['<ul>'];
		$.each(children, function(index, item) {
			if (item[that.childrenField]) {
				html.push('<li><a href="#"><span><i class="glyphicon glyphicon-minus-sign"></i>' + that.itemToLabel(item) + '</span></a>');
				html.push(that._createChildrenList(item[that.childrenField]));
				html.push('</li>');
			}
			else {
				html.push('<li><a href="#"><span><i class="glyphicon tree-indentation"></i>' + that.itemToLabel(item) + '</span></a></li>');
			}
		});
		html.push(['</ul>']);
		return html.join('');
	};

	Tree.prototype._clickHandler = function(event) {
		event.preventDefault();
		var $target = $(event.target);
		if ($target.is('i')) {
			var $children = $target.parent().parent().next();
			if ($children.is(':visible')) {
				$children.hide('fast');
				$target.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
			}
			else {
				$children.show('fast');
				$target.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
			}
		}
		console.log(event.target);
	};

	Tree.prototype.expandItem = function(item) {

	};

	Tree.prototype.getParent = function(item) {

	};

	Tree.prototype.append = function(parentNode, node) {

	};

	var TreeNode = function() {

	};

	TreeNode.prototype = {
		create: function
	}
})(window.jQuery);