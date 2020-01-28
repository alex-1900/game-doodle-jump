(function() {
  "use strict"

  function DoodleClient(id) {
    AbstructClient.call(this, id);
    var images = app.get('images');
    this.imageLeft = images['doodleLeft'];
    this.imageRight = images['doodleRight'];
    var canvas = app.createCanvas();
    canvas.style.zIndex = 1;
    this.ctx = canvas.getContext('2d');
    this.initSy = -10;
    this.doodleSize = app.width / 5;
    this.state = {
      image: this.imageLeft,
      land: 400,
      x: 200,
      y: app.height - this.doodleSize,
      sx: 0,
      sy: this.initSy,
      fixed: 0
    };

    window.ondevicemotion = this.deviceMotion.bind(this);
  }

  extend(DoodleClient, AbstructClient);

  DoodleClient.prototype.update = function(timestamp) {
    this.setStates({
      x: this.getX(),
      y: this.state.y + this.state.sy - this.state.fixed,
      sy: this.state.sy+0.3,
      land: this.state.sy < 0 ? -1 : this.state.land,
    });
  };

  DoodleClient.prototype.render = function() {
    this.ctx.clearRect(
      this.state.x - this.state.sx,
      this.state.y - this.state.sy,
      this.doodleSize + 4,
      this.doodleSize + 4
    );
    this.ctx.drawImage(
      this.state.image,
      0, 0,
      this.state.image.width,
      this.state.image.width,
      this.state.x,
      this.state.y,
      this.doodleSize,
      this.doodleSize
    );
  };

  DoodleClient.prototype.getX = function() {
    var x = this.state.x + this.state.sx;
    if (this.state.x < -this.doodleSize) {
      x = app.width;
    } else if (this.state.x > app.width) {
      x = -this.doodleSize;
    }
    return x;
  };

  DoodleClient.prototype.setLand = function(land) {
    this.setStates({
      land: land,
      sy: this.initSy
    });
  }

  /**
   * @param {DeviceMotionEvent} event
   */
  DoodleClient.prototype.deviceMotion = function(event) {
    var sx = 0;
    if (Math.abs(event.accelerationIncludingGravity.x) > 0.4) {
      sx = - event.accelerationIncludingGravity.x * 2;
      this.setState('image', sx < 0 ? this.imageLeft : this.imageRight);
    }
    this.setState('sx', sx);
  };

  window.DoodleClient = DoodleClient;

})();
