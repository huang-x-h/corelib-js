(function($) {
  var ns = ztesoft.namespace('ztesoft.components');

  var Menu = ns.Menu = function(element, options) {
    this.$element = $(element);

    $.extend(this, Menu.DEFAULTS, options);
  };

  $.extend(Menu.prototype, ztesoft.events.Event, ns.List.prototype);

  Menu.DEFAULTS = {
    'labelField': null,
    'labelFunction': null,
    'childrenField': 'children'
  };

  Menu.prototype.render = function() {
    this.$element.append(this._createChildrenList(this.dataSource));
    this.$element.on('mouseover', 'li', $.proxy(this._mouseOverHandler, this));
    this.$element.on('click', 'li', $.proxy(this._clickHandler, this));
    $(document).on('click', $.proxy(this._clickOutsideHandler, this));
  };

  Menu.prototype._createChildrenList = function(children) {
    var _this = this;
    var html = ['<ul class="menu">'];
    children.forEach(function(item) {
      html.push(_this._createItemRenderer(item, null, ''));
    });
    html.push('</ul>');
    return html.join('');
  };

  Menu.prototype._createItemRenderer = function(item) {
    var _this = this;
    var children = item[this.childrenField];
    var html = [];

    html.push('<li><a href="#">');
    html.push(this.itemToLabel(item));
    if (children) {
      html.push('<i class="glyphicon glyphicon-chevron-right"></i></a><ul class="menu popup">');
      children.forEach(function(childItem) {
        html.push(_this._createItemRenderer(childItem));
      });
      html.push('</ul>');
    }
    else {
      html.push('</a>');
    }
    html.push('</li>');
    return html.join('');
  };

  Menu.prototype._mouseOverHandler = function(event) {
    event.stopPropagation();
    var $li = $(event.currentTarget);
    var $ul = $li.children('ul');
    var position = $li.position();
    if ($ul.length) {
      $li.addClass('open active');
      $ul.css({'top': position.top, 'left': position.left + $li.outerWidth()});
    }
    else {
      $li.parent().find('.open').removeClass('open active');
    }
  };

  Menu.prototype._clickHandler = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var $li = $(event.currentTarget);
    var $ul = $li.children('ul');
    if (!$ul.length) {
      this.$element.find('.open').removeClass('open active');
      this.trigger('itemClick');
    }
  };

  Menu.prototype._clickOutsideHandler = function(event) {
    if($(event.target).closest('.menu')) {

    }
  }
})(jQuery);