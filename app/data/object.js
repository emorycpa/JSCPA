const fs = require('fs');
const CascadeRESTAPI = require("../cascade/cascade.js");

const sitedata = {
    'sitename': 'JSTest',
    'hostname': 'qa.cascade.emory.edu'
}

class Site {
    constructor() {
        this.hostname = sitedata.hostname;
        this.sitename = sitedata.sitename;
        this.siteid = '';
    }
    setSiteId(siteId) {
        this.siteid = siteId;
    }
}

class cascade_Base extends Site {
    constructor(path, localStatus, remoteStatus, additionalData) {
        super();
        this.path = path;
        this.status = { 'local': localStatus, 'remote': remoteStatus };
        this.additionalData = additionalData;
        this.id = '';
        this.recycle = false;
    }
    getRemotePath(dest) {
        return this.path.substring(dest.length);
    }
    setId(id) {
        this.id = id;
    }
    setRecycle(recyleStatus) {
        this.recycle = recyle;
    }
}

class cascade_Folder extends cascade_Base {
    constructor(path, localStatus, remoteStatus) {
        super(path, localStatus, localStatus);
        this.attribute = 'folder';
    }
}

class cascade_File extends cascade_Base {
    constructor(path, localStatus, remoteStatus, type, contenttype) {
        super(path, localStatus, localStatus);
        this.type = type;
        this.contenttype = contenttype;
        this.attribute = 'file';
    }
    getContent() {
        if (this.contenttype == 'buffer') {
            fs.readFile(this.path, (error, data) => {
                if (error) return { 'code': 'false', data: error };
                else return { 'code': 'true', data: data };
            });
        } else {
            fs.readFile(this.path, 'utf8', (error, data) => {
                if (error) return { 'code': 'false', data: error };
                else return { 'code': 'true', data: data };
            });
        }
    }
    getFolderName() {
        return this.getRemotePath().substring(0, this.path.lastIndexOf('/'));
    }
    getFileName() {
            return this.getRemotePath().substring(this.path.lastIndexOf('/') + 1);
        }
        /*
        generateAsset(partentFolderResponse) {
            return {
                "asset": {
                    "scriptFormat": {
                        "parentFolderId": partentFolderResponse.data.asset.folder.id,
                        "siteId": partentFolderResponse.data.asset.folder.siteId,
                        "name": this.getFileName()
                    }
                }
            }
        }
        generateFolerAsset(folderCreateResponse) {
            return {
                "asset": {
                    "folder": {
                        "siteId": folderCreateResponse.data.asset.folder.siteId,
                        "name": this.getFolderName(),
                        "parentFolderId": folderCreateResponse.data.asset.folder.id
                    }
                }
            }
        }
        */
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