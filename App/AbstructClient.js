(function(window, document) {
    "use strict"

    /**
     * client 对象原型
     * @param {Layer} frame client 所在的 Layer 对象
     */
    function AbstructClient(id) {
        this.id = id;
        this._state = {
            synchronized: true,
            timestamp: 0
        };
    }

    /**
     * @abstract
     * client 需要实现 update 方法，以帧为单位更新状态
     */
    AbstructClient.prototype.update = function(timestamp) {
        // pass
    };

    /**
     * @abstract
     */
    AbstructClient.prototype.render = function() {
        // pass
    };

    AbstructClient.prototype.setStates = function(states) {
        for (var key in states) {
            this.setState(key, states[key]);
        }
    };

    AbstructClient.prototype.setState = function(key, value) {
        if (this.state[key] != value) {
            this.state[key] = value;
            this._state.synchronized = true;
            return true;
        }
        return false;
    };

    AbstructClient.prototype.isOvertime = function(timestamp, msecond) {
        if (timestamp - this._state.timestamp >= msecond) {
            this._state.timestamp = timestamp;
            return true;
        }
        return false;
    };

    /**
     * @abstract
     * 析构方法
     */
    AbstructClient.prototype.terminate = function(app) {
        app.removeClient(this.id);
    };

    AbstructClient.prototype.isSynchronized = function() {
        return this._state.synchronized;
    };

    AbstructClient.prototype.sync = function() {
        this._state.synchronized = false;
    };

    AbstructClient.prototype.needSync = function() {
        this._state.synchronized = true;
    };

    window.AbstructClient = AbstructClient;
})(window, document);
