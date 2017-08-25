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
    }
}

class cascade_Base extends Site {
    constructor(path, localStatus, remoteStatus) {
        super();
        this.path = path;
        this.status = { 'local': localStatus, 'remote': remoteStatus };
    }
    getFolderName() {
        return this.path.substring(0, this.path.lastIndexOf('/'));
    }
    getFileName() {
        return this.path.substring(this.path.lastIndexOf('/') + 1);
    }
}

class cascade_File extends cascade_Base {
    constructor(path, localStatus, remoteStatus, type, contenttype, api) {
        super(path, localStatus, localStatus);
        this.type = type;
        this.contenttype = contenttype;
        this.api = api;
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
}

const initAPI = function(hostname, username, password, config) {
    var cascadeRESTAPI = CascadeRESTAPI.init(hostname, username, password, Object.assign({}, config));
    return cascadeRESTAPI;
}

module.exports = {
    initAPI: initAPI,
    Site: Site,
    cascadeBase: cascade_Base,
    cascadeFile: cascade_File
}