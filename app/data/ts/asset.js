/**
 * Pengyin Sep 2017: To make implementation process eariser, use typescript only for object module.
 * To compile, make sure this file is activated, then go to Tasks -> Run Task... -> tsconfig.json in command platter
 */
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
import * as SiteData from "../data/sitedata.js";
export class Authentication {
    constructor(password, username) {
        this._password = password;
        this._username = username;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
    }
    authenticate(auth, initAPI, initialPath) {
        return initAPI.init(SiteData.sitedata().hostname, auth.username, auth.password);
    }
}
export class Path {
    constructor(siteid, sitename, path) {
        this._siteid = siteid;
        this._sitename = sitename;
        this._path = path;
    }
    get siteid() {
        return this._siteid;
    }
    set siteid(value) {
        this._siteid = value;
    }
    get sitename() {
        return this._sitename;
    }
    set sitename(value) {
        this._sitename = value;
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
}
export class Identifier {
    constructor(id, path, type, recycle) {
        this._id = id;
        this._path = path;
        this._type = type;
        this._recycled = false;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get recycled() {
        return this._recycled;
    }
    set recycled(value) {
        this._recycled = value;
    }
}
/***********************************
 * Classes
 * *********************************
 */
/**
 * Base Asset - Base class of all assets
 */
export class BaseAsset {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
}
/**
 * Implementation of base-asset in WSDL:
 * site
 * named-asset
 * message
 * pageConfiguration
 * pageRegion
 */
export class Site extends BaseAsset {
    constructor(id, url) {
        super(id);
        this._url = url;
        this._recycleBinExpiration = false;
        this._externalLinKCheckOnPublish = false;
        this._linkCheckEnabled = false;
        this._unPublishOnExpiration = false;
    }
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }
    get unPublishOnExpiration() {
        return this._unPublishOnExpiration;
    }
    set unPublishOnExpiration(value) {
        this._unPublishOnExpiration = value;
    }
    get recycleBinExpiration() {
        return this._recycleBinExpiration;
    }
    set recycleBinExpiration(value) {
        this._recycleBinExpiration = value;
    }
    get linkCheckEnabled() {
        return this._linkCheckEnabled;
    }
    set linkCheckEnabled(value) {
        this._linkCheckEnabled = value;
    }
    get externalLinKCheckOnPublish() {
        return this._externalLinKCheckOnPublish;
    }
    set externalLinKCheckOnPublish(value) {
        this._externalLinKCheckOnPublish = value;
    }
}
export class PageRegion extends BaseAsset {
    constructor(id, name) {
        super(id);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get blockId() {
        return this._blockId;
    }
    set blockId(value) {
        this._blockId = value;
    }
    get blockPath() {
        return this._blockPath;
    }
    set blockPath(value) {
        this._blockPath = value;
    }
    get blockRecycled() {
        return this._blockRecycled;
    }
    set blockRecycled(value) {
        this._blockRecycled = value;
    }
    get noBlock() {
        return this._noBlock;
    }
    set noBlock(value) {
        this._noBlock = value;
    }
    get formatId() {
        return this._formatId;
    }
    set formatId(value) {
        this._formatId = value;
    }
    get formatPath() {
        return this._formatPath;
    }
    set formatPath(value) {
        this._formatPath = value;
    }
    get formatRecycled() {
        return this._formatRecycled;
    }
    set formatRecycled(value) {
        this._formatRecycled = value;
    }
    get noFormat() {
        return this._noFormat;
    }
    set noFormat(value) {
        this._noFormat = value;
    }
}
export class NamedAsset extends BaseAsset {
    constructor(id, name) {
        super(id);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}
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
export class ContainerAsset extends NamedAsset {
    constructor(id, name) {
        super(id, name);
    }
    get parentFolderId() {
        return this._parentFolderId;
    }
    set parentFolderId(value) {
        this._parentFolderId = value;
    }
    get parentFolderPath() {
        return this._parentFolderPath;
    }
    set parentFolderPath(value) {
        this._parentFolderPath = value;
    }
}
export class XsltFormat extends ContainerAsset {
    constructor(id, name) {
        super(id, name);
    }
    get xml() {
        return this._xml;
    }
    set xml(value) {
        this._xml = value;
    }
}
export class ScriptFormat extends ContainerAsset {
    constructor(id, name) {
        super(id, name);
    }
    get script() {
        return this._script;
    }
    set script(value) {
        this._script = value;
    }
}
export class Template extends ContainerAsset {
    constructor(id, name, xml) {
        super(id, name);
        this._xml = xml;
    }
    get targetId() {
        return this._targetId;
    }
    set targetId(value) {
        this._targetId = value;
    }
    get targetPath() {
        return this._targetPath;
    }
    set targetPath(value) {
        this._targetPath = value;
    }
    get formatId() {
        return this._formatId;
    }
    set formatId(value) {
        this._formatId = value;
    }
    get formatPath() {
        return this._formatPath;
    }
    set formatPath(value) {
        this._formatPath = value;
    }
    get formatRecycled() {
        return this._formatRecycled;
    }
    set formatRecycled(value) {
        this._formatRecycled = value;
    }
    get xml() {
        return this._xml;
    }
    set xml(value) {
        this._xml = value;
    }
    get pageRegion() {
        return this._pageRegion;
    }
    set pageRegion(value) {
        this._pageRegion = value;
    }
}
export class AssetFactory extends ContainerAsset {
    /*private plugins: AssetFactoryPlugins */
    constructor(id, name, assetType, workflowMode) {
        super(id, name);
        this._assetType = assetType;
        this._workflowMode = workflowMode;
    }
    get assetType() {
        return this._assetType;
    }
    set assetType(value) {
        this._assetType = value;
    }
    get workflowMode() {
        return this._workflowMode;
    }
    set workflowMode(value) {
        this._workflowMode = value;
    }
    get applicableGroup() {
        return this.applicableGroup;
    }
    set applicableGroup(value) {
        this.applicableGroup = value;
    }
    get baseAssetId() {
        return this.baseAssetId;
    }
    set baseAssetId(value) {
        this.baseAssetId = value;
    }
    get baseAssetPath() {
        return this.baseAssetPath;
    }
    set baseAssetPath(value) {
        this.baseAssetPath = value;
    }
    get baseAssetRecycled() {
        return this.baseAssetRecycled;
    }
    set baseAssetRecycled(value) {
        this.baseAssetRecycled = value;
    }
    get description() {
        return this.description;
    }
    set description(value) {
        this.description = value;
    }
    get placementFolderId() {
        return this.placementFolderId;
    }
    set placementFolderId(value) {
        this.placementFolderId = value;
    }
    get placementFolderPath() {
        return this.placementFolderPath;
    }
    set placementFolderPath(value) {
        this.placementFolderPath = value;
    }
    get placementFolderRecycled() {
        return this.placementFolderRecycled;
    }
    set placementFolderRecycled(value) {
        this.placementFolderRecycled = value;
    }
    get allowSubfolderPlacement() {
        return this.allowSubfolderPlacement;
    }
    set allowSubfolderPlacement(value) {
        this.allowSubfolderPlacement = value;
    }
    get folderPlacementPosition() {
        return this.folderPlacementPosition;
    }
    set folderPlacementPosition(value) {
        this.folderPlacementPosition = value;
    }
    get overwrite() {
        return this.overwrite;
    }
    set overwrite(value) {
        this.overwrite = value;
    }
    get workflowDefinitionId() {
        return this.workflowDefinitionId;
    }
    set workflowDefinitionId(value) {
        this.workflowDefinitionId = value;
    }
    get workflowDefinitionPath() {
        return this.workflowDefinitionPath;
    }
    set workflowDefinitionPath(value) {
        this.workflowDefinitionPath = value;
    }
}
/*
END concrete types extending folder-contained-asset
*/
/**
 * list of extension of named-asset:
 * role
 *
 */
export class Workflow extends NamedAsset {
    constructor(id, name, relatedEntity, currentStep) {
        super(id, name);
        this._relatedEntity = relatedEntity;
        this._currentStep = currentStep;
    }
    get relatedEntity() {
        return this._relatedEntity;
    }
    set relatedEntity(value) {
        this._relatedEntity = value;
    }
    get currentStep() {
        return this._currentStep;
    }
    set currentStep(value) {
        this._currentStep = value;
    }
}
