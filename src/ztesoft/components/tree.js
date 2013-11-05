(function($) {
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
		var $ul = $('<ul></ul>');
		children.forEach(function(item) {
			$ul.append(that._createItemRenderer(item, null, ''));
		});
		return $ul;
	};

	Tree.prototype._createItemRenderer = function(item, parentNode, indentationHtml) {
		var that = this;
		var children = item[this.childrenField];
		var node = new TreeNode(item, parentNode);
		var $li, $ul;

		if (children) {
			$li = $('<li><a href="#"><span>' + 
				indentationHtml +
				'<i class="glyphicon glyphicon-plus-sign js-folder"></i>' + 
				that.itemToLabel(item) + 
				'</span></a><ul class="children-list"></ul></li>');
			$ul = $li.children('ul');
			indentationHtml += '<i class="glyphicon tree-indentation"></i>';
			children.forEach(function(childItem, index) {
				$ul.append(that._createItemRenderer(childItem, node, indentationHtml))
			});
		}
		else {
			$li = $('<li><a href="#"><span>' +
				indentationHtml +
				'<i class="glyphicon tree-indentation"></i>' + that.itemToLabel(item) + '</span></a></li>')
		}
		node.element = $li;
		$li.data('node', node);

		return $li;
	};

	Tree.prototype._clickHandler = function(event) {
		var $target = $(event.target);
		var $li = $target.closest('li');

		if ($target.is('i')) {
			if ($li.hasClass('open')) {
				this.trigger('itemClose');
				$li.removeClass('open');
				$target.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
			}
			else {
				this.trigger('itemOpen');
				$li.addClass('open');
				$target.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
			}
		}
		else {
			event.preventDefault();
			if (!$li.hasClass('active')) {
				var $active = this.$element.find('.active');
				$active.removeClass('active');
				$li.addClass('active');
				this.trigger('itemClick');
			}
		}
	};

	Tree.prototype.expandNode = function(node) {
		if (!node.childrenNode)
			return;

		var $li = node.element;
		var $disclosureIcon = $li.children('a').find('.js-folder');
		if (!$li.hasClass('open')) {
			this.trigger('itemOpen');
			$li.addClass('open');
			$disclosureIcon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
		}
	};

	Tree.prototype.collapseNode = function(node) {
		if (!node.childrenNode)
			return;

		var $li = node.element;
		var $disclosureIcon = $li.children('a').find('.js-folder');
		if ($li.hasClass('open')) {
			this.trigger('itemClose');
			$li.removeClass('open');
			$disclosureIcon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
		}
	};

	Tree.prototype.expandAll = function() {

	};

	Tree.prototype.collapseAll = function() {

	};

	Tree.prototype.append = function(item) {

		// var $li = this._createItemRenderer(item, parentNode,)
	};

	Tree.prototype.update = function() {
		var $li = this.getSelectedNode().element;
		// $li.find()
	};

	Tree.prototype.getSelectedNode = function() {
		var $li = this.$element.find('.active');
		return $li.data('node');
	};

	Tree.prototype.getSelectedItem = function() {
		var node = this.getSelectedNode();
		return node.data;
	};

	var TreeNode = function(data, parentNode, element) {
		this.data = data;
		this.parentNode = parentNode;
		this.element = element;
		this.init();
	};

	TreeNode.prototype.init = function() {
		if (this.parentNode) {
			var childrenNode = this.parentNode.childrenNode || [];
			childrenNode.push(this);
			this.parentNode.childrenNode = childrenNode;
		}
	};

})(window.jQuery);