import * as winston from 'winston';

const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
});

if (process.env.NODE_ENV !== "unit-test") {
    if (process.env.log === "file") {
        Logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
        Logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
    } else {
        Logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }
} else {
    Logger.add(new winston.transports.Console({
        silent: true
    }));
}

export default Logger;