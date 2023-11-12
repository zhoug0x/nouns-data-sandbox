/*

get proposals submitted to nouns dao

*/

import { SUBGRAPH_QUERY_URL } from '../config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client, cacheExchange, fetchExchange, gql } from '@urql/core'

// ~~~ toggle this flag to get all existing props vs. active props only ~~~
const SHOULD_FETCH_ACTIVE_PROPS_ONLY = true

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
  url: SUBGRAPH_QUERY_URL,
  exchanges: [cacheExchange, fetchExchange],
})

const AllProposalsQuery = gql`
  query AllProposalsQuery {
    proposals(first: 1000, orderBy: id, orderDirection: desc) {
      id
      proposer {
        id
      }
      startBlock
      endBlock
      proposalThreshold
      quorumVotes
      description
      status
      executionETA
      createdTimestamp
      lastUpdatedTimestamp
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

const ActiveProposalsQuery = gql`
  query ActiveProposalsQuery {
    proposals(
      where: { status: ACTIVE }
      first: 1000
      orderBy: id
      orderDirection: desc
    ) {
      id
      proposer {
        id
      }
      startBlock
      endBlock
      proposalThreshold
      quorumVotes
      description
      status
      executionETA
      createdTimestamp
      lastUpdatedTimestamp
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
  const result = await client.query(
    SHOULD_FETCH_ACTIVE_PROPS_ONLY ? ActiveProposalsQuery : AllProposalsQuery
  )
  return result
}

const main = async () => {
  const result = await getProposals()
  const { data, error } = result
  if (error || !data) throw new Error('query error: ', error)

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'proposals.json'),
    JSON.stringify(data, null, 2)
  )
  console.log('fetched proposals: ', data.proposals.length)
}

main()
