/**
 * Node modules
 */
var mkdirp = require('mkdirp');
var gulp = require('gulp');
var clean = require('gulp-clean');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var foreach = require('gulp-foreach');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var dir = require('node-dir');
var prompt = require('gulp-prompt');
var gulpSequence = require('gulp-sequence');
var fs = require('fs');
//var colors = require('colors/safe');
//var Github = require('github-api');
var moment = require('moment');
var del = require('del');


/**
 * Fixed Constants
 */
var baseSrc = 'src';
var resourceSrc = '_includes';
var cmsSrc = '_cms';
var dest = 'dest';

/**
 * Local modules
 */
var site = require('./app/data/sitedata.js');
var init = require('./app/index.js');
var cascadeFolderAPI = require("./app/cascade/cascade.folder.js");
var cascadeFileAPI = require("./app/cascade/cascade.file.js");
var cascadeScriptFormatAPI = require("./app/cascade/cascade.scriptFormat.js");
var cascadeXSLTFormatAPI = require("./app/cascade/cascade.xsltFormat.js");
var process = require('./app/process.js');
var cascadeLog = require('./app/log/logger.js');
var sitedata = site.sitedata();
var foldertype = site.foldertype();


/**
 * Shared Variables
 */
var gitLogin = {};

/**
 * Local File Process
 */
gulp.task('local:reminder', () => {
    const question = {
        message: 'Have you update your changes with Github? If not, please type no and update it.',
        default: false
    };
    return gulp.src('./app/index.js')
        .pipe(prompt.confirm(question));
});


//Delete Existing dist folder, then re-create it
gulp.task('local:init', function() {
    mkdirp('./' + dest, function(err) {
        if (err) {
            cascadeLog.log('error', 'Error when creating destination folder: ' + err);
            return false;
        } else {
            return gulp.src(dest + '/**/*', { read: false })
                .pipe(clean());
        }
    });
});

// Concatenate & Minify JS -> Compare if changed -> Move to Dist Folder
gulp.task('local:scripts', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/' + resourceSrc + '/js/*.js')
            .pipe(concat('main.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            //.changed(dest + resourceSrc + 'javascript', { hasChanged: changed.compareContent }) Compare
            .pipe(gulp.dest(dest + '/' + resourceSrc + '/js'));
    }, 1000);
});

// Compress CSS Files to One File (include pattern lab css and project css)
gulp.task('local:css', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/' + resourceSrc + '/css/*.css')
            .pipe(concatCss('style.css'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(dest + '/' + resourceSrc + '/css'));
    }, 1000);
});

// Cache Images
gulp.task('local:images', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/' + resourceSrc + '/images/**/*')
            .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
            .pipe(gulp.dest(dest + '/' + resourceSrc + '/images'));
    }, 2000);
});

//Cache Fonts?
gulp.task('local:fonts', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/' + resourceSrc + '/fonts/**/*')
            .pipe(gulp.dest(dest + '/' + resourceSrc + '/fonts'));
    }, 2000);
});

//Documents
gulp.task('local:documents', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/' + resourceSrc + '/documents/**/*')
            .pipe(gulp.dest(dest + '/' + resourceSrc + '/documents'));
    }, 2000);
});

//Parse Templates to Velocity. Currently just test file uploading
gulp.task('local:vm', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/vm/**/*')
            .pipe(gulp.dest(dest + '/' + cmsSrc + '/vm'));
    }, 1000);
});

//Parse Templates to Data Definition XML
gulp.task('local:xslt', function() {
    setTimeout(function() {
        return gulp.src(baseSrc + '/xslt/**/*')
            .pipe(gulp.dest(dest + '/' + cmsSrc + '/xslt'));
    }, 1000);
});

/**
 * Cacade API 
 */
gulp.task('cascade', function() {
    return gulp.src('./app/index.js').pipe(prompt.prompt([{
        type: 'input',
        name: 'username',
        message: 'Please input your cascade user name'
    }, {
        type: 'password',
        name: 'password',
        message: 'Please input your cascade password'
    }], function(res) {
        cascadeLog.log('info', res.username + ' start updating files in ' + sitedata.sitename + '---------------');
        var initAPI = init.initAPI(sitedata.hostname, res.username, res.password);
        var APIList = {
            'file': cascadeFileAPI.init(initAPI),
            'folder': cascadeFolderAPI.init(initAPI),
            'scriptFormat': cascadeScriptFormatAPI.init(initAPI),
            'xsltFormat': cascadeXSLTFormatAPI.init(initAPI)
        };
        dir.paths(dest, function(err, paths) {
            paths.dirs.forEach(function(subdir) {
                var foldertypes = Object.keys(foldertype);
                foldertypes.forEach(function(type) {
                    var targetFolder = foldertype[type];
                    if (subdir.indexOf(targetFolder) >= 0) {
                        process.deleteProcess(sitedata.sitename, subdir, initAPI.folder, initAPI[type], type, dest)
                            .then(function(deleteResult) {
                                //cascadeLog.log('debug', deleteResult);
                                if (deleteResult.code == 'true' || !("message" in deleteResult)) {
                                    cascadeLog.log('info', deleteResult.message);
                                    process.writeProcess(sitedata.sitename, deleteResult.localCollection, initAPI[type], type, dest).then(function(writeRes) {
                                        if (writeRes.code == 'true' || !("message" in writeRes))
                                            cascadeLog.log('info', writeRes.message);
                                        else
                                            cascadeLog.log('warn', writeRes.message);
                                    }).catch(function(rej) { cascadeLog.log('error', rej.message) });
                                } else {
                                    //Edit this after bug is fixed in next version.  
                                    cascadeLog.log('warn', deleteResult.message);
                                }
                            })
                            .catch(function(rej) { cascadeLog.log('error', rej.message); });
                    }
                });
            });
        });
    }))
});

gulp.task('local-sequence', gulpSequence('local:reminder', 'local:init', 'local:scripts', 'local:fonts', 'local:vm', 'local:xslt', 'local:documents', 'local:css', 'local:images'));
gulp.task('cascade-sequence', gulpSequence('cascade'));

gulp.task('default', gulpSequence('local-sequence', 'cascade-sequence'));