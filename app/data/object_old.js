const fs = require('fs');
const CascadeRESTAPI = require("../cascade/cascade.js");


const sitedata = {
    'sitename': 'JSTest',
    'hostname': 'qa.cascade.emory.edu'
}

class Site {
    constructor() {
        this._hostname = sitedata.hostname;
        this._sitename = sitedata.sitename;
        this._siteid = '';
    }
    get siteId() {
        return this._siteid;
    }
    set siteId(siteId) {
        this._siteid = siteId;
    }
}

class cascade_Base extends Site {
    constructor(path, localStatus, remoteStatus, additionalData) {
        super();
        this._path = path;
        this._status = { 'local': localStatus, 'remote': remoteStatus };
        this._additionalData = additionalData;
        this._id = '';
        this._recycle = false;
        this._parentFolderId = '';
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get additionalData(additionalData) {
        return this._additionalData;
    }
    set additionalData(additionalData) {
        this._additionalData = additionalData;
    }
    get recycle() {
        return this._recycle;
    }
    set recycle(recyleStatus) {
        this._recycle = recyleStatus;
    }
    get parentFolderId() {
        return this._parentFolderId;
    }
    set parentFolderId(parentFolderId) {
        this._parentFolderId = parentFolderId;
    }
    getRemotePath(dest) {
        return this.path.substring(dest.length);
    }
}

class cascade_Folder extends cascade_Base {
    constructor(path, localStatus, remoteStatus) {
        super(path, localStatus, localStatus);
        this._attribute = 'folder';
    }
    get attribute() {
        return this._attribute;
    }
}

class cascade_File extends cascade_Base {
    constructor(path, localStatus, remoteStatus) {
        super(path, localStatus, localStatus);
        this._attribute = 'file';
        this._content = '';
        this._contenttype = '';
    }
    get content() {
        return this._content;
    }
    set content(content) {
        this._content = content;
    }
    get contenttype() {
        return this._contenttype;
    }
    set contenttype(contenttype) {
        this._contenttype = contenttype;
    }
    get attribute() {
        return this._attribute;
    }
    getFolderName() {
        return this.getRemotePath().substring(0, this.path.lastIndexOf('/'));
    }
    getFileName() {
        return this.getRemotePath().substring(this.path.lastIndexOf('/') + 1);
    }
    getExtension() {
        return this.getFileName().substring(this.getFileName().lastIndexOf('.') + 1);
    }
}

const initAPI = function(hostname, username, password, config) {
    var cascadeRESTAPI = CascadeRESTAPI.init(hostname, username, password, Object.assign({}, config));
    return cascadeRESTAPI;
}

module.exports = {
    initAPI: initAPI,
    Site: Site,
    cascadeBase: cascade_Base,
    cascadeFolder: cascade_Folder,
    cascadeFile: cascade_File
}