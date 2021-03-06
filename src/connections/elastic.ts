import { Client } from '@elastic/elasticsearch'
import { elasticLog as log } from './loggers'

require('dotenv').config()

const esUrl = process.env.ES_NODE_URL

let greeted = false
if (!greeted) {
  greeted = true
  log.info(`Connecting to Elasticsearch at ${esUrl}`)
}

export const elasticIndexer = new Client({
  node: esUrl,
  auth: {
    username: process.env.ES_OFFCHAIN_USER,
    password: process.env.ES_OFFCHAIN_PASSWORD
  }
})

export const elasticReader = new Client({
  node: esUrl,
  auth: {
    username: process.env.ES_READONLY_USER,
    password: process.env.ES_READONLY_PASSWORD
  }
})
