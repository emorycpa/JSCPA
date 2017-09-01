class Identifier {
    constructor(id, sitename, path) {
        this._id = id;
        this._sitename = sitename;
        this._path = path;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
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
    validate() {
        if (this._id || (this._path && this._sitename)) {
            return true;
        }
        else
            return false;
    }
}
/**
 * Base Asset - Base class of all assets
 */
class BaseAsset {
    constructor(identifier) {
        this._identifier = identifier;
    }
    get identifier() {
        return this._identifier;
    }
    set identifier(value) {
        this._identifier = value;
    }
}
/**
 * Implementation of Base Asset - named-asset
 */
class NamedAsset extends BaseAsset {
    constructor(identifier, name) {
        super(identifier);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}
//# sourceMappingURL=object.js.map