const fs = require('fs');
const dir = require('node-dir');
const Promise = require("bluebird");
const winston = require('winston');
const ProgressBar = require('progress');
const colors = require('colors/safe');

/*Local Variable */
const site = require('./data/sitedata.js');
const cascadeLog = require('./log/logger.js');
const cascadeObject = require('./data/object.js');
const dirFiles = Promise.promisify(dir.files);
const readFile = Promise.promisify(fs.readFile);
const remotecontent = site.contenttype();
const sitedata = site.sitedata();
const dest = sitedata.dest;
const remotetype = site.remotetype();

//Helper Function
function onlyUnique(value, index, self) {
    return self.indexOf(value.path) === index;
}
let alreadyWritten = [];


exports.deleteProcess = function(initAPI, localFolder) {
    return new Promise(function(resolve, reject) {
        deleteRemote(initAPI, localFolder).then(function(deleteRes) {
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



const deleteRemote = (initAPI, localFolder) =>
    new Promise(function(resolve, reject) {
        //Get local file list for current path. Generate a array of cascadeObjects
        let localCollection = [];
        dirFiles(localFolder.path).then((subLocalFiles) => {
            subLocalFiles.forEach(function(subLocalFilePath) {
                var subLocalFile = new cascadeObject.cascadeBase(subLocalFilePath, true, false);
                localCollection.push(subLocalFile);
            });
            //console.log(initAPI);
            readRemote(initAPI, localFolder, localCollection).then(function(remoteItem) {
                /*
                if (remoteItem.onlyRemote && remoteItem.onlyRemote.length > 0) {
                    deleteCascade(remoteItem.onlyRemote, cascadeTypeAPI, dest).then(function(newResult) {
                        newResult.localCollection = localCollection;
                        resolve(newResult);
                    });
                } else {
                    remoteItem.result.localCollection = localCollection;
                    resolve(remoteItem.result);
                }
                */
            });
        });
    }).catch(e => {
        cascadeLog.log('error', 'Error in deleting process: ' + e);
        reject(e);
    }); //End of dir.promiseFiles

/**
 * Return an array of remote-only cascade object(type can be file, scriptFormat, xsltFormat...)
 * @param {cascadeAPI} initAPI 
 * @param {cascadeFolder Object} localFolder 
 * @param {Empty Arrary} localCollection 
 */
const readRemote = (initAPI, localFolder, localCollection) => new Promise(function(resolve, reject) {
    let remoteCollection = [];
    //console.log(localCollection);
    if (localCollection.length > 0) {
        initAPI.folder.read(new cascadeObject.cascadeBase(localFolder.getRemotePath(dest)))
            .then(function(res) {
                let resolveItem = {};
                if (res.data.success.toString().trim() == 'true') {
                    res.data.asset.folder.children.forEach(function(remoteItem) {
                        if (remoteItem['recycled'] == false) {
                            //cascadeLog.log('debug', remoteItem['type']);
                            switch (remoteItem['type']) {
                                case 'folder':
                                    break;
                                case 'file':
                                    var remoteFile = new cascadeObject.cascadeFile(remoteItem.path.path, false, true);
                                    remoteFile.setId(remoteItem.id);
                                    remoteFile.setSiteId(remoteItem.path.siteId);
                                    remoteCollection.push(remoteFile);
                                    break;
                                case 'scriptFormat':
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    const onlyRemote = remoteCollection.map(function(r) { r.path = dest + '/' + r.path; return r; })
                        .filter(function(r) {
                            return JSON.stringify(localCollection).indexOf(JSON.stringify(new cascadeObject.cascadeBase(r.path, true, false))) < 0;
                        });
                    if (onlyRemote.length == 0) {
                        var result = { 'code': 'true', 'message': 'No remote file needed to be deleted in ' + localFolder.getRemotePath(dest), 'localCollection': localCollection };
                    } else {
                        onlyRemote.map(function(o) {
                            o.path = o.getRemotePath(dest);
                            o.status.local = false;
                            o.status.remote = true;
                        });
                        //Method for moving onlyRemote to temporary folder
                        console.log(onlyRemote);


                        const result = { 'code': 'true', 'message': JSON.stringify(onlyRemote) + ' have been removed to temporary deletion folder', 'localCollection': localCollection };
                        cascadeLog.log('info', result.message);
                        resolveItem.onlyRemote = onlyRemote;
                        resolveItem.result = result;
                    }
                    resolve(resolveItem);
                } else {
                    result = { 'code': 'false', 'message': res.data.message, 'localCollection': localCollection };
                    cascadeLog.log('error', result.message);
                    resolveItem.result = resolveItem;
                }
                resolve(resolveItem);
            }).catch(e => cascadeLog.log('error', 'Error in reading remote files in' + localFolder.getRemotePath(dest) + ' process: ' + e));
    } else {
        var result = { 'code': 'true', 'message': 'No remote file needed to be deleted in ' + localFolder.getRemotePath(dest), 'localCollection': localCollection };
        resolve(resolveItem);
    }

});


const deleteCascade = (onlyRemote, cascadeTypeAPI, dest) => new Promise(function(resolve, reject) {
    let deleteCascadeResponse;
    onlyRemote.forEach(function(remoteItem) {
        remoteItem = remoteItem.substring(dest.length);
        cascadeLog.log('info', 'Begin deleting ' + remoteItem + ' in cascade server');
        cascadeTypeAPI['delete'](sitedata.sitename, remoteItem)
            .then(function(data) {
                    deleteCascadeResponse = { 'code': data.data.success.toString().trim(), 'message': 'Successfully delete ' + remoteItem };
                    if (deleteCascadeResponse.code == 'false') {
                        deleteCascadeResponse.message = 'Problem in deleting ' + remoteItem + ": " + data.data.message;
                        cascadeLog.log('error', deleteCascadeResponse.message);
                    }
                    resolve(deleteCascadeResponse);
                },
                function(error) {
                    deleteCascadeResponse = { 'code': 'false', 'message': 'Problem in deleting ' + remoteItem + ": " + error };
                    cascadeLog.log('error', deleteCascadeResponse.message);
                    resolve(deleteCascadeResponse);
                })
            .catch(e => cascadeLog.log('error', 'Error in deleting remote files process: ' + e));
    });
});


const writeRemote = (siteName, localCollection, cascadeTypeAPI, fileType, dest) => new Promise(function(resolve, reject) {
    localCollection.forEach(function(localItem) {
        //cascadeLog.log('debug', alreadyWritten);
        //not process repeating file
        let testBar = new ProgressBar(colors.blue('Writing ' + localItem + ' [:bar] :percent'), {
            complete: '+',
            incomplete: '!',
            //clear: true,
            total: 20
        });
        if (alreadyWritten.indexOf(localItem) < 0) {
            alreadyWritten.push(localItem);
            const extention = localItem.substring(localItem.lastIndexOf('.') + 1);
            //Buffer as file content
            if (remotecontent.buffer.indexOf(extention) >= 0) {
                testBar.tick();
                readFile(localItem).then(function(buffer) {
                        testBar.update(0.5);
                        localItem = localItem.substring(localItem.indexOf(dest) + dest.length);
                        cascadeTypeAPI['write'](sitedata.sitename, localItem, buffer).then(function(data) {
                            writeCascadeResponse = { 'code': data.data.success.toString().trim() };
                            if (writeCascadeResponse.code == 'false') {
                                testBar.terminate();
                                writeCascadeResponse.message = 'Problem in writing ' + localItem + ": " + data.data.message;
                                cascadeLog.log('error', writeCascadeResponse.message);
                                cascadeLog.log('alert', localItem + ' is too large that it cannot be uploaded through this tool. Please upload it MANUALLY to ' + sitedata.hostname + '/' + sitedata.sitename);
                            } else {
                                testBar.update(1);
                                writeCascadeResponse.message = 'Successfully write ' + localItem + ' to cascade server.';
                                cascadeLog.log('info', writeCascadeResponse.message);
                            }
                            resolve(writeCascadeResponse);
                        }).catch(e => cascadeLog.log('error', 'Problem in writing ' + localItem + ": " + e));
                    },
                    function(error) {
                        writeCascadeResponse = { 'code': 'false', 'message': localItem + ': ' + error };
                        resolve(writeCascadeResponse);
                    }).catch(e => cascadeLog.log('error', 'Error in writing remote files process: ' + e));
            } else {
                //String as file content
                testBar.tick();
                readFile(localItem, 'utf8').then(function(content) {
                        testBar.update(0.5);
                        localItem = localItem.substring(localItem.indexOf(dest) + dest.length);
                        cascadeTypeAPI['write'](sitedata.sitename, localItem, content).then(function(data) {
                            writeCascadeResponse = { 'code': data.data.success.toString().trim() };
                            if (writeCascadeResponse.code == 'false') {
                                testBar.terminate();
                                writeCascadeResponse.message = 'Problem in writing ' + localItem + ": " + data.data.message;
                                cascadeLog.log('error', writeCascadeResponse.message);
                                cascadeLog.log('alert', localItem + ' is too large that it cannot be uploaded through this tool. Please upload it MANUALLY to ' + sitedata.hostname + '/' + sitedata.sitename);
                            } else {
                                testBar.update(1);
                                writeCascadeResponse.message = 'Successfully write ' + localItem + ' to cascade server.';
                                cascadeLog.log('info', writeCascadeResponse.message);
                            }
                            resolve(writeCascadeResponse);
                        }).catch(e => {
                            cascadeLog.log('debug', e.toString());
                            cascadeLog.log('error', 'Problem in writing ' + localItem + ": " + e);
                            cascadeLog.log('alert', localItem + ' is too large that it cannot be uploaded through this tool. Please upload it MANUALLY to ' + sitedata.hostname + '/' + sitedata.sitename);
                        });
                    },
                    function(error) {
                        writeCascadeResponse = { 'code': 'false', 'message': localItem + ': ' + error };
                        resolve(writeCascadeResponse);
                    }).catch(e => cascadeLog.log('error', 'Error in writing remote files process: ' + e));
            }
        } else {
            writeCascadeResponse = { 'code': 'true', 'message': '---------------------------------------' };
            resolve(writeCascadeResponse);
        }
    });
});