var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fs = require('fs');
var CascadeRESTAPI = require("../cascade/cascade.js");
var sitedata = {
    'sitename': 'JSTest',
    'hostname': 'qa.cascade.emory.edu'
};
var Site = /** @class */ (function () {
    function Site() {
        this._hostname = sitedata.hostname;
        this._sitename = sitedata.sitename;
        this._siteid = '';
    }
    Object.defineProperty(Site.prototype, "siteId", {
        get: function () {
            return this._siteid;
        },
        set: function (siteId) {
            this._siteid = siteId;
        },
        enumerable: true,
        configurable: true
    });
    return Site;
}());
var cascade_Base = /** @class */ (function (_super) {
    __extends(cascade_Base, _super);
    function cascade_Base(path, localStatus, remoteStatus, additionalData) {
        var _this = _super.call(this) || this;
        _this._path = path;
        _this._status = { 'local': localStatus, 'remote': remoteStatus };
        _this._additionalData = additionalData;
        _this._id = '';
        _this._recycle = false;
        _this._parentFolderId = '';
        return _this;
    }
    Object.defineProperty(cascade_Base.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cascade_Base.prototype, "additionalData", {
        get: function (additionalData) {
            return this._additionalData;
        },
        set: function (additionalData) {
            this._additionalData = additionalData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cascade_Base.prototype, "recycle", {
        get: function () {
            return this._recycle;
        },
        set: function (recyleStatus) {
            this._recycle = recyleStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cascade_Base.prototype, "parentFolderId", {
        get: function () {
            return this._parentFolderId;
        },
        set: function (parentFolderId) {
            this._parentFolderId = parentFolderId;
        },
        enumerable: true,
        configurable: true
    });
    cascade_Base.prototype.getRemotePath = function (dest) {
        return this.path.substring(dest.length);
    };
    return cascade_Base;
}(Site));
var cascade_Folder = /** @class */ (function (_super) {
    __extends(cascade_Folder, _super);
    function cascade_Folder(path, localStatus, remoteStatus) {
        var _this = _super.call(this, path, localStatus, localStatus) || this;
        _this._attribute = 'folder';
        return _this;
    }
    Object.defineProperty(cascade_Folder.prototype, "attribute", {
        get: function () {
            return this._attribute;
        },
        enumerable: true,
        configurable: true
    });
    return cascade_Folder;
}(cascade_Base));
var cascade_File = /** @class */ (function (_super) {
    __extends(cascade_File, _super);
    function cascade_File(path, localStatus, remoteStatus) {
        var _this = _super.call(this, path, localStatus, localStatus) || this;
        _this._attribute = 'file';
        _this._content = '';
        _this._contenttype = '';
        return _this;
    }
    Object.defineProperty(cascade_File.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (content) {
            this._content = content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cascade_File.prototype, "contenttype", {
        get: function () {
            return this._contenttype;
        },
        set: function (contenttype) {
            this._contenttype = contenttype;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cascade_File.prototype, "attribute", {
        get: function () {
            return this._attribute;
        },
        enumerable: true,
        configurable: true
    });
    cascade_File.prototype.getFolderName = function () {
        return this.getRemotePath().substring(0, this.path.lastIndexOf('/'));
    };
    cascade_File.prototype.getFileName = function () {
        return this.getRemotePath().substring(this.path.lastIndexOf('/') + 1);
    };
    cascade_File.prototype.getExtension = function () {
        return this.getFileName().substring(this.getFileName().lastIndexOf('.') + 1);
    };
    return cascade_File;
}(cascade_Base));
var initAPI = function (hostname, username, password, config) {
    var cascadeRESTAPI = CascadeRESTAPI.init(hostname, username, password, Object.assign({}, config));
    return cascadeRESTAPI;
};
module.exports = {
    initAPI: initAPI,
    Site: Site,
    cascadeBase: cascade_Base,
    cascadeFolder: cascade_Folder,
    cascadeFile: cascade_File
};
