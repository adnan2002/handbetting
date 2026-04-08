import type {ScoreEntry} from '../../types/game'
import Button from '../../components/Button'
import LeaderBoard from './LeaderBoard'
import { useNavigate } from 'react-router'

const MockLeaderBoardEntries: ScoreEntry[] = [
    {
        username: 'John Doe',
        score: 100,
        durationMs: 1000,
        date: '2021-01-01'
    },
    {
        username: 'Jane Doe',
        score: 90,
        durationMs: 2000,
        date: '2021-01-02'
    },
    {
        username: 'Jim Doe',
        score: 80,
        durationMs: 3000,
        date: '2021-01-03'
    },
    {
        username: 'Jill Doe',
        score: 70,
        durationMs: 4000,
        date: '2021-01-04'
    },
    {
        username: 'Jack Doe',
        score: 60,
        durationMs: 5000,
        date: '2021-01-05'
    },
]


const LandingPage = () => {
    const navigate = useNavigate()
    const handleNewGame = () => {
        navigate('/signin')
    }




  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Hand Betting
      </h1>
      <p className="text-balance text-base leading-relaxed text-text-secondary">
        Bet higher or lower on Mahjong hands. Start a new session whenever you are ready.
      </p>
      <div>
        <Button type="button" onClick={handleNewGame}>
          New Game
        </Button>
      </div>
      <LeaderBoard entries={MockLeaderBoardEntries} />
    </div>
  )
}

export default LandingPage
