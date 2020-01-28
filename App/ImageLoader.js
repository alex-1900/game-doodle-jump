(function(window, document) {
    "use strict"

    function ImageLoader(files) {
        this.files = files;
        this.promises = [];
        this.eachLoadHandle = null;
        this.data = {};
    }

    ImageLoader.prototype._loadByFileName = function(key, fileName) {
        return new Promise((function(resolve, reject) {
            var image = new Image();
            image.setAttribute('src', fileName);
            image.onload = (function() {
                return resolve(this._onImageLoad(event, key));
            }.bind(this));
            image.onabort = (function(event) {
                reject(event);
            }.bind(this));
        }).bind(this));
    };

    ImageLoader.prototype._onImageLoad = function(event, key) {
        var image = event.target;
        if (typeof(this.eachLoadHandle) === 'function') {
            this.eachLoadHandle(image, key);
        }
        this.data[key] = image;
        return image;
    };

    ImageLoader.prototype.onEachLoaded = function(callback) {
        this.eachLoadHandle = callback;
    };

    ImageLoader.prototype.load = function() {
        for (var key in this.files) {
            var fileName = this.files[key];
            this.promises.push(this._loadByFileName(key, fileName));
        }
        var data = this.data;
        return Promise.all(this.promises).then(function(images) {
            return data;
        });
    };

    window.ImageLoader = ImageLoader;
})(window, document);
