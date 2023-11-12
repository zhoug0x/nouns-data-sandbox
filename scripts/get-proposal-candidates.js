/*

get proposal candidates submitted to nouns dao

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

const AllProposalCandidates = gql`
  query AllProposalCandidates {
    proposalCandidates(first: 1000, orderBy: lastUpdatedTimestamp, orderDirection: desc) {
      id
      slug
      proposer
      createdTimestamp
      lastUpdatedTimestamp
      canceled
      canceledTimestamp
      latestVersion {
        content {
          title
          values
          targets
          description
          contentSignatures(orderBy: createdTimestamp, orderDirection: desc) {
            id
            reason
            signer {
              id
            }
            createdTimestamp
            canceled
          }
        }
      }
    }
  }
`

const main = async () => {
  const result = await client.query(AllProposalCandidates)
  const { data, error } = result
  if (error || !data) throw new Error('query error: ', error)

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'proposal-candidates.json'),
    JSON.stringify(data, null, 2)
  )
  console.log('fetched proposal candidates: ', data.proposalCandidates.length)
}

main()
