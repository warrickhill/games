import styles from "./connect4.module.scss"
import { useState } from "react"

/* eslint-disable-next-line */
export interface Connect4Props {}

enum Players {
    Red = "Red",
    Yellow = "Yellow",
}

const range = ["a", "b", "c", "d", "e", "f", "g"]

const initBoard = range.reduce((b: any, c: string) => {
    b[c] = []
    return b
}, {})

const initScores = { [Players.Red]: 0, [Players.Yellow]: 0 }

const isWinner = (cells: any, player: string) => {
    return (
        range.some((row) => {
            return range.every((col) => {
                return player === cells[row][col]
            })
        }) ||
        range.some((col) => {
            return range.every((row) => {
                return player === cells[row][col]
            })
        }) ||
        [
            ["a", "a"],
            ["b", "b"],
            ["c", "c"],
        ].every(([row, col]) => {
            return player === cells[row][col]
        }) ||
        [
            ["a", "c"],
            ["b", "b"],
            ["c", "a"],
        ].every(([row, col]) => {
            return player === cells[row][col]
        })
    )
}

const ai = (cells: any, player: string) => {
    const move = (c: any, turn: string, level = 1) => {
        let score = 0
        for (const row of range) {
            for (const col of range) {
                if (c[row][col] !== "") {
                    continue
                }
                const update = { ...c, [row]: { ...c[row], [col]: turn } }
                if (isWinner(update, turn)) {
                    if (turn !== player && level === 1) {
                        return -100000000
                    }
                    score += turn === player ? 1 : -2
                } else {
                    score += move(
                        update,
                        turn === Players.Red ? Players.Yellow : Players.Red,
                        level + 1
                    )
                }
            }
        }
        return score
    }
    let combo: string[] = []
    let best = -100000001
    for (const row of range) {
        for (const col of range) {
            if (cells[row][col] !== "") {
                continue
            }
            const update = { ...cells, [row]: { ...cells[row], [col]: player } }
            if (isWinner(update, player)) {
                return [row, col]
            }
            const score = move(
                update,
                player === Players.Red ? Players.Yellow : Players.Red
            )
            if (score > best) {
                best = score
                combo = [row, col]
            }
        }
    }
    return combo
}

const aiPlayer = Players.Yellow

export function Connect4(props: Connect4Props) {
    const [cells, setCells] = useState(initBoard)
    const [whoseGo, setWhoseGo] = useState(Players.Red)
    const [winner, setWinner] = useState(false)
    const [draw, setDraw] = useState(false)
    const [scores, setScores] = useState(initScores)

    // useEffect(() => {
    //     if (whoseGo === aiPlayer) {
    //         const [row, col] = ai(cells, aiPlayer)
    //         click(col)
    //     }
    // }, [whoseGo])

    const click = (col: string) => {
        console.log({ cells, col, initBoard })
        if (cells[col].length >= 6) {
            return
        }
        const update = {
            ...cells,
            [col]: [...cells[col], whoseGo],
        }

        // const w = isWinner(update, whoseGo)
        //
        // const d =
        //     !w &&
        //     !range.some((col) => {
        //         return update[col].length < 6
        //     })

        setCells(update)
        // if (w) {
        //     setWinner(true)
        //     setScores({ ...scores, [whoseGo]: scores[whoseGo] + 1 })
        //     setTimeout(() => {
        //         setCells(initBoard)
        //         setWhoseGo(
        //             whoseGo === Players.Red ? Players.Yellow : Players.Red
        //         )
        //         setWinner(false)
        //     }, 2000)
        // } else if (d) {
        //     setDraw(true)
        //     setTimeout(() => {
        //         setCells(initBoard)
        //         setWhoseGo(
        //             whoseGo === Players.Red ? Players.Yellow : Players.Red
        //         )
        //         setDraw(false)
        //     }, 2000)
        // } else {
        setWhoseGo(whoseGo === Players.Red ? Players.Yellow : Players.Red)
        // }
    }

    const reset = () => {
        setCells(initBoard)
        setScores(initScores)
        setWhoseGo(Players.Red)
        setWinner(false)
        setDraw(false)
    }

    return (
        <div className={styles.content}>
            <div className={styles.board}>
                {range.map((col) => (
                    <div
                        key={col}
                        className={styles.col}
                        onClick={() => click(col)}
                    >
                        {cells[col].map((p: string, i: number) => (
                            <div
                                key={i}
                                className={`${styles.cell} ${styles[p]}`}
                            >
                                <span />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                {winner && <h1>Winner!!!!</h1>}
                {draw && <h1>Draw!!!!</h1>}
                {!winner && !draw && <h2>{whoseGo}'s go</h2>}
                <button onClick={reset}>RESET</button>
                <table>
                    <thead>
                        <th>
                            <td>{Players.Red}</td>
                            <td>{Players.Yellow}</td>
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{scores[Players.Red]}</td>
                            <td>{scores[Players.Yellow]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Connect4
