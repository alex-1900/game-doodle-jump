(function(window, document) {
  "use strict"

  /**
   * 
   * @param {HTMLElement} element
   */
  function Selector(element) {
    this.element = element;
  }

  /**
   * 设置样式 selector.css({color: "red"});
   * 
   * @param {object} styles
   * @return {Selector}
   */
  Selector.prototype.css = function(styles) {
    for (var name in styles) {
      var value = styles[name];
      this.element.style[name] = value;
    }
    return this;
  };

  Selector.prototype.preventDefault = function(listeners) {
    if (typeof(listeners) === 'string') {
      listeners = [listeners];
    }
    for (var index in listeners) {
      var listener = listeners[index];
      this.element[listener] = function(event) {
        event.preventDefault();
      };
    }
    return this;
  };

  window.Selector = function(element) {
    if (typeof(element) === 'string') {
      element = document.querySelector(element);
    }
    return new Selector(element);
  };

})(window, window.document);
