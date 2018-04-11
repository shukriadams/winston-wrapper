let winston = require('winston'),
    fs = require('fs'),
    _instance,
    process = require('process'),
    path = require('path');


class Logger {
    constructor(logFolder){

        if (!logFolder)
            logFolder = path.join(process.cwd(), '__logs');

        if (!fs.existsSync(logFolder))
            fs.mkdirSync(logFolder);

        // apply rotation override for winston
        require('winston-daily-rotate-file');

        this.info = new (winston.Logger)({
            transports: [
                new (winston.transports.DailyRotateFile)({
                    filename: path.join(logFolder, '.log'),
                    datePattern: 'info.yyyy-MM-dd',
                    prepend: true,
                    level: 'info'
                })
            ]
        });

        this.error = new (winston.Logger)({
            transports: [
                new (winston.transports.DailyRotateFile)({
                    filename: path.join(logFolder, '.log'),
                    datePattern: 'error.yyyy-MM-dd',
                    prepend: true,
                    level: 'error'
                })]
        });

    }
}

module.exports = {
    
    // initializes logger with path to log to, call this once in app lifetime if needed
    initialize : function(logpath){
        _instance = new Logger(logpath);
    },

    // returns an instance of logger
    instance : function(){

        // if logger not initialized creates logger with default options
        if (!_instance) 
            _instance = new Logger();

        return _instance;
    },

    // allow injection of external logger, this is useful for testing
    set : function(newInstance){
        _instance = newInstance;
    }
};