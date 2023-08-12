import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from '@config/configuration';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = Configuration.instance;

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [config.rabbitMQ.url],
            queue: config.rabbitMQ.queue,
            queueOptions: {
                durable: false,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(config.port);
}
bootstrap().then(() => {
    Logger.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
