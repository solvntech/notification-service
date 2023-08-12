import { TConfig } from '@types';

export enum ENV_MODE {
    DEV = 'DEV',
    PRO = 'PRO',
}

export class Configuration {
    private static _config: TConfig;

    static init(): TConfig {
        if (!Configuration._config) {
            const envMode: string = process.env['NODE_ENV'] || ENV_MODE.DEV;
            const rabbitMQHost: string = process.env[`${envMode}_RABBITMQ_HOST`];
            const rabbitMQPort: string = process.env[`${envMode}_RABBITMQ_PORT`];
            const rabbitMQUser: string = process.env[`${envMode}_RABBITMQ_DEFAULT_USER`];
            const rabbitMQPass: string = process.env[`${envMode}_RABBITMQ_DEFAULT_PASS`];
            const rabbitMQUrl = `amqp://${rabbitMQUser}:${rabbitMQPass}@${rabbitMQHost}:${rabbitMQPort}`;
            Configuration._config = {
                env: envMode,
                port: parseInt(process.env[`${envMode}_API_PORT`], 10),
                mongo: {
                    host: process.env[`${envMode}_MONGO_HOST`],
                    port: parseInt(process.env[`${envMode}_MONGO_PORT`], 10),
                    username: process.env[`${envMode}_MONGO_USERNAME`],
                    password: process.env[`${envMode}_MONGO_PASSWORD`],
                    databaseName: process.env[`${envMode}_MONGO_BD_NAME`],
                },
                rabbitMQ: {
                    url: rabbitMQUrl,
                    queue: process.env[`${envMode}_RABBITMQ_QUEUE`],
                },
            };
        }
        return Configuration._config;
    }

    static get instance(): TConfig {
        return Configuration._config;
    }
}
