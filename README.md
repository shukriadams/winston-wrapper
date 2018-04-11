# Winston Wrapper

My own wrapper for the Winston logging system. Returns an instance
of the logger which can be used to write either an error or info log. Logs are automatically rotated every 24 hours.

Use

    var logger = require('winson-wrapper').instance();
    logger.error.error('some error');

    logger.info.info('some info');



