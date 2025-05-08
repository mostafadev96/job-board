import { GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ApolloDriverConfig } from '@nestjs/apollo';
import GraphQLJSON from 'graphql-type-json';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  createGqlOptions(): Promise<ApolloDriverConfig> | ApolloDriverConfig {
    return {
      installSubscriptionHandlers: true,
      debug: true,
      playground: true,
      context: ({ req }) => ({ req }),
      // resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: join('../../', 'graphQL/schema.gql'),
      // definitions: {
      //   path: join(process.cwd(), 'graphQL/graphql.schema.ts'),
      //   outputAs: 'class',
      //   // customScalarTypeMapping: {
      //   //   DateTime: 'Date',
      //   // },
      // },
      
    };
  }
}