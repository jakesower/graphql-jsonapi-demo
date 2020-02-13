const { polygraphql } = require('@polygraph/graphql-adapter');
const { JsonApiStore } = require('@polygraph/jsonapi-store');
const { expandSchema } = require('@polygraph/schema-utils');
const { readFileSync } = require('fs');
const axios = require('axios');

const schema = expandSchema(JSON.parse(readFileSync('./schema.json')));

const axiosInstance = axios.create({
  baseURL: 'http://localhost:20195',
  validateStatus: () => true,
});

const store = JsonApiStore(schema, axiosInstance);

const query = `
query {
  players {
    name
    squads {
      country {
        name
      }
    }
  }
}
`;

const respP = polygraphql(schema, store, query);

respP.then(console.log).catch(console.log);
