const bunyan = require('bunyan')

/**
 * Bunyan Logs Level
 * 1 @TRACE Logging from external libraries used by your app or very detailed application logging.
 * 2 @DEBUG Anything else, i.e. too verbose to be included in “info” level.
 * 3 @INFO Detail on regular operation.
 * 4 @WARN A note on something that should probably be looked at by an operator eventually.
 * 5 @ERROR Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish)
 * 6 @FATAL The service/app is going to stop or become unusable now. An operator should definitely look into this soon
 */

const logger = bunyan.createLogger({
    name: 'HelpingHands',
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        }
    ]
})

module.exports = logger