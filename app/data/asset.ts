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
class Authentication {
	private _password: string;
	private _username: string;
	constructor(password: string, username: string) {
		this._password = password;
		this._username = username;
	}

	public get password(): string {
		return this._password;
	}

	public set password(value: string) {
		this._password = value;
	}

	public get username(): string {
		return this._username;
	}

	public set username(value: string) {
		this._username = value;
	}

}

const enum EntityTypeString {
	"assetfactory",
	"assetfactorycontainer",
	"block",
	"block_FEED",
	"block_INDEX",
	"block_TEXT",
	"block_XHTML_DATADEFINITION",
	"block_XML",
	"block_TWITTER_FEED",
	"connectorcontainer",
	"twitterconnector",
	"facebookconnector",
	"wordpressconnector",
	"googleanalyticsconnector",
	"contenttype",
	"contenttypecontainer",
	"destination",
	"editorconfiguration",
	"file",
	"folder",
	"group",
	"message",
	"metadataset",
	"metadatasetcontainer",
	"page",
	"pageconfigurationset",
	"pageconfiguration",
	"pageregion",
	"pageconfigurationsetcontainer",
	"publishset",
	"publishsetcontainer",
	"reference",
	"role",
	"datadefinition",
	"datadefinitioncontainer",
	"format",
	"format_XSLT",
	"format_SCRIPT",
	"site",
	"sitedestinationcontainer",
	"symlink",
	"target",
	"template",
	"transport",
	"transport_fs",
	"transport_ftp",
	"transport_db",
	"transportcontainer",
	"user",
	"workflow",
	"workflowdefinition",
	"workflowdefinitioncontainer"
}

class Path {
	private _siteid: string;
	private _sitename: string;
	private _path: string;
	constructor(siteid: string, sitename: string, path: string) {
		this._siteid = siteid;
		this._sitename = sitename;
		this._path = path;
	}

	public get siteid(): string {
		return this._siteid;
	}

	public set siteid(value: string) {
		this._siteid = value;
	}

	public get sitename(): string {
		return this._sitename;
	}
	public set sitename(value: string) {
		this._sitename = value;
	}
	public get path(): string {
		return this._path;
	}
	public set path(value: string) {
		this._path = value;
	}
}

class Identifier {
	private _id: string;
	private _path: Path;
	private _type: EntityTypeString;
	private _recycled: boolean;
	constructor(id: string, path: Path, type: EntityTypeString, recycle: boolean) {
		this._id = id;
		this._path = path;
		this._type = type;
		this._recycled = false;
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get path(): Path {
		return this._path;
	}

	public set path(value: Path) {
		this._path = value;
	}

	public get type(): EntityTypeString {
		return this._type;
	}

	public set type(value: EntityTypeString) {
		this._type = value;
	}

	public get recycled(): boolean {
		return this._recycled;
	}

	public set recycled(value: boolean) {
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
class BaseAsset {
	private _id: string;
	constructor(id: string) {
		this._id = id;
	}
	public get id(): string {
		return this._id;
	}
	public set id(value: string) {
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
class Site extends BaseAsset {
	private _url: string;
	private _recycleBinExpiration: boolean;
	private _unPublishOnExpiration: boolean;
	private _linkCheckEnabled: boolean;
	private _externalLinKCheckOnPublish: boolean;
	constructor(id: string, url: string) {
		super(id);
		this._url = url;
		this._recycleBinExpiration = false;
		this._externalLinKCheckOnPublish = false;
		this._linkCheckEnabled = false;
		this._unPublishOnExpiration = false;
	}

	public get url(): string {
		return this._url;
	}

	public set url(value: string) {
		this._url = value;
	}

	public get unPublishOnExpiration(): boolean {
		return this._unPublishOnExpiration;
	}

	public set unPublishOnExpiration(value: boolean) {
		this._unPublishOnExpiration = value;
	}

	public get recycleBinExpiration(): boolean {
		return this._recycleBinExpiration;
	}

	public set recycleBinExpiration(value: boolean) {
		this._recycleBinExpiration = value;
	}

	public get linkCheckEnabled(): boolean {
		return this._linkCheckEnabled;
	}

	public set linkCheckEnabled(value: boolean) {
		this._linkCheckEnabled = value;
	}

	public get externalLinKCheckOnPublish(): boolean {
		return this._externalLinKCheckOnPublish;
	}

	public set externalLinKCheckOnPublish(value: boolean) {
		this._externalLinKCheckOnPublish = value;
	}

}

class PageRegion extends BaseAsset{
	private _name: string;
	private _blockId: string;
	private _blockPath: string;
	private _blockRecycled: boolean;
	private _noBlock: boolean;
	private _formatId: string;
	private _formatPath: string;
	private _formatRecycled: boolean;
	private _noFormat: boolean;
	constructor(id: string, name: string){
		super(id);
		this._name = name;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get blockId(): string {
		return this._blockId;
	}

	public set blockId(value: string) {
		this._blockId = value;
	}

	public get blockPath(): string {
		return this._blockPath;
	}

	public set blockPath(value: string) {
		this._blockPath = value;
	}

	public get blockRecycled(): boolean {
		return this._blockRecycled;
	}

	public set blockRecycled(value: boolean) {
		this._blockRecycled = value;
	}

	public get noBlock(): boolean {
		return this._noBlock;
	}

	public set noBlock(value: boolean) {
		this._noBlock = value;
	}

	public get formatId(): string {
		return this._formatId;
	}

	public set formatId(value: string) {
		this._formatId = value;
	}

	public get formatPath(): string {
		return this._formatPath;
	}

	public set formatPath(value: string) {
		this._formatPath = value;
	}

	public get formatRecycled(): boolean {
		return this._formatRecycled;
	}

	public set formatRecycled(value: boolean) {
		this._formatRecycled = value;
	}

	public get noFormat(): boolean {
		return this._noFormat;
	}

	public set noFormat(value: boolean) {
		this._noFormat = value;
	}
}

class NamedAsset extends BaseAsset {
	private _name: string;
	constructor(id: string, name: string) {
		super(id);
		this._name = name;
	}
	public get name(): string {
		return this._name;
	}
	public set name(value: string) {
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
class ContainerAsset extends NamedAsset {
	private _parentFolderId: string;
	private _parentFolderPath: string;
	constructor(id: string, name: string) {
		super(id, name);
	}

	public get parentFolderId(): string {
		return this._parentFolderId;
	}

	public set parentFolderId(value: string) {
		this._parentFolderId = value;
	}

	public get parentFolderPath(): string {
		return this._parentFolderPath;
	}

	public set parentFolderPath(value: string) {
		this._parentFolderPath = value;
	}

}

class XsltFormat extends ContainerAsset {
	private _xml: string;
	constructor(id: string, name: string) {
		super(id, name);
	}
	public get xml(): string {
		return this._xml;
	}
	public set xml(value: string) {
		this._xml = value;
	}
}

class ScriptFormat extends ContainerAsset {
	private _script: string;
	constructor(id: string, name: string, ) {
		super(id, name);
	}
	public get script(): string {
		return this._script;
	}
	public set script(value: string) {
		this._script = value;
	}

}

class Template extends ContainerAsset {
	private _targetId: string;
	private _targetPath: string;
	private _formatId: string;
	private _formatPath: string;
	private _formatRecycled: string;
	private _xml: string; //required
	private _pageRegion: [PageRegion];
	constructor(id: string, name: string, xml: string) {
		super(id, name);
		this._xml = xml;
	}

	public get targetId(): string {
		return this._targetId;
	}

	public set targetId(value: string) {
		this._targetId = value;
	}

	public get targetPath(): string {
		return this._targetPath;
	}

	public set targetPath(value: string) {
		this._targetPath = value;
	}

	public get formatId(): string {
		return this._formatId;
	}

	public set formatId(value: string) {
		this._formatId = value;
	}

	public get formatPath(): string {
		return this._formatPath;
	}

	public set formatPath(value: string) {
		this._formatPath = value;
	}

	public get formatRecycled(): string {
		return this._formatRecycled;
	}

	public set formatRecycled(value: string) {
		this._formatRecycled = value;
	}

	public get xml(): string {
		return this._xml;
	}

	public set xml(value: string) {
		this._xml = value;
	}

	public get pageRegion(): [PageRegion] {
		return this._pageRegion;
	}

	public set pageRegion(value: [PageRegion]) {
		this._pageRegion = value;
	}
	
}

class AssetFactory extends ContainerAsset{
	private _assetType: string; //required
	private _workflowMode: string; //required
	private _applicableGroup: string;
	private _baseAssetId: string;
	private _baseAssetPath: string;
	private _baseAssetRecycled: boolean;
	private _description: string;
	private _placementFolderId: string;
	private _placementFolderPath: string;
	private _placementFolderRecycled: boolean;
	private _allowSubfolderPlacement: boolean;
	private _folderPlacementPosition: number;
	private _overwrite: boolean;
	private _workflowDefinitionId: string;
	private _workflowDefinitionPath: string;
	/*private plugins: AssetFactoryPlugins */
	constructor(id: string, name:string, assetType: string, workflowMode: string){
		super(id, name);
		this._assetType = assetType;
		this._workflowMode = workflowMode;
	}

	public get assetType(): string {
		return this._assetType;
	}

	public set assetType(value: string) {
		this._assetType = value;
	}

	public get workflowMode(): string {
		return this._workflowMode;
	}

	public set workflowMode(value: string) {
		this._workflowMode = value;
	}

	public get applicableGroup(): string {
		return this.applicableGroup;
	}

	public set applicableGroup(value: string) {
		this.applicableGroup = value;
	}

	public get baseAssetId(): string {
		return this.baseAssetId;
	}

	public set baseAssetId(value: string) {
		this.baseAssetId = value;
	}

	public get baseAssetPath(): string {
		return this.baseAssetPath;
	}

	public set baseAssetPath(value: string) {
		this.baseAssetPath = value;
	}

	public get baseAssetRecycled(): boolean {
		return this.baseAssetRecycled;
	}

	public set baseAssetRecycled(value: boolean) {
		this.baseAssetRecycled = value;
	}

	public get description(): string {
		return this.description;
	}

	public set description(value: string) {
		this.description = value;
	}

	public get placementFolderId(): string {
		return this.placementFolderId;
	}

	public set placementFolderId(value: string) {
		this.placementFolderId = value;
	}

	public get placementFolderPath(): string {
		return this.placementFolderPath;
	}

	public set placementFolderPath(value: string) {
		this.placementFolderPath = value;
	}

	public get placementFolderRecycled(): boolean {
		return this.placementFolderRecycled;
	}

	public set placementFolderRecycled(value: boolean) {
		this.placementFolderRecycled = value;
	}

	public get allowSubfolderPlacement(): boolean {
		return this.allowSubfolderPlacement;
	}

	public set allowSubfolderPlacement(value: boolean) {
		this.allowSubfolderPlacement = value;
	}

	public get folderPlacementPosition(): number {
		return this.folderPlacementPosition;
	}

	public set folderPlacementPosition(value: number) {
		this.folderPlacementPosition = value;
	}

	public get overwrite(): boolean {
		return this.overwrite;
	}

	public set overwrite(value: boolean) {
		this.overwrite = value;
	}

	public get workflowDefinitionId(): string {
		return this.workflowDefinitionId;
	}

	public set workflowDefinitionId(value: string) {
		this.workflowDefinitionId = value;
	}

	public get workflowDefinitionPath(): string {
		return this.workflowDefinitionPath;
	}

	public set workflowDefinitionPath(value: string) {
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
class Workflow extends NamedAsset {
	private _relatedEntity: Identifier;
	private _currentStep: string;
	constructor(id: string, name: string, relatedEntity: Identifier, currentStep: string) {
		super(id, name);
		this._relatedEntity = relatedEntity;
		this._currentStep = currentStep;
	}

	public get relatedEntity(): Identifier {
		return this._relatedEntity;
	}

	public set relatedEntity(value: Identifier) {
		this._relatedEntity = value;
	}

	public get currentStep(): string {
		return this._currentStep;
	}

	public set currentStep(value: string) {
		this._currentStep = value;
	}

}
