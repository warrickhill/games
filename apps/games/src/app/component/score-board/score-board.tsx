import "./score-board.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../main"
import { Games, Players, scoresActions } from "../../store/scores.slice"

/* eslint-disable-next-line */
export interface ScoreBoardProps {}

export function ScoreBoard(props: ScoreBoardProps) {
    const scores = useSelector((state: RootState) => state.scores)
    const dispatch = useDispatch()

    console.log(scores)
    const reset = () => {
        dispatch(scoresActions.reset())
    }
    const rows = [
        [Games.XsAndOs, "Xs and Os"],
        [Games.Connect4, "Connect 4"],
    ].map(([k, name]) => {
        if (scores[k] === undefined) {
            return null
        }
        return (
            <tr>
                <td>{name}</td>
                <td>{scores[k][Players.Player1] || 0}</td>
                <td>{scores[k][Players.Ai] || 0}</td>
            </tr>
        )
    })
    return (
        <div>
            <div>
                <button onClick={reset}>RESET</button>
                <table>
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Player 1</th>
                            <th>AI</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    )
}

export default ScoreBoard
