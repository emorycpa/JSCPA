var Promise = require("bluebird");

var init = function(cascadeClient) {

    var requiredMethods = ["readPromise", "createPromise", "editPromise", "deletePromise"]

    requiredMethods.forEach(function(method) {
        if (!cascadeClient[method]) {
            throw "Missing method " + method + " in REST client.";
        }
    });

    cascadeClient.registerMethod("scriptFormat", "read", function(client) {
        return function(siteName, path) {
            return client.readPromise({
                "identifier": {
                    "type": "format_SCRIPT",
                    "path": {
                        "siteName": siteName,
                        "path": path
                    }
                }
            });
        }
    });

    cascadeClient.registerMethod("scriptFormat", "delete", function(client) {
        return function(siteName, path) {
            return client.deletePromise({
                "identifier": {
                    "type": "format_SCRIPT",
                    "path": {
                        "siteName": siteName,
                        "path": path
                    }
                }
            });
        };
    });

    cascadeClient.registerMethod("scriptFormat", "write", function(client) {
        return function(siteName, path, dataToWrite, additionalData) {
            var pathPartsArray = path.split("/");
            var fileName = pathPartsArray.pop();
            return client.readPromise({
                "identifier": {
                    "type": "format_SCRIPT",
                    "path": {
                        "siteName": siteName,
                        "path": path
                    }
                }
            }).then(function(requestReturn) {
                if (requestReturn.data.success) {
                    var editAssetObj = {
                        "asset": {
                            "scriptFormat": {
                                "parentFolderId": requestReturn.data.asset.file.parentFolderId,
                                "id": requestReturn.data.asset.file.id,
                                "siteId": requestReturn.data.asset.file.siteId
                            }
                        }
                    };

                    if (Buffer.isBuffer(dataToWrite)) {
                        editAssetObj.asset.scriptFormat["script"] = Array.from((new Int8Array(dataToWrite)));
                    } else {
                        editAssetObj.asset.scriptFormat["script"] = dataToWrite;
                    }

                    if (additionalData === Object(additionalData)) {
                        Object.assign(editAssetObj.asset.scriptFormat, additionalData);
                    }
                    return client.editPromise(editAssetObj);
                } else {
                    var pathsStrings = [];

                    while (pathPartsArray.length > 0) {
                        if (pathPartsArray.length == 1) {
                            pathsStrings.unshift("/");
                        } else {
                            pathsStrings.unshift(pathPartsArray.join("/"));
                        }
                        pathPartsArray.pop();
                    }

                    return Promise.mapSeries(pathsStrings, function(folderPath) {
                        var currentFolderPath = (' ' + folderPath).slice(1);
                        return client.readPromise({
                            "identifier": {
                                "type": "folder",
                                "path": {
                                    "siteName": siteName,
                                    "path": folderPath
                                }
                            }
                        }).then(function(folderReadRequestReturn) {
                            if (folderReadRequestReturn.data.success) {
                                return folderReadRequestReturn;
                            } else {
                                var parentFolderPath = '';
                                var pathcurrentFolderPathParts = currentFolderPath.split('/');
                                var createFolderName = pathcurrentFolderPathParts.pop();
                                parentFolderPath += pathcurrentFolderPathParts.join('/');
                                return client.readPromise({
                                    "identifier": {
                                        "type": "folder",
                                        "path": {
                                            "siteName": siteName,
                                            "path": parentFolderPath
                                        }
                                    }
                                }).then(function(folderReadCreateRequestReturn) {
                                    return client.createPromise({
                                        "asset": {
                                            "folder": {
                                                "siteId": folderReadCreateRequestReturn.data.asset.folder.siteId,
                                                "name": createFolderName,
                                                "parentFolderId": folderReadCreateRequestReturn.data.asset.folder.id
                                            }
                                        }
                                    })
                                });
                            }
                        });
                    }).then(function(data) {
                        var folderPath = pathsStrings.pop();
                        return client.readPromise({
                            "identifier": {
                                "type": "folder",
                                "path": {
                                    "siteName": siteName,
                                    "path": folderPath
                                }
                            }
                        }).then(function(partentFolderRequestReturn) {

                            var createAssetObj = {
                                "asset": {
                                    "scriptFormat": {
                                        "parentFolderId": partentFolderRequestReturn.data.asset.folder.id,
                                        "siteId": partentFolderRequestReturn.data.asset.folder.siteId,
                                        "name": fileName
                                    }
                                }
                            };

                            if (additionalData === Object(additionalData)) {
                                Object.assign(createAssetObj.asset.scriptFormat, additionalData);
                            }

                            if (Buffer.isBuffer(dataToWrite)) {
                                createAssetObj.asset.scriptFormat["script"] = Array.from((new Int8Array(dataToWrite)));
                            } else {
                                createAssetObj.asset.scriptFormat["script"] = dataToWrite;
                            }
                            return client.createPromise(createAssetObj);
                        })
                    });
                }
            });
        }
    });
};

exports.init = init;