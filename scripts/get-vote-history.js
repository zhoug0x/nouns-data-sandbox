/*

get vote history for a single noun token

*/

import { SUBGRAPH_QUERY_URL } from '../config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client, cacheExchange, fetchExchange, gql } from '@urql/core'

// ~~~ modify this variable w/ the noun token id to fetch the vote history for it ~~~
const NOUN_ID = 0

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
  url: SUBGRAPH_QUERY_URL,
  exchanges: [cacheExchange, fetchExchange],
})

const VoteHistoryQuery = gql`
  query {
    noun(id: ${NOUN_ID}) {
      id
      votes(first: 1000) {
        blockNumber
        proposal {
          id
        }
        support
        supportDetailed
        voter {
          id
        }
      }
    }
  }
`

const main = async () => {
  const result = await client.query(VoteHistoryQuery)
  const { data } = result
  if (!data.noun) throw new Error('no data returned from query')

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'vote-history.json'),
    JSON.stringify(data, null, 2)
  )
  console.log('fetched votes: ', data.noun.votes.length)
}

main()
