"use strict";
/**
 * Pengyin Sep 2017: To make implementation process eariser, use typescript only for object module.
 * To compile, make sure this file is activated, then go to Tasks -> Run Task... -> tsconfig.json in command platter
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Development Note: object structure follows https://qa.cascade.emory.edu/ws/services/AssetOperationService?wsdl.
 * On current development stage, some Optional Parameters (in WSDL) are not add as attribute
 */
/***********************************
 * Single Identity in WSDL Not Implemented:
 * user-group-identifier
 * search-information
 * action parameters (moveParameter, auditParameters...) are directly used in methods
 * results (operationResult, readResult...) are directly used in methods
 * user
 * user-auth-types
 * group
 * *********************************
 */
var sitedata = require("../data/sitedata");
var Authentication = /** @class */ (function () {
    function Authentication(password, username) {
        this._password = password;
        this._username = username;
    }
    Object.defineProperty(Authentication.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (value) {
            this._password = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authentication.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (value) {
            this._username = value;
        },
        enumerable: true,
        configurable: true
    });
    Authentication.prototype.authenticate = function (auth, initAPI, initialPath) {
        return initAPI.init(sitedata.sitedata.basicConfig.hostname, auth.username, auth.password);
    };
    return Authentication;
}());
exports.Authentication = Authentication;
var Path = /** @class */ (function () {
    function Path(siteid, sitename, path) {
        this._siteid = siteid;
        this._sitename = sitename;
        this._path = path;
    }
    Object.defineProperty(Path.prototype, "siteid", {
        get: function () {
            return this._siteid;
        },
        set: function (value) {
            this._siteid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "sitename", {
        get: function () {
            return this._sitename;
        },
        set: function (value) {
            this._sitename = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (value) {
            this._path = value;
        },
        enumerable: true,
        configurable: true
    });
    return Path;
}());
exports.Path = Path;
var Identifier = /** @class */ (function () {
    function Identifier(id, path, type, recycle) {
        this._id = id;
        this._path = path;
        this._type = type;
        this._recycled = false;
    }
    Object.defineProperty(Identifier.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identifier.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (value) {
            this._path = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identifier.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identifier.prototype, "recycled", {
        get: function () {
            return this._recycled;
        },
        set: function (value) {
            this._recycled = value;
        },
        enumerable: true,
        configurable: true
    });
    return Identifier;
}());
exports.Identifier = Identifier;
/***********************************
 * Classes
 * *********************************
 */
/**
 * Base Asset - Base class of all assets
 */
var BaseAsset = /** @class */ (function () {
    function BaseAsset(id) {
        this._id = id;
    }
    Object.defineProperty(BaseAsset.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseAsset;
}());
exports.BaseAsset = BaseAsset;
/**
 * Implementation of base-asset in WSDL:
 * site
 * named-asset
 * message
 * pageConfiguration
 * pageRegion
 */
var Site = /** @class */ (function (_super) {
    __extends(Site, _super);
    function Site(id, url) {
        var _this = _super.call(this, id) || this;
        _this._url = url;
        _this._recycleBinExpiration = false;
        _this._externalLinKCheckOnPublish = false;
        _this._linkCheckEnabled = false;
        _this._unPublishOnExpiration = false;
        return _this;
    }
    Object.defineProperty(Site.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "unPublishOnExpiration", {
        get: function () {
            return this._unPublishOnExpiration;
        },
        set: function (value) {
            this._unPublishOnExpiration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "recycleBinExpiration", {
        get: function () {
            return this._recycleBinExpiration;
        },
        set: function (value) {
            this._recycleBinExpiration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "linkCheckEnabled", {
        get: function () {
            return this._linkCheckEnabled;
        },
        set: function (value) {
            this._linkCheckEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "externalLinKCheckOnPublish", {
        get: function () {
            return this._externalLinKCheckOnPublish;
        },
        set: function (value) {
            this._externalLinKCheckOnPublish = value;
        },
        enumerable: true,
        configurable: true
    });
    return Site;
}(BaseAsset));
exports.Site = Site;
var PageRegion = /** @class */ (function (_super) {
    __extends(PageRegion, _super);
    function PageRegion(id, name) {
        var _this = _super.call(this, id) || this;
        _this._name = name;
        return _this;
    }
    Object.defineProperty(PageRegion.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "blockId", {
        get: function () {
            return this._blockId;
        },
        set: function (value) {
            this._blockId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "blockPath", {
        get: function () {
            return this._blockPath;
        },
        set: function (value) {
            this._blockPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "blockRecycled", {
        get: function () {
            return this._blockRecycled;
        },
        set: function (value) {
            this._blockRecycled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "noBlock", {
        get: function () {
            return this._noBlock;
        },
        set: function (value) {
            this._noBlock = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "formatId", {
        get: function () {
            return this._formatId;
        },
        set: function (value) {
            this._formatId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "formatPath", {
        get: function () {
            return this._formatPath;
        },
        set: function (value) {
            this._formatPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "formatRecycled", {
        get: function () {
            return this._formatRecycled;
        },
        set: function (value) {
            this._formatRecycled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRegion.prototype, "noFormat", {
        get: function () {
            return this._noFormat;
        },
        set: function (value) {
            this._noFormat = value;
        },
        enumerable: true,
        configurable: true
    });
    return PageRegion;
}(BaseAsset));
exports.PageRegion = PageRegion;
var NamedAsset = /** @class */ (function (_super) {
    __extends(NamedAsset, _super);
    function NamedAsset(id, name) {
        var _this = _super.call(this, id) || this;
        _this._name = name;
        return _this;
    }
    Object.defineProperty(NamedAsset.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    return NamedAsset;
}(BaseAsset));
exports.NamedAsset = NamedAsset;
/**
 * Extension of named-asset in WSDL:
 * container-asset/parent-folder-container-asset
 * role
 * site
 * target
 * destination
 * editorConfiguration
 * workflow
 */
/**
 * Extension of containered-asset:
 *
 */
var ContainerAsset = /** @class */ (function (_super) {
    __extends(ContainerAsset, _super);
    function ContainerAsset(id, name) {
        return _super.call(this, id, name) || this;
    }
    Object.defineProperty(ContainerAsset.prototype, "parentFolderId", {
        get: function () {
            return this._parentFolderId;
        },
        set: function (value) {
            this._parentFolderId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerAsset.prototype, "parentFolderPath", {
        get: function () {
            return this._parentFolderPath;
        },
        set: function (value) {
            this._parentFolderPath = value;
        },
        enumerable: true,
        configurable: true
    });
    return ContainerAsset;
}(NamedAsset));
exports.ContainerAsset = ContainerAsset;
var XsltFormat = /** @class */ (function (_super) {
    __extends(XsltFormat, _super);
    function XsltFormat(id, name) {
        return _super.call(this, id, name) || this;
    }
    Object.defineProperty(XsltFormat.prototype, "xml", {
        get: function () {
            return this._xml;
        },
        set: function (value) {
            this._xml = value;
        },
        enumerable: true,
        configurable: true
    });
    return XsltFormat;
}(ContainerAsset));
exports.XsltFormat = XsltFormat;
var ScriptFormat = /** @class */ (function (_super) {
    __extends(ScriptFormat, _super);
    function ScriptFormat(id, name) {
        return _super.call(this, id, name) || this;
    }
    Object.defineProperty(ScriptFormat.prototype, "script", {
        get: function () {
            return this._script;
        },
        set: function (value) {
            this._script = value;
        },
        enumerable: true,
        configurable: true
    });
    return ScriptFormat;
}(ContainerAsset));
exports.ScriptFormat = ScriptFormat;
var Template = /** @class */ (function (_super) {
    __extends(Template, _super);
    function Template(id, name, xml) {
        var _this = _super.call(this, id, name) || this;
        _this._xml = xml;
        return _this;
    }
    Object.defineProperty(Template.prototype, "targetId", {
        get: function () {
            return this._targetId;
        },
        set: function (value) {
            this._targetId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "targetPath", {
        get: function () {
            return this._targetPath;
        },
        set: function (value) {
            this._targetPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "formatId", {
        get: function () {
            return this._formatId;
        },
        set: function (value) {
            this._formatId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "formatPath", {
        get: function () {
            return this._formatPath;
        },
        set: function (value) {
            this._formatPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "formatRecycled", {
        get: function () {
            return this._formatRecycled;
        },
        set: function (value) {
            this._formatRecycled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "xml", {
        get: function () {
            return this._xml;
        },
        set: function (value) {
            this._xml = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "pageRegion", {
        get: function () {
            return this._pageRegion;
        },
        set: function (value) {
            this._pageRegion = value;
        },
        enumerable: true,
        configurable: true
    });
    return Template;
}(ContainerAsset));
exports.Template = Template;
var AssetFactory = /** @class */ (function (_super) {
    __extends(AssetFactory, _super);
    /*private plugins: AssetFactoryPlugins */
    function AssetFactory(id, name, assetType, workflowMode) {
        var _this = _super.call(this, id, name) || this;
        _this._assetType = assetType;
        _this._workflowMode = workflowMode;
        return _this;
    }
    Object.defineProperty(AssetFactory.prototype, "assetType", {
        get: function () {
            return this._assetType;
        },
        set: function (value) {
            this._assetType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "workflowMode", {
        get: function () {
            return this._workflowMode;
        },
        set: function (value) {
            this._workflowMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "applicableGroup", {
        get: function () {
            return this.applicableGroup;
        },
        set: function (value) {
            this.applicableGroup = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "baseAssetId", {
        get: function () {
            return this.baseAssetId;
        },
        set: function (value) {
            this.baseAssetId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "baseAssetPath", {
        get: function () {
            return this.baseAssetPath;
        },
        set: function (value) {
            this.baseAssetPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "baseAssetRecycled", {
        get: function () {
            return this.baseAssetRecycled;
        },
        set: function (value) {
            this.baseAssetRecycled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "description", {
        get: function () {
            return this.description;
        },
        set: function (value) {
            this.description = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "placementFolderId", {
        get: function () {
            return this.placementFolderId;
        },
        set: function (value) {
            this.placementFolderId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "placementFolderPath", {
        get: function () {
            return this.placementFolderPath;
        },
        set: function (value) {
            this.placementFolderPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "placementFolderRecycled", {
        get: function () {
            return this.placementFolderRecycled;
        },
        set: function (value) {
            this.placementFolderRecycled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "allowSubfolderPlacement", {
        get: function () {
            return this.allowSubfolderPlacement;
        },
        set: function (value) {
            this.allowSubfolderPlacement = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "folderPlacementPosition", {
        get: function () {
            return this.folderPlacementPosition;
        },
        set: function (value) {
            this.folderPlacementPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "overwrite", {
        get: function () {
            return this.overwrite;
        },
        set: function (value) {
            this.overwrite = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "workflowDefinitionId", {
        get: function () {
            return this.workflowDefinitionId;
        },
        set: function (value) {
            this.workflowDefinitionId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetFactory.prototype, "workflowDefinitionPath", {
        get: function () {
            return this.workflowDefinitionPath;
        },
        set: function (value) {
            this.workflowDefinitionPath = value;
        },
        enumerable: true,
        configurable: true
    });
    return AssetFactory;
}(ContainerAsset));
exports.AssetFactory = AssetFactory;
/*
END concrete types extending folder-contained-asset
*/
/**
 * list of extension of named-asset:
 * role
 *
 */
var Workflow = /** @class */ (function (_super) {
    __extends(Workflow, _super);
    function Workflow(id, name, relatedEntity, currentStep) {
        var _this = _super.call(this, id, name) || this;
        _this._relatedEntity = relatedEntity;
        _this._currentStep = currentStep;
        return _this;
    }
    Object.defineProperty(Workflow.prototype, "relatedEntity", {
        get: function () {
            return this._relatedEntity;
        },
        set: function (value) {
            this._relatedEntity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workflow.prototype, "currentStep", {
        get: function () {
            return this._currentStep;
        },
        set: function (value) {
            this._currentStep = value;
        },
        enumerable: true,
        configurable: true
    });
    return Workflow;
}(NamedAsset));
exports.Workflow = Workflow;
