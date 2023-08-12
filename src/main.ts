import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from '@config/configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { rawBody: true });
    dayjs.extend(duration);

    const config = Configuration.instance;

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

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

    // validate input before jump into controller
    app.useGlobalPipes(new ValidationPipe());

    await app.startAllMicroservices();
    await app.listen(config.port);
}
bootstrap().then(() => {
    Logger.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
