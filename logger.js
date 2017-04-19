/**
 * LOGGER *
 * - This will log using the debug log with extra writing on file capability
 */

const
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    stackTrace = require('stack-trace'),
    debug = require('debug'),
    errorLog = debug('app:error'),
    debugLog = debug('app:log'),
    infoLog = debug('app:info'),
    debugFileName = '../debug.log',
    logFile = fs.createWriteStream(path.join(__dirname, debugFileName), { flags: 'a','encoding':null,'mode':'0666' }),
    logStdout = process.stdout;


const getStackTrace = function () {
    let args, file, frame, line, method, objVal, dateNow , timeStr;
    args = arguments.length > 2 ? [].slice.call(arguments, 0) : [];
    frame = stackTrace.get()[2];
    file = path.basename(frame.getFileName());
    line = frame.getLineNumber();
    method = frame.getFunctionName(); 
    dateNow = new Date();
    timeStr  = [dateNow.getHours(), dateNow.getMinutes() ,dateNow.getSeconds() ,  dateNow.getMilliseconds()].join(":") + "ms";
    objVal = (arguments[0][1]) ?  " : object= " + JSON.stringify(arguments[0][1]) : "";
    args.unshift(timeStr + " :: [" + file + ":" + line +"] : " + arguments[0][0] + objVal);
    return args;
}

const writeLogFile = function () {
    logFile.write(util.format.apply('%s', arguments) + '\n');
    logStdout.write(util.format.apply('%s', arguments) + '\n');
}


const info = function () {
    arguments[0] = JSON.stringify(arguments[0])
    infoLog.apply(this,getStackTrace(arguments));
}

const log = function () {
    arguments[0] = JSON.stringify(arguments[0])
    debugLog.apply(this,getStackTrace(arguments));
}

const error = function () {
    arguments[0] = JSON.stringify(arguments[0])
    errorLog.apply(this,getStackTrace(arguments));
}

// set debug logs to write log file
debugLog.log = console.log.bind(console); debugLog.log = writeLogFile;
infoLog.log = console.info.bind(console); infoLog.log = writeLogFile;
errorLog.log = console.error.bind(console); errorLog.log = writeLogFile;


module.exports = {
    log: log,
    error: error,
    info: info
}