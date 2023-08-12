export type TConfig = {
    env: string;
    port: number;
    mongo: {
        port: number;
        host: string;
        username: string;
        password: string;
        databaseName: string;
    };
    rabbitMQ: {
        url: string;
        queue: string;
    };
};
