import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const main = async () => {
  const proposals = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'proposals.json'))
  )
  const proposalCandidates = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'proposal-candidates.json'))
  )
  const voteHistory = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'vote-history.json'))
  )

  // can fafo with the saved data here
  console.log('saved proposals: ', proposals.proposals.length)
  console.log(
    'saved proposal candidates: ',
    proposalCandidates.proposalCandidates.length
  )
  console.log('saved votes for noun: ', voteHistory.noun.votes.length)
}

main()
