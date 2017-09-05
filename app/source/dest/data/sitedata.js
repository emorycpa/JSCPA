export default class SiteData {
    constructor() {
        this._basicConfig = {
            sitename: 'JSTest',
            hostname: 'qa.cascade.emory.edu',
            baseSrc: 'src',
            resourceSrc: '_includes',
            cmsSrc: '_cms',
            dest: 'dest',
            tempDelete: 'tempDeletion'
        };
        this._folderType = {
            'file': ['_includes'],
            'scriptFormat': ['_cms/vm'],
            'xsltFormat': ['_cms/xslt']
        };
        this._remoteType = {
            'folder': 'folder',
            'page': 'page',
            'file': 'file',
            'scriptFormat': 'format_SCRIPT',
            'xsltFormat': 'format_XSLT'
        };
        this._remoteContent = {
            'file': ['data', 'text'],
            'scriptFormat': ['script', 'script'],
            'xsltFormat': ['xml', 'xml']
        };
        this._contentType = {
            'buffer': ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx'],
            'data': ['css', 'js', 'php', 'csv']
        };
    }
    get basicConfig() {
        return this._basicConfig;
    }
    get folderType() {
        return this._folderType;
    }
    get remoteType() {
        return this._remoteType;
    }
    get remoteContent() {
        return this._remoteContent;
    }
    get contentType() {
        return this._contentType;
    }
}
