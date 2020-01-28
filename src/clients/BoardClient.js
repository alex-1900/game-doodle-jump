(function() {
  "use strict"

  function BoardClient(id, boards) {
    AbstructClient.call(this, id);
    var canvas = app.createCanvas();
    this.ctx = canvas.getContext('2d');

    var images = app.get('images');
    this.image = images['board'];
    this.boards = boards;

    this.state = {
      boards: [],
      prevY: app.height
    };

    this.push();
  }

  extend(BoardClient, AbstructClient);

  BoardClient.prototype.update = function(timestamp) {
    this.needSync();
    this.state.boards.forEach(function(board) {
      if (board.x + 50 >= app.width || board.x <= 0) {
        board.s = -board.s;
      }
      board.x += board.s;
    });
  };

  BoardClient.prototype.updateFixedHeight = function(fixedHeight) {
    this.fixedBoardsHeight(fixedHeight);
    this.push();
    this.setStates({
      prevY: this.state.prevY + fixedHeight
    });
  };

  BoardClient.prototype.render = function() {
    this.state.boards.forEach((function(board) {
      this.clearImage(board.x - board.s, board.y);
      this.renderImage(board.x, board.y);

    }).bind(this));
  };

  BoardClient.prototype.renderImage = function(x, y) {
    this.ctx.drawImage(
      this.image, 0, 0, this.image.width, this.image.height, x, y, 50, 12
    );
  };

  BoardClient.prototype.clearImage = function(x, y) {
    this.ctx.clearRect(x, y, 50, 12);
  };

  BoardClient.prototype.push = function() {
    while(this.state.prevY > 0 && this.boards.length > 0) {
      var boardInfo = this.boards.shift();
      var y = this.state.prevY - boardInfo[1] * app.height;
      var speed = boardInfo[2] ? boardInfo[2] : 0;
      this.state.boards.push({x: boardInfo[0] * app.width, y: y, s: speed});
      this.setState('prevY', y);
    }
  };

  BoardClient.prototype.fixedBoardsHeight = function(fixedHeight) {
    this.state.boards && this.state.boards.forEach((board, index) => {
      if (board.y > app.height + 8) {
        this.state.boards.shift();
      } else {
        this.clearImage(board.x, board.y);
        board.y += fixedHeight;
        this.renderImage(board.x, board.y);
      }
    });
  };

  window.BoardClient = BoardClient;

})();
