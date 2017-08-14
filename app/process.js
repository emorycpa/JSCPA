var dir = require('node-dir');
var fs = require('fs');
var Promise = require("bluebird");
var winston = require('winston');

/*Local Variable */
var index = require('./index.js');
var site = require('./data/sitedata.js');
var cascadeLog = require('./log/logger.js');
//var colors = require('colors/safe');
var dirFiles = Promise.promisify(dir.files);
var readFile = Promise.promisify(fs.readFile);
var extention = site.extention();
var sitedata = site.sitedata();
var remotetype = site.remotetype();

//Helper Function
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


exports.deleteProcess = function(siteName, mainDir, cascadeFolderAPI, cascadeTypeAPI, fileType, dest) {
    return new Promise(function(resolve, reject) {
        deleteRemote(siteName, mainDir, cascadeFolderAPI, cascadeTypeAPI, fileType, dest).then(function(deleteRes) {
            resolve(deleteRes);
        });
    });

    //if (res.code == true) {
    //reject(new Error('Error in deleting remote files')); 

    //Important: on July 31 cascade has bug reading remote.vm, so temporary resolve all things
    //} else {
    //reject(new Error('Error in deleting remote files'));
    //}
};

exports.writeProcess = function(siteName, localCollection, cascadeTypeAPI, fileType, dest) {
    return new Promise(function(resolve, reject) {
        writeRemote(siteName, localCollection, cascadeTypeAPI, fileType, dest).then(function(writeRes) {
            if (writeRes.code == 'false') {
                reject(writeRes);
            } else
                resolve(writeRes);
        });
    });
}



var deleteRemote = (siteName, mainDir, cascadeFolderAPI, cascadeTypeAPI, fileType, dest) =>
    new Promise(function(resolve, reject) {
        var deleteResult;
        var remoteCollection = {};
        var localCollection = [];
        dirFiles(mainDir).then((subItems) => {
            subItems.forEach(function(sub) {
                localCollection.push(sub);
            });
            localCollection = localCollection.filter(onlyUnique);
            readRemote(cascadeFolderAPI, mainDir, remoteCollection, localCollection, dest, fileType).then(function(remoteItem) {
                if (remoteItem.onlyRemote && remoteItem.onlyRemote.length > 0) {
                    deleteCascade(remoteItem.onlyRemote, cascadeTypeAPI).then(function(newResult) {
                        //console.log('Finish remove remote ' + colors.blue(remoteItem.onlyRemote) + ' from Cascade Server. Result is: ' + newResult.message);
                        newResult.localCollection = localCollection;
                        resolve(newResult);
                    });
                } else {
                    remoteItem.result.localCollection = localCollection;
                    resolve(remoteItem.result);
                }
            });
        }).catch(e => {
            cascadeLog.log('error', 'Error in deleting process: ' + e);
            reject(e);
        }); //End of dir.promiseFiles
    });

var readRemote = (cascadeFolderAPI, mainDir, remoteCollection, localCollection, dest, fileType) => new Promise(function(resolve, reject) {
    cascadeFolderAPI.read(sitedata.sitename, mainDir.substring(dest.length))
        .then(function(res) {
            var resolveItem = {};
            if (res.data.success.toString().trim() == 'true') {
                res.data.asset.folder.children.forEach(function(remoteItem) {
                    if (remoteItem.type == remotetype[fileType] && remoteItem['recycled'] == false) {
                        var remotePath = remoteItem.path.path
                        if (!remoteCollection.hasOwnProperty(remotePath)) {
                            remoteCollection[remotePath] = remotePath;
                        }
                    }
                });
                var remoteFiles = Object.keys(remoteCollection);
                //cascadeLog.log('debug', 'remote: ' + remoteFiles);
                //cascadeLog.log('debug', 'local: ' + localCollection);
                var onlyRemote = remoteFiles.map(function(r) { return dest + '/' + r }).filter(x => localCollection.indexOf(x) < 0);
                //cascadeLog.log('debug', 'onlyRemote: ' + onlyRemote);
                if (onlyRemote.length == 0) {
                    result = { 'code': 'true', 'message': 'No remote file needed to be deleted in ' + mainDir, 'localCollection': localCollection };
                } else {
                    resolveItem.onlyRemote = onlyRemote;
                }
                resolveItem.result = result;
            } else {
                result = { 'code': 'false', 'message': res.data.message, 'localCollection': localCollection };
                resolveItem.result = resolveItem;
            }
            resolve(resolveItem);
        }).catch(e => cascadeLog.log('error', 'Error in reading remote files process: ' + e));
});

var deleteCascade = (onlyRemote, cascadeTypeAPI) => new Promise(function(resolve, reject) {
    var deleteCascadeResponse;
    onlyRemote.forEach(function(remoteItem) {
        cascadeLog.log('info', 'Begin deleting ' + remoteItem + ' in cascade server');
        cascadeTypeAPI['delete'](sitedata.sitename, remoteItem)
            .then(function(data) {
                    deleteCascadeResponse = { 'code': data.data.success.toString().trim(), 'message': 'Finish delete ' + remoteItem };
                    if (deleteCascadeResponse.code == 'false') {
                        deleteCascadeResponse.message = 'Problem in deleting ' + remoteItem + ": " + data.data.message;
                    }
                    resolve(deleteCascadeResponse);
                },
                function(error) {
                    deleteCascadeResponse = { 'code': 'false', 'message': 'Problem in deleting ' + remoteItem + ": " + error };
                    resolve(deleteCascadeResponse);
                })
            .catch(e => cascadeLog.log('error', 'Error in deleting remote files process: ' + e));
    });
});

var writeRemote = (siteName, localCollection, cascadeTypeAPI, fileType, dest) => new Promise(function(resolve, reject) {
    var writeCascadeResponse;
    localCollection.forEach(function(localItem) {
        readFile(localItem, 'utf8').then(function(content) {
                cascadeLog.log('info', 'Begin writing ' + localItem + ' in cascade server');
                localItem = localItem.substring(localItem.indexOf(dest) + dest.length);
                cascadeTypeAPI['write'](sitedata.sitename, localItem, content).then(function(data) {
                    writeCascadeResponse = { 'code': data.data.success.toString().trim(), 'message': 'Finish write ' + localItem + ' to cascade server.' };
                    if (writeCascadeResponse.code == 'false') {
                        writeCascadeResponse.message = 'Problem in writing ' + localItem + ": " + data.data.message;
                    }
                    resolve(writeCascadeResponse);
                }).catch(e => cascadeLog.log('error', 'Problem in writing ' + localItem + ": " + e));
            },
            function(error) {
                writeCascadeResponse = { 'code': 'false', 'message': localItem + ': ' + error };
                resolve(writeCascadeResponse);
            }).catch(e => cascadeLog.log('error', 'Error in writing remote files process: ' + e));
    });

});