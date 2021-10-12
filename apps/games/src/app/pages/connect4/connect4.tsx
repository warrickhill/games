import styles from "./connect4.module.scss"
import { useEffect, useState } from "react"

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
    let counter = 0
    console.log("Finding winner")
    for (let x = 0; x < 7; x++) {
        const col = range[x]
        counter = 0
        if (cells[col].length >= 4) {
            for (const cell of cells[col]) {
                if (cell === player) {
                    counter++
                } else {
                    counter = 0
                }
                if (counter >= 4) {
                    return true
                }
            }
        }
        for (let y = 0; y < cells[col].length; y++) {
            let c = x
            counter = 0
            while (
                cells[range[c]] !== undefined &&
                cells[range[c]][y] === player
            ) {
                counter++
                c++
                if (counter >= 4) {
                    return true
                }
            }
        }

        for (let y = 0; y < cells[col].length; y++) {
            let c = x
            let p = y
            counter = 0
            while (
                cells[range[c]] !== undefined &&
                cells[range[c]][p] === player
            ) {
                counter++
                c++
                if (y <= 2) {
                    p++
                } else {
                    p--
                }
                if (counter >= 4) {
                    return true
                }
            }
        }
    }

    return false
}

const ai = (cells: any, player: string) => {
    const range = ["d", "c", "e", "b", "f", "a", "g"]
    const move = (c: any, turn: string, level = 1) => {
        let score = 0
        if (level > 2) {
            return score
        }
        for (const col of range) {
            if (c[col].length >= 6) {
                continue
            }
            const update = {
                ...c,
                [col]: [...c[col], turn],
            }
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
        return score
    }
    let combo = ""
    let best = -100000001
    for (const col of range) {
        if (cells[col].length >= 6) {
            continue
        }
        const update = {
            ...cells,
            [col]: [...cells[col], player],
        }
        if (isWinner(update, player)) {
            return col
        }
        const score = move(
            update,
            player === Players.Red ? Players.Yellow : Players.Red
        )
        if (score > best) {
            best = score
            combo = col
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

    useEffect(() => {
        if (whoseGo === aiPlayer) {
            const col = ai(cells, aiPlayer)
            click(col)
        }
    }, [whoseGo])

    const click = (col: string) => {
        console.log({ cells, col, initBoard })
        if (cells[col].length >= 6) {
            return
        }
        const update = {
            ...cells,
            [col]: [...cells[col], whoseGo],
        }

        const w = isWinner(update, whoseGo)

        const d =
            !w &&
            !range.some((col) => {
                return update[col].length < 6
            })

        setCells(update)
        if (w) {
            setWinner(true)
            setScores({ ...scores, [whoseGo]: scores[whoseGo] + 1 })
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(
                    whoseGo === Players.Red ? Players.Yellow : Players.Red
                )
                setWinner(false)
            }, 2000)
        } else if (d) {
            setDraw(true)
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(
                    whoseGo === Players.Red ? Players.Yellow : Players.Red
                )
                setDraw(false)
            }, 2000)
        } else {
            setWhoseGo(whoseGo === Players.Red ? Players.Yellow : Players.Red)
        }
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
