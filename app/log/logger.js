var winston = require('winston');
var moment = require('moment');

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

var formatter = function(options) {
    var now = moment().utcOffset(-5).format('YYYY-MM-DD h:mm:ss'); //est timezone
    return '[' + now + ' ' + ']' + options.level.toUpperCase() + ' - ' + (options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
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
                return formatter(options);
            },
            json: false
        }),
        new(winston.transports.Console)({
            level: 'debug',
            colorize: true,
            handleExceptions: true,
            json: false
                /*,
                formatter: function(options) {
                    return formatter(options);
                }
                */
        })
    ]
});
//console.log(cascadeLogger);

module.exports = {
    log: function(option, msg) { cascadeLogger.log(option, msg) }
}