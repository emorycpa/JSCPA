var Promise = require("bluebird");
var sitedata = require("../data/sitedata.js");
var siteName = sitedata.sitedata().sitename;
var init = function (cascadeClient) {
    var requiredMethods = ["readPromise", "createPromise", "editPromise", "deletePromise"];
    requiredMethods.forEach(function (method) {
        if (!cascadeClient[method]) {
            throw "Missing method " + method + " in REST client.";
        }
    });
    cascadeClient.registerMethod("folder", "read", function (client) {
        return function (cascadeFolder) {
            return client.readPromise({
                "identifier": {
                    "type": "folder",
                    "path": {
                        "siteName": cascadeFolder.sitename,
                        "path": cascadeFolder.path
                    }
                }
            });
        };
    });
    cascadeClient.registerMethod("folder", "delete", function (client) {
        return function (cascadeFolder) {
            return client.deletePromise({
                "identifier": {
                    "type": "folder",
                    "path": {
                        "siteName": cascadeFolder.sitename,
                        "path": cascadeFolder.path
                    }
                }
            });
        };
    });
    cascadeClient.registerMethod("folder", "write", function (client) {
        return function (cascadeFolder) {
            var pathPartsArray = path.split("/");
            var folderName = pathPartsArray.pop();
            return client.readPromise({
                "identifier": {
                    "type": "folder",
                    "path": {
                        "siteName": cascadeFolder.sitename,
                        "path": cascadeFolder.path
                    }
                }
            }).then(function (requestReturn) {
                if (requestReturn.data.success) {
                    var editAssetObj = {
                        "asset": {
                            "folder": {
                                "parentFolderId": requestReturn.data.asset.folder.parentFolderId,
                                "id": requestReturn.data.asset.folder.id,
                                "siteId": requestReturn.data.asset.folder.siteId
                            }
                        }
                    };
                    if (cascadeFolder.additionalData === Object(cascadeFolder.additionalData)) {
                        Object.assign(editAssetObj.asset.folder, cascadeFolder.additionalData);
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
                                    "siteName": cascadeFolder.sitename,
                                    "path": folderPath
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
                                            "siteName": cascadeFolder.sitename,
                                            "path": parentFolderPath
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
                                    "siteName": cascadeFolder.sitename,
                                    "path": folderPath
                                }
                            }
                        }).then(function (partentFolderRequestReturn) {
                            var createAssetObj = {
                                "asset": {
                                    "folder": {
                                        "parentFolderId": partentFolderRequestReturn.data.asset.folder.id,
                                        "siteId": partentFolderRequestReturn.data.asset.folder.siteId,
                                        "name": folderName
                                    }
                                }
                            };
                            if (additionalData === Object(cascadeFolder.additionalData)) {
                                Object.assign(createAssetObj.asset.folder, cascadeFolder.additionalData);
                            }
                            return client.createPromise(createAssetObj);
                        });
                    });
                }
            });
        };
    });
};
exports.init = init;
