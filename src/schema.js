const elasticsearch = require('elasticsearch')
const { graphql, TypeComposer } = require('graphql-compose')
const { composeWithElastic, elasticApiFieldConfig } = require('graphql-compose-elasticsearch')
const { GraphQLSchema, GraphQLObjectType } = graphql
const { demoOrgMapping, demoUserMapping } = require('./mappings')

const UserEsTC = composeWithElastic({
  graphqlTypeName: 'UserES',
  elasticIndex: 'demo_user',
  elasticType: 'demo_user',
  elasticMapping: demoUserMapping,
  elasticClient: new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '6.0',
    log: 'trace',
  }),
  // elastic mapping does not contain information about is fields are arrays or not
  // so provide this information explicitly for obtaining correct types in GraphQL
  pluralFields: ['skills', 'languages'],
});

const OrgEsTC = composeWithElastic({
  graphqlTypeName: 'OrgES',
  elasticIndex: 'demo_org',
  elasticType: 'demo_org',
  elasticMapping: demoOrgMapping,
  elasticClient: new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '6.0',
    log: 'trace',
  }),
  pluralFields: ['location.point']
})

const ProxyTC = TypeComposer.create(`type ProxyDebugType { source: JSON }`);

ProxyTC.addResolver({
  name: 'showArgs',
  kind: 'query',
  args: {
    source: 'JSON',
  },
  type: 'ProxyDebugType',
  resolve: ({ args }) => args,
});

UserEsTC.addRelation('showRelationArguments', {
  resolver: () => ProxyTC.getResolver('showArgs'),
  prepareArgs: {
    source: source => source,
  },
  projection: {
    name: true,
    salary: true,
  }
});

OrgEsTC.addRelation('showRelationArguments', {
  resolver: () => ProxyTC.getResolver('showArgs'),
  prepareArgs: {
    source: source => source,
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      userSearch: UserEsTC.getResolver('search').getFieldConfig(),
      userSearchConnection: UserEsTC.getResolver('searchConnection').getFieldConfig(),
      orgSearch: OrgEsTC.getResolver('search').getFieldConfig(),
      orgSearchConnection: OrgEsTC.getResolver('searchConnection').getFieldConfig(),
      elastic60: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '6.0',
        log: 'trace',
      }),
    },
  }),
});

module.exports = schema;