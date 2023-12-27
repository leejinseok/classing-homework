import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

type LogLevel = 'info' | 'warn' | 'error';
const PROJECT_NAME = 'Classting School News Feed API';

const dailyOptions = (level: LogLevel) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: '../../logs',
    filename: `api-module.%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        utilities.format.nestLike(PROJECT_NAME, {
          prettyPrint: true,
        }),
      ),
    }),

    new winston.transports.File({
      filename: `logs/api-module.log`,
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(PROJECT_NAME, {
          prettyPrint: true,
        }),
      ),
    }),

    new winston.transports.File({
      filename: `logs/api-module-error.log`,
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(PROJECT_NAME, {
          prettyPrint: true,
        }),
      ),
    }),

    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
