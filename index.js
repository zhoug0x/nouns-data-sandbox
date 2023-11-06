import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const main = async () => {
  const proposalHistory = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'proposals.json'))
  )
  const voteHistory = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'vote-history.json'))
  )

  // can fafo with the saved data here
  console.log('loaded props: ', proposalHistory.proposals.length)
  console.log('loaded vote history: ', voteHistory.noun.votes.length)
}

main()
