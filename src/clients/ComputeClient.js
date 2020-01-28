(function() {
  "use strict"

  function ComputeClient(id, boardClient, doodleClient) {
    AbstructClient.call(this, id);
    this.boardClient = boardClient;
    this.doodleClient = doodleClient;
  }

  extend(ComputeClient, AbstructClient);

  ComputeClient.prototype.update = function(timestamp) {
    if (this.doodleClient.state.y < app.height / 2) {
      this.doodleClient.setState('fixed', this.doodleClient.state.sy);
      if (this.doodleClient.state.sy < 0) {
        this.boardClient.updateFixedHeight(-this.doodleClient.state.sy);
      }
    }

    if (this.doodleClient.state.sy > 0) {
      this.onDoodleDown();
      this.doodleClient.setState('fixed', 0);
      if (this.doodleClient.state.y > app.height) {
        document.dispatchEvent(events.appStop);
        if (this.handleGameOver) {
          this.handleGameOver();
        }
      }
    }
  };

  ComputeClient.prototype.onGameOver = function(callback) {
    this.handleGameOver = callback;
  };

  ComputeClient.prototype.onDoodleDown = function() {
    var ds = this.doodleClient.doodleSize;
    var dx = this.doodleClient.state.x;
    var dy = this.doodleClient.state.y;
    var fix = ds * 0.24;
    var surfaceLeft = dx + ds - fix;
    var surfaceRight = dx + fix;
    var boards = this.boardClient.state.boards;

    var that = this;
    boards.forEach(function(board) {
      if (surfaceLeft > board.x && surfaceRight < board.x + 50) {
        var gap = dy + ds - board.y;
        if (gap > 0 && gap < 12) {
          that.doodleClient.setLand(board.y);
        }
      }
    });
  };

  window.ComputeClient = ComputeClient;

})();
