let winston = require('winston'),
    fs = require('fs'),
    _instance,
    process = require('process'),
    path = require('path')

class Logger {
    constructor(logFolder, level = 'error'){

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

            this.log = new (winston.Logger)({
                transports: [
                    new (winston.transports.DailyRotateFile)({
                        filename: path.join(logFolder, '.log'),
                        datePattern: 'yyyy-MM-dd',
                        prepend: true,
                        level
                    }),
                    new (winston.transports.Console)({
                        level
                    })
                ]
            })
    
        } else {
            console.log('WARNING : could not generate log files, logging calls sent to /dev/null')
            // writing not possible, expose shim of winston interface.
            this.log = {
                info : function(){},
                error : function(){},
                debug : function(){}
            }
    
        }

    }
}

module.exports = {
    
    // initializes logger with path to log to, call this once in app lifetime if needed
    initialize : function(logpath, level){
        _instance = new Logger(logpath, level)
    },
    
    // returns a new instance of logger per call
    new : function(logpath, level){
        return new Logger(logpath, level)
    },
    
    // returns an instance of logger
    instance : function(logpath, level){

        // if logger not initialized creates logger with default options
        if (!_instance) 
            _instance = new Logger(logpath, level)

        return _instance
    },

    // allow injection of external logger, this is useful for testing
    set : function(newInstance){
        _instance = newInstance
    }
}
