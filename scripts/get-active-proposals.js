/*

get proposals submitted to nouns dao that are currently active

*/

import { SUBGRAPH_QUERY_URL } from '../config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client, cacheExchange, fetchExchange, gql } from '@urql/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
  url: SUBGRAPH_QUERY_URL,
  exchanges: [cacheExchange, fetchExchange],
})

const ActiveProposalsQuery = gql`
  query ActiveProposalsQuery {
    proposals(
      where: { status: ACTIVE }
      first: 1000
      orderBy: id
      orderDirection: desc
    ) {
      id
      title
      description
      proposer {
        id
      }
      status
      startBlock
      endBlock
      proposalThreshold
      quorumVotes
      createdTimestamp
      lastUpdatedTimestamp
      executionETA
      votes {
        id
        support
        votes
        blockTimestamp
        reason
        voter {
          id
        }
      }
    }
  }
`

const getProposals = async () => {
  const result = await client.query(ActiveProposalsQuery)
  return result
}

const main = async () => {
  const result = await getProposals()
  const { data, error } = result
  if (error || !data) throw new Error('query error: ', error)

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'active-proposals.json'),
    JSON.stringify(data, null, 2)
  )
  console.log('fetched active proposals: ', data.proposals.length)
}

main()
