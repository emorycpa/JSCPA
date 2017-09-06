/**
 * Node modules
 */
const mkdirp = require('mkdirp');
const gulp = require('gulp');
const clean = require('gulp-clean');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const uglify = require('gulp-uglify');
const foreach = require('gulp-foreach');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const dir = require('node-dir');
const prompt = require('gulp-prompt');
const gulpSequence = require('gulp-sequence');
const fs = require('fs');
const print = require('gulp-print');
const ProgressBar = require('progress');
const moment = require('moment');
const del = require('del');
const ts = require('gulp-typescript');




/**
 * Local modules
 */

const cascadeFolderAPI = require("./app/target/cascade/cascade.folder.js");
const cascadeFileAPI = require("./app/target/cascade/cascade.file.js");
const cascadeScriptFormatAPI = require("./app/target/cascade/cascade.scriptFormat.js");
const cascadeXSLTFormatAPI = require("./app/target/cascade/cascade.xsltFormat.js");
const process = require('./app/process.js');
const cascadeLog = require('./app/log/logger.js');
/*
const sitedata = site.sitedata();
const dest = sitedata.dest;
const cmsSrc = sitedata.cmsSrc;
const baseSrc = sitedata.baseSrc;
const resourceSrc = sitedata.resourceSrc;
const foldertype = site.foldertype();
*/

/**
 * Local File Process
 */

//Typescript File Parse
gulp.task('local:typescript', () => {
    var tsProject = ts.createProject('app/parse/tsconfig.json');
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('app/target'));
});

//Reminder for starting process
gulp.task('local:reminder', () => {
    const question = {
        message: 'Have you update your changes with Github? If not, please type no and update it.',
        default: false
    };
    return gulp.src('./app/data/sitedata.js')
        .pipe(prompt.confirm(question));
});


//Delete Existing dist folder, then re-create it
gulp.task('local:init', ['local:reminder'], function() {
    mkdirp('./' + dest, function(err) {
        if (err) {
            cascadeLog.log('error', 'Error when creating destination folder: ' + err + '. Program is stop now.');
            return false;
        } else {
            return gulp.src(dest, { read: false })
                .pipe(clean({ force: true }));
        }
    });
});


//Parse Templates to Data Definition XML
gulp.task('local:xslt', ['local:init'], function() {
    return gulp.src(baseSrc + '/xslt/**/*')
        .pipe(gulp.dest(dest + '/' + cmsSrc + '/xslt'));
});

//Parse Templates to Velocity. Currently just test file uploading
gulp.task('local:vm', ['local:xslt'], function() {
    return gulp.src(baseSrc + '/vm/**/*')
        .pipe(gulp.dest(dest + '/' + cmsSrc + '/vm'));
});

//PHPs
gulp.task('local:phps', ['local:xslt'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/php/**/*')
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/php'));
});

//Compile SASS file to CSS File
gulp.task('local:sass', ['local:phps'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/css'));
});

// Concatenate & Minify JS -> Compare if changed -> Move to Dist Folder
gulp.task('local:scripts', ['local:sass'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/js/**/*.js')
        //.pipe(concat('main.js'))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/js'));
});

// Cache Images
gulp.task('local:images', ['local:scripts'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/images'));
});

//Cache Fonts?
gulp.task('local:fonts', ['local:images'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/fonts/**/*')
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/fonts'));
});

//Documents
gulp.task('local:documents', ['local:fonts'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/documents/**/*')
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/documents'));
});

/**
 * Cacade API 
 */
gulp.task('cascade', ['local:documents'], function() {
    return gulp.src('./app/data/sitedata.js').pipe(prompt.prompt([{
        type: 'input',
        name: 'username',
        message: 'Please input your cascade user name'
    }, {
        type: 'password',
        name: 'password',
        message: 'Please input your cascade password'
    }], function(res) {
        const assets = require('./app/target/data/asset.js');
        const site = require('./app/target/data/sitedata.js');

        //Create Authentication Object
        const auth = new assets.Authentication(res.password, res.username);
        console.log(auth);
        cascadeLog.log('info', auth.username + ' start updating files in ' + sitedata.sitedata.basicConfig.sitename + '---------------');





        const initAPI = cascadeObject.initAPI(sitedata.hostname, res.username, res.password);
        dir.paths(dest, function(err, paths) {
            paths.dirs.forEach(function(subdir) {
                const foldertypes = Object.keys(foldertype);
                cascadeFolderAPI.init(initAPI); //for read action in process.js
                foldertypes.forEach(function(type) {
                    var cascadeBase = new cascadeObject.cascadeBase(subdir, true, false);
                    if (subdir.indexOf(foldertype[type]) >= 0) {
                        switch (type) {
                            case 'folder':

                                break;
                            case 'file':
                                cascadeFileAPI.init(initAPI);
                                const localFolder = new cascadeObject.cascadeFolder(subdir, 'true', 'false');
                                process.deleteProcess(initAPI, localFolder)
                                    .then(function(deleteResult) {
                                        /*
                                        if (deleteResult.code == 'true' || !("message" in deleteResult)) {
                                            process.writeProcess(sitedata.sitename, deleteResult.localCollection, initAPI[type], type, dest).then(function(writeRes) {}).catch(function(rej) { cascadeLog.log('error', rej.message); });
                                        } else {}
                                        */
                                    })
                                    .catch(function(rej) { cascadeLog.log('error', rej.message); });
                                break;
                            case 'scriptFormat':
                                cascadeScriptFormatAPI.init(initAPI);
                                break;
                            case 'xsltFormat':
                                cascadeXSLTFormatAPI.init(initAPI);
                                break;
                            default:
                                cascadeLog.log('alert', 'Please assign correct file type. Exit now');
                        }
                        /*
                        process.deleteProcess(sitedata.sitename, subdir, initAPI.folder, initAPI[type], type, dest)
                            .then(function(deleteResult) {
                                if (deleteResult.code == 'true' || !("message" in deleteResult)) {
                                    process.writeProcess(sitedata.sitename, deleteResult.localCollection, initAPI[type], type, dest).then(function(writeRes) {}).catch(function(rej) { cascadeLog.log('error', rej.message); });
                                } else {}
                            })
                            .catch(function(rej) { cascadeLog.log('error', rej.message); });
                            */
                    }
                });
            });
        });
    }))
});


gulp.task('default', ['cascade'], function() {});