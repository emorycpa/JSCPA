var Promise = require("bluebird");
var cascadeObject = require("../data/object.js");
var init = function (cascadeClient) {
    var requiredMethods = ["readPromise", "createPromise", "movePromise", "editPromise", "deletePromise"];
    requiredMethods.forEach(function (method) {
        if (!cascadeClient[method]) {
            throw "Missing method " + method + " in REST client.";
        }
    });
    cascadeClient.registerMethod("file", "read", function (client) {
        return function (cascadeFile) {
            return client.readPromise({
                "identifier": {
                    "type": "file",
                    "path": {
                        "siteName": cascadeFile.sitename,
                        "path": cascadeFile.path
                    }
                }
            });
        };
    });
    cascadeClient.registerMethod("file", "delete", function (client) {
        return function (cascadeFile) {
            return client.deletePromise({
                "identifier": {
                    "type": "file",
                    "path": {
                        "siteName": cascadeFile.sitename,
                        "path": cascadeFile.path
                    }
                }
            });
        };
    });
    //Move parameter? https://qa.cascade.emory.edu/ws/services/AssetOperationService?wsdl
    cascadeClient.registerMethod("file", "move", function (client) {
        return function (cascadeFile) {
            return client.movePromise({
                "identifier": {
                    "type": "file",
                    "path": {
                        "siteName": cascadeFile.sitename,
                        "path": cascadeFile.path
                    }
                }
            });
        };
    });
    cascadeClient.registerMethod("file", "write", function (client) {
        return function (cascadeFile) {
            var pathPartsArray = path.split("/");
            var fileName = pathPartsArray.pop();
            return client.readPromise({
                "identifier": {
                    "type": "file",
                    "path": {
                        "siteName": cascadeFile.sitename,
                        "path": cascadeFile.path
                    }
                }
            }).then(function (requestReturn) {
                if (requestReturn.data.success) {
                    var editAssetObj = {
                        "asset": {
                            "file": {
                                "parentFolderId": requestReturn.data.asset.file.parentFolderId,
                                "id": requestReturn.data.asset.file.id,
                                "siteId": requestReturn.data.asset.file.siteId
                            }
                        }
                    };
                    if (Buffer.isBuffer(cascadeFile.getContent().data)) {
                        editAssetObj.asset.file["data"] = Array.from((new Int8Array(cascadeFile.getContent().data)));
                    }
                    else {
                        editAssetObj.asset.file["text"] = cascadeFile.getContent().data;
                    }
                    if (cascadeFile.additionalData === Object(cascadeFile.additionalData)) {
                        Object.assign(editAssetObj.asset.file, cascadeFile.additionalData);
                    }
                    return client.editPromise(editAssetObj);
                }
                else {
                    var pathsStrings = [];
                    while (pathPartsArray.length > 0) {
                        if (pathPartsArray.length == 1) {
                            pathsStrings.unshift("/");
                        }
                        else {
                            pathsStrings.unshift(pathPartsArray.join("/"));
                        }
                        pathPartsArray.pop();
                    }
                    return Promise.mapSeries(pathsStrings, function (folderPath) {
                        var currentFolderPath = (' ' + folderPath).slice(1);
                        return client.readPromise({
                            "identifier": {
                                "type": "folder",
                                "path": {
                                    "siteName": cascadeFile.sitename,
                                    "path": cascadeFile.path
                                }
                            }
                        }).then(function (folderReadRequestReturn) {
                            if (folderReadRequestReturn.data.success) {
                                return folderReadRequestReturn;
                            }
                            else {
                                var parentFolderPath = '';
                                var pathcurrentFolderPathParts = currentFolderPath.split('/');
                                var createFolderName = pathcurrentFolderPathParts.pop();
                                parentFolderPath += pathcurrentFolderPathParts.join('/');
                                return client.readPromise({
                                    "identifier": {
                                        "type": "folder",
                                        "path": {
                                            "siteName": cascadeFile.sitename,
                                            "path": cascadeFile.path
                                        }
                                    }
                                }).then(function (folderReadCreateRequestReturn) {
                                    return client.createPromise({
                                        "asset": {
                                            "folder": {
                                                "siteId": folderReadCreateRequestReturn.data.asset.folder.siteId,
                                                "name": createFolderName,
                                                "parentFolderId": folderReadCreateRequestReturn.data.asset.folder.id
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }).then(function (data) {
                        var folderPath = pathsStrings.pop();
                        return client.readPromise({
                            "identifier": {
                                "type": "folder",
                                "path": {
                                    "siteName": cascadeFile.sitename,
                                    "path": folderPath
                                }
                            }
                        }).then(function (partentFolderRequestReturn) {
                            var createAssetObj = {
                                "asset": {
                                    "file": {
                                        "parentFolderId": partentFolderRequestReturn.data.asset.folder.id,
                                        "siteId": partentFolderRequestReturn.data.asset.folder.siteId,
                                        "name": fileName
                                    }
                                }
                            };
                            if (cascadeFile.additionalData === Object(cascadeFile.additionalData)) {
                                Object.assign(createAssetObj.asset.file, additionalData);
                            }
                            if (Buffer.isBuffer(cascadeFile.getContent().data)) {
                                editAssetObj.asset.file["data"] = Array.from((new Int8Array(cascadeFile.getContent().data)));
                            }
                            else {
                                editAssetObj.asset.file["text"] = cascadeFile.getContent().data;
                            }
                            if (cascadeFile.additionalData === Object(cascadeFile.additionalData)) {
                                Object.assign(editAssetObj.asset.file, cascadeFile.additionalData);
                            }
                        });
                    });
                }
            });
        };
    });
};
exports.init = init;
