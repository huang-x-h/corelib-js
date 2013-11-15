/**
 * Title: modal.js
 * Description: modal.js
 * Author: huang.xinghui
 * Created Date: 13-11-8 下午2:33
 * Copyright: Copyright 2013 ZTESOFT, Inc.
 */
(function($) {
  var popupInfo = [];

  function createBackdrop() {
    var $backdrop = $('<div class="modal-backdrop"></div>');
    $backdrop.appendTo(document.body);
    return $backdrop;
  };

  function addPopUp($element, modal) {
    var popup = {'owner': $element};

    if (modal) {
      popup.modal = createBackdrop();
    }

    $element.appendTo(document.body);
    $element.offset({'top': (document.body.clientHeight - $element.outerHeight()) >> 1,
      'left': (document.body.clientWidth - $element.outerWidth()) >> 1});

    popupInfo.push(popup);
  };

  function removePopUp($element) {
    var n = popupInfo.length,
        i = 0,
        popup;
    for (; i < n; i++) {
      popup = popupInfo[i];

      if (popup.owner == $element) {
        popup.owner.remove();
        if (popup.modal) {
          popup.modal.remove();
        }
        popupInfo.slice(i, 1);
      }
    }
  };

  var ns = ztesoft.namespace("ztesoft.components");

  ns.Modal = {
    'addPopUp': addPopUp,
    'removePopUp': removePopUp
  };
})(jQuery);