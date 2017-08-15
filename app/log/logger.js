var winston = require('winston');
var moment = require('moment');
var colors = require('colors/safe');

/**
 * Log Setting
 */
var logLevels = {
    levels: {
        info: 0,
        success: 1,
        warning: 2,
        error: 3,
        debug: 4
    },
    colors: {
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        debug: 'black'
    }
}

var customFormatter = function(user, msg) {
        var now = moment().utcOffset(-5).format('YYYY-MM-DD h:mm:ss'); //est timezone
        if (msg == '') {
            return '';
        } else {
            return '[' + now + ' ' + user + ']' + ' - ' + msg;
        }
    }
    //Remove extra dates in file
var fileFormatter = function(options) {
    return (options.message ? options.message : '');
}

//winston.setLevels(logLevels.levels);
//winston.addColors()
var cascadeLogger = new winston.Logger({
    transports: [
        new(winston.transports.File)({
            level: 'info',
            filename: './logfile.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            formatter: function(options) {
                return fileFormatter(options);
            },
            json: false
        }),
        new(winston.transports.Console)({
            level: 'debug',
            colorize: true,
            handleExceptions: true,
            json: false
        })
    ]
});
//console.log(cascadeLogger);

module.exports = {
    user: '',
    log: function(option, msg) {
        cascadeLogger.log(option, customFormatter(this.user, msg));
    }
}