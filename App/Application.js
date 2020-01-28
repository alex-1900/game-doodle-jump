(function(window, document) {
  "use strict"

  /**
   * 应用程序主接口
   * @param {HTMLElement} element App 对应的 HTML 元素
   * @param {HTMLElement} width App 元素的宽度
   * @param {HTMLElement} height App 元素的高度
   */
  function Application(element, width, height) {
    var publicStyles = {width: width + 'px', height: height + 'px'};
    var publicListeners = ['ontouchstart', 'ontouchend', 'ontouchmove', 'ontouchcancel'];

    Selector(element).css(publicStyles).preventDefault(publicListeners);

    this._process = this._process.bind(this);

    this.element = element;
    this.width = width;
    this.height = height;
    this.clients = {};
    this.canvases = [];
    this.container = {};
    this.state = {
      isRunning: false,
      frameId: 0,
      clientCount: 0
    };
  }

  Application.prototype.run = function() {
    this._registerListeners();
  };

  Application.prototype.set = function (name, entry) {
    this.container[name] = entry;
  }

  Application.prototype.get = function (name) {
    return this.container[name];
  }

  /**
   * 在 app 中生成一个 canvas 对象
   * 
   * @return {HTMLCanvasElement}
   */
  Application.prototype.createCanvas = function() {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.canvases.push(canvas);
    this.element.appendChild(canvas);
    return canvas;
  };

  /**
   * 监听一个 client
   * @param {Client} client
   */
  Application.prototype.addClient = function(callback) {
    var nextClientId = this.state.clientCount;
    var client = callback(nextClientId);
    if (client instanceof AbstructClient) {
      this.clients[nextClientId] = client;
      this.state.clientCount = nextClientId + 1;
      return client;
    }
    throw new Error('callback 需要返回 AbstructClient 实例');
  };

  /**
   * 移除一个 client
   * @param {Number} clientId
   */
  Application.prototype.removeClient = function(clientId) {
    delete this.clients[clientId];
  };

  /**
   * @private
   * @param {HTMLElement} timestamp 当前的时间戳
   */
  Application.prototype._process = function(timestamp) {
    if (this.state.isRunning) {
      for (var i in this.clients) {
        var client = this.clients[i];
        if (client instanceof AbstructClient) {
          client.update(timestamp);
          if (client.isSynchronized()) {
            client.render();
            client.sync();
          }
        }
      }
      this.state.frameId = requestAnimationFrame(this._process);
    } else {
      // 必须在 _process 里终止，否则会串号
      cancelAnimationFrame(this.state.frameId);
    }
  };

  /**
   * @private
   */
  Application.prototype._registerListeners = function() {
    var app = this;
    document.addEventListener('app-start', function(event) {
      if (!app.state.isRunning) {
        app.state.isRunning = true;
        requestAnimationFrame(app._process);
      }
    });

    document.addEventListener('app-pause', function(event) {
      app.state.isRunning = false;
    });

    document.addEventListener('app-stop', function(event) {
      app.state.isRunning = false;
      for (var i in app.clients) {
        app.clients[i].terminate(app);
      }
      app.canvases.forEach(function(canvas) {
        app.element.removeChild(canvas);
      });

      app.clients = {};
      app.canvases = [];
    });
  };

  window.Application = Application;

})(window, window.document);
