import useGameStore from '../../store/useGameStore'

const Game = () => {
    const { user } = useGameStore()

    
    return (
        <div>
            <h1>{user?.username}</h1>
        </div>
       
    )
}

export default Game
