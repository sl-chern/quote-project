import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { GqlApiModule } from './graphql/gql-api.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      useFactory: async (cfg: ConfigType<typeof dbConfig>) => {
        const options = Boolean(cfg.url)
          ? {
              type: cfg.type,
              url: cfg.url,
            }
          : {
              type: cfg.type,
              host: cfg.host,
              port: cfg.port,
              database: cfg.database,
              username: cfg.username,
              password: cfg.password,
            };

        return Object.assign(options, {
          entities: ['dist/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrationsTableName: 'migrations_typeorm',
          migrations: ['dist/database/migrations/**{.ts,.js}'],
          logging: true,
        }) as any;
      },
      inject: [dbConfig.KEY],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
    }),
    DatabaseModule,
    RedisModule,
    GqlApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
