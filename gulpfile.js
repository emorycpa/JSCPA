/**
 * Node modules
 */
var mkdirp = require('mkdirp');
var gulp = require('gulp');
var clean = require('gulp-clean');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var foreach = require('gulp-foreach');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var dir = require('node-dir');
var prompt = require('gulp-prompt');
var gulpSequence = require('gulp-sequence');
var fs = require('fs');
var print = require('gulp-print');
var ProgressBar = require('progress');
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
        .pipe(concatCss('style.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(dest + '/' + resourceSrc + '/css'));
});

// Concatenate & Minify JS -> Compare if changed -> Move to Dist Folder
gulp.task('local:scripts', ['local:sass'], function() {
    return gulp.src(baseSrc + '/' + resourceSrc + '/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(rename({ suffix: '.min' }))
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
    return gulp.src('./app/index.js').pipe(prompt.prompt([{
        type: 'input',
        name: 'username',
        message: 'Please input your cascade user name'
    }, {
        type: 'password',
        name: 'password',
        message: 'Please input your cascade password'
    }], function(res) {
        cascadeLog.user = res.username;
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

                                if (deleteResult.code == 'true' || !("message" in deleteResult)) {

                                    process.writeProcess(sitedata.sitename, deleteResult.localCollection, initAPI[type], type, dest).then(function(writeRes) {

                                    }).catch(function(rej) { cascadeLog.log('error', rej.message); });
                                } else {}
                            })
                            .catch(function(rej) { cascadeLog.log('error', rej.message); });
                    }
                });
            });
        });
    }))
});


gulp.task('default', ['cascade'], function() {});