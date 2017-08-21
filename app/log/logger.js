const winston = require('winston');
const moment = require('moment');
const colors = require('colors/safe');

/**
 * Log Setting
 */

const customFormatter = function(user, msg) {
    const now = moment().utcOffset(-5).format('YYYY-MM-DD h:mm:ss'); //est timezone
    if (msg == '') {
        return '';
    } else {
        return '[' + now + ' ' + user + ']' + ' - ' + msg;
    }
}

//Remove extra dates in log file
const fileFormatter = function(options) {
    return (options.message ? options.message : '');
}

const cascadeLogger = new winston.Logger({
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

module.exports = {
    user: '',
    log: function(option, msg) {
        cascadeLogger.log(option, customFormatter(this.user, msg));
    }
}