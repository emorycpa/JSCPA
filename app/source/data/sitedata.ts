class SiteData {
    private _basicConfig: any;
    private _folderType: any;
    private _remoteType: any;
    private _remoteContent: any;
    private _contentType: any;
    constructor() {
        this._basicConfig = {
            sitename: 'JSTest',
            hostname: 'qa.cascade.emory.edu',
            baseSrc: 'source',
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
        }
    }

    public get basicConfig(): any {
        return this._basicConfig;
    }

    public get folderType(): any {
        return this._folderType;
    }

    public get remoteType(): any {
        return this._remoteType;
    }

    public get remoteContent(): any {
        return this._remoteContent;
    }

	public get contentType(): any {
		return this._contentType;
	}

}
const sitedata = new SiteData();

export {sitedata};