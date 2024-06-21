import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { GqlApiModule } from './graphql/gql-api.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLError } from 'graphql';
import { OriginalError } from './types/OriginalError';

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
          entities: cfg.entities,
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrationsTableName: 'migrations_typeorm',
          migrations: cfg.migrations,
          logging: true,
        }) as TypeOrmModuleOptions;
      },
      inject: [dbConfig.KEY],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error: GraphQLError) => {
        const originalError = error.extensions?.originalError as OriginalError;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError?.message,
          code: error.extensions?.code,
        };
      },
    }),
    AuthModule,
    DatabaseModule,
    RedisModule,
    GqlApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
