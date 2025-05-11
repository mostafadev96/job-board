import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { GraphqlOptions } from './graphql/graphql.options';
import { HiringCompanyModule } from './modules/hiring-company/hiring-company.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AppResolver } from './app.resolver';


@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlOptions,
    }),
    PrismaModule,
    UserModule,
    HiringCompanyModule,
    JobModule,
    AuthModule
  ],
  providers: [
    AppResolver
  ],
})
export class AppModule {}
