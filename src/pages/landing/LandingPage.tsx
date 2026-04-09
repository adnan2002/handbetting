import Button from '../../components/Button'
import { getTopScores } from '../../hooks/userLocalStorage'
import LeaderBoard from './LeaderBoard'
import { useNavigate } from 'react-router'


const LandingPage = () => {
    const navigate = useNavigate()
    const leaderBoardEntries = getTopScores(5)

    const handleNewGame = () => {
        navigate('/signin')
    }




  return (
    <section className="flex flex-1 items-center py-6">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-10">
        <div className="flex min-h-[28rem] flex-col justify-center rounded-3xl border border-border bg-bg-secondary px-6 py-10 shadow-sm sm:px-10">
          <span className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-accent">
            Mahjong risk run
          </span>
          <h1 className="max-w-xl font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Hand Betting
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Bet higher or lower on each Mahjong hand and push your score as far as you can.
            Start a new session and climb the leaderboard.
          </p>
          <div className="mt-8">
            <Button type="button" onClick={handleNewGame}>
              New Game
            </Button>
          </div>
        </div>
        <div className="flex min-h-[28rem]">
          <div className="w-full rounded-3xl border border-border bg-bg-secondary p-6 shadow-sm sm:p-8">
            <LeaderBoard entries={leaderBoardEntries} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
