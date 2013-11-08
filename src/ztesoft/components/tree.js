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
    'childrenField': 'children',
    'autoOpen': true
  };

  Tree.prototype.render = function() {
    var that = this;
    var $ul = $('<ul class="tree"></ul>');
    this._loadFromDataSource();

    this.nodes.forEach(function(node) {
      that._createNode(node);
      $ul.append(node.element);
    });

    this.$element.append($ul);
    this.$element.on('click', $.proxy(this._clickHandler, this));
  };

  Tree.prototype._loadFromDataSource = function() {
    var node, children, nodes = [], that = this;
    if (this.dataSource) {
      this.dataSource.forEach(function(item) {
        node = new TreeNode(item);
        children = item[that.childrenField];
        if (children) {
          node.isOpen = that.autoOpen;
          that._loadFromArray(children, node);
        }
        nodes.push(node);
      });
    }
    this.nodes = nodes;
  };

  Tree.prototype._loadFromArray = function(array, parentNode) {
    var node, children, that = this;
    array.forEach(function(item) {
      node = new TreeNode(item);
      parentNode.addChild(node);
      children = item[that.childrenField];
      if (children) {
        node.isOpen = that.autoOpen;
        that._loadFromArray(children, node);
      }
    });
  };

  Tree.prototype.expandNode = function(node) {
    if (!node.isBranch()){
      return;
    }

    var $li = node.element;
    var $disclosureIcon = $li.children('a').find('.js-folder');
    if (!node.isOpen) {
      node.isOpen = true;
      this.trigger('itemOpen');
      $li.addClass('open');
      $disclosureIcon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
    }
  };

  Tree.prototype.collapseNode = function(node) {
    if (!node.isBranch()){
      return;
    }

    var $li = node.element;
    var $disclosureIcon = $li.children('a').find('.js-folder');
    if (node.isOpen) {
      node.isOpen = false;
      this.trigger('itemClose');
      $li.removeClass('open');
      $disclosureIcon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
    }
  };

  Tree.prototype.expandAll = function() {
    var that = this;
    this.nodes.forEach(function(node) {
      that.expandNode(node);
    });
  };

  Tree.prototype.collapseAll = function() {
    var that = this;
    this.nodes.forEach(function(node) {
      that.collapseNode(node);
    });
  };

  Tree.prototype.append = function(item, parentNode) {
    var $ul, $li, $prev, node = new TreeNode(item);

    if (parentNode.isBranch()) {
      parentNode.addChild(node);
      $ul = parentNode.element.children('ul');
      this._createNode(node);
      $li = node.element;
      $ul.append($li);
    }
    else {
      parentNode.addChild(node);
      $li = parentNode.element;
      $prev = $li.prev();
      $ul = $li.parent();

      parentNode.element = null;
      $li.remove();
      $li = this._createFolder(parentNode);

      if ($prev.length) {
        $prev.after($li);
      }
      else {
        $ul.append($li);
      }
    }
    this.expandNode(parentNode);
    this._setSelectedNode(node);
  };

  Tree.prototype.remove = function(node) {
    var parentNode = node.parent;
    node.element.remove();
    node.destroy();
    this._setSelectedNode(parentNode);
  };

  Tree.prototype.update = function(node) {
    var $li = node.element;
    $li.children('a').html(this._createLabel(node));
  };

  Tree.prototype.getSelectedNode = function() {
    var $li = this.$element.find('.active');
    return $li.data('node');
  };

  Tree.prototype.getSelectedItem = function() {
    var node = this.getSelectedNode();
    return node.data;
  };

  Tree.prototype._setSelectedNode = function(node) {
    var $active = this.$element.find('.active');
    $active.removeClass('active');

    var $li = node.element;
    $li.addClass('active');
    this.trigger('change', node.data);
  };

  Tree.prototype._createNode = function(node) {
    if (node.isBranch()) {
      this._createFolder(node);
    }
    else {
      this._createLeaf(node);
    }
  };

  Tree.prototype._createLeaf = function(node) {
    var html = ['<li><a href="#"><span>'];
    html.push(this._createIndentationHtml(node.getLevel()));
    html.push(this.itemToLabel(node.data));
    html.push('</span></a></li>');

    var $li = $(html.join(''));
    $li.data('node', node);
    node.element = $li;
    return $li;
  };

  Tree.prototype._createFolder = function(node) {
    var that = this;
    var html = [];
    if (node.isOpen) {
      html.push('<li class="open"><a href="#"><span>');
      html.push(this._createIndentationHtml(node.getLevel() - 1));
      html.push('<i class="glyphicon glyphicon-minus-sign js-folder"></i>');
    }
    else {
      html.push('<li><a href="#"><span>');
      html.push(this._createIndentationHtml(node.getLevel() - 1));
      html.push('<i class="glyphicon glyphicon-plus-sign js-folder"></i>');
    }
    html.push(this.itemToLabel(node.data));
    html.push('</span></a></li>');

    var $li = $(html.join(''));
    var $ul = $('<ul class="children-list"></ul>');
    node.children.forEach(function(childNode) {
      that._createNode(childNode);
      $ul.append(childNode.element);
    });
    $li.append($ul);
    $li.data('node', node);
    node.element = $li;
    return $li;
  };

  Tree.prototype._createLabel = function(node) {
    var html = ['<span>'];
    var level = node.getLevel();
    if (node.isBranch()) {
      html.push(this._createIndentationHtml(level - 1));
      html.push('<i class="glyphicon ',
          node.isOpen ? 'glyphicon-minus-sign' : 'glyphicon-plus-sign',
          ' js-folder"></i>');
    }
    else {
      html.push(this._createIndentationHtml(level));
    }
    html.push(this.itemToLabel(node.data));
    html.push('</span>');
    return html.join('');
  };

  Tree.prototype._createIndentationHtml = function(count) {
    var html = [];
    for (var i = 0; i < count; i++) {
      html.push('<i class="glyphicon tree-indentation"></i>');
    }
    return html.join('');
  };

  Tree.prototype._clickHandler = function(event) {
    var $target = $(event.target);
    var $li = $target.closest('li');
    var node = $li.data('node');

    if ($target.is('i')) {
      event.preventDefault();
      if (node.isOpen) {
        this.collapseNode(node);
      }
      else {
        this.expandNode(node);
      }
    }
    else {
      event.preventDefault();
      if (!$li.hasClass('active')) {
        this._setSelectedNode(node);
        this.trigger('itemClick', node.data);
      }
    }
  };

  var TreeNode = function(data) {
    this.data = data;
    this.parent = null;
  };

  TreeNode.prototype.destroy = function() {
    this.parent = null;
  };

  TreeNode.prototype.addChild = function(node) {
    node.parent = this;

    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
  };

  TreeNode.prototype.removeChild = function(node) {
    node.parent = null;
    this.children.splice(this.getChildIndex(node), 1);
  };

  TreeNode.prototype.getChildIndex = function(node) {
    return this.children.indexOf(node);
  };

  TreeNode.prototype.hasChildren = function() {
    return this.children.length !== 0;
  };

  TreeNode.prototype.isBranch = function() {
    return !!this.children;
  };

  TreeNode.prototype.getPreviousSibling = function() {
    var previousIndex;
    if (!this.parent) {
      return null;
    }

    previousIndex = this.parent.getChildIndex(this) - 1;
    if (previousIndex >= 0) {
      return this.parent.children[previousIndex];
    }
    return null;
  };

  TreeNode.prototype.getNextSibling = function() {
    var nextIndex;
    if (!this.parent) {
      return null;
    }

    nextIndex = this.parent.getChildIndex(this) + 1;
    if (nextIndex < this.parent.children.length) {
      return this.parent.children[nextIndex];
    }
    return null;
  };

  TreeNode.prototype.getLevel = function() {
    var level = 1;
    var parent = this.parent;
    while(parent) {
      level++;
      parent = parent.parent;
    }
    return level;
  };

})(jQuery);