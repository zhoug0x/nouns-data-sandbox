/*

get all proposals submitted to nouns dao

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

const ProposalsQuery = gql`
  query ProposalsQuery {
    proposals(first: 1000, orderBy: startBlock, orderDirection: desc) {
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
      votes {
        id
        support
        votes
      }
    }
  }
`

const getProposals = async () => {
  const result = await client.query(ProposalsQuery)
  return result
}

const main = async () => {
  const result = await getProposals()
  const { data } = result
  if (!data.proposals) throw new Error('no data returned from query')

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'proposals.json'),
    JSON.stringify(data, null, 2)
  )
  console.log('fetched props: ', data.proposals.length)
}

main()
