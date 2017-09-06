"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SiteData = /** @class */ (function () {
    function SiteData() {
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
    Object.defineProperty(SiteData.prototype, "basicConfig", {
        get: function () {
            return this._basicConfig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SiteData.prototype, "folderType", {
        get: function () {
            return this._folderType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SiteData.prototype, "remoteType", {
        get: function () {
            return this._remoteType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SiteData.prototype, "remoteContent", {
        get: function () {
            return this._remoteContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SiteData.prototype, "contentType", {
        get: function () {
            return this._contentType;
        },
        enumerable: true,
        configurable: true
    });
    return SiteData;
}());
var sitedata = new SiteData();
exports.sitedata = sitedata;
