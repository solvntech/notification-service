import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabase } from '@database/mongo.database';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MongoDatabase,
        }),
    ],
})
export class DatabaseModule {}
