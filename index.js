let winston = require('winston'),
    fs = require('fs'),
    _instance,
    process = require('process'),
    path = require('path')

class Logger {
    constructor(logFolder){

        if (!logFolder)
            logFolder = path.join(process.cwd(), '__logs')

        let canWrite = true
        if (!fs.existsSync(logFolder)) {
            try {
                fs.mkdirSync(logFolder)
            } catch (ex){
                console.log(ex)
                canWrite = false
            }
        }

        // apply rotation override for winston
        require('winston-daily-rotate-file')

        if (canWrite){
            this.info = new (winston.Logger)({
                transports: [
                    new (winston.transports.DailyRotateFile)({
                        filename: path.join(logFolder, '.log'),
                        datePattern: 'info.yyyy-MM-dd',
                        prepend: true,
                        level: 'info'
                    }),
                    new (winston.transports.Console)()
                ]
            })
    
            this.error = new (winston.Logger)({
                transports: [
                    new (winston.transports.DailyRotateFile)({
                        filename: path.join(logFolder, '.log'),
                        datePattern: 'error.yyyy-MM-dd',
                        prepend: true,
                        level: 'error'
                    }),
                    new (winston.transports.Console)()
                ]
            })
    
        } else {
            // writing not possible, expose shim of winston interface.
            this.info = {
                info : function(){},
                error : function(){}
            }
    
            this.error = {
                info : function(){},
                error : function(){}
            }
        }

    }
}

module.exports = {
    
    // initializes logger with path to log to, call this once in app lifetime if needed
    initialize : function(logpath){
        _instance = new Logger(logpath)
    },
    
    // returns a new instance of logger per call
    new : function(logpath){
        return new Logger(logpath)
    },
    
    // returns an instance of logger
    instance : function(logpath){

        // if logger not initialized creates logger with default options
        if (!_instance) 
            _instance = new Logger(logpath)

        return _instance
    },

    // allow injection of external logger, this is useful for testing
    set : function(newInstance){
        _instance = newInstance
    }
}
