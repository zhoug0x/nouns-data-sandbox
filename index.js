import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const parseProposals = proposals => {
  proposals
    .sort((x, y) => parseInt(y.id) - parseInt(x.id))
    .forEach(proposal => {
      const out = `#${proposal.id}: ${proposal.title}`

      console.log(out)
    })
}

const loadData = filename => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename)))
}

const main = () => {
  const proposals = loadData('proposals.json')
  const activeProposals = loadData('active-proposals.json')
  const proposalCandidates = loadData('proposal-candidates.json')
  const voteHistory = loadData('vote-history.json')

  console.log('total proposals: ', proposals.proposals.length)
  console.log('total proposal candidates: ', activeProposals.proposals.length)
  console.log(
    'total proposal candidates: ',
    proposalCandidates.proposalCandidates.length
  )
  console.log('total votes for noun: ', voteHistory.noun.votes.length)

  parseProposals(proposals.proposals)
}

main()
