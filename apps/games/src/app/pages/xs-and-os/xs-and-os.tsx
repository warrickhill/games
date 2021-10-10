import styles from "./xs-and-os.module.scss"
import { useEffect, useState } from "react"

/* eslint-disable-next-line */
export interface XsAndOsProps {}

enum Players {
    X = "X",
    O = "O",
}

const initBoard: any = {
    a: { a: "", b: "", c: "" },
    b: { a: "", b: "", c: "" },
    c: { a: "", b: "", c: "" },
}
const initScores = { [Players.X]: 0, [Players.O]: 0 }

const range = ["a", "b", "c"]

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
                        turn === Players.X ? Players.O : Players.X,
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
                player === Players.X ? Players.O : Players.X
            )
            if (score > best) {
                best = score
                combo = [row, col]
            }
        }
    }
    return combo
}

const aiPlayer = Players.O

export function XsAndOs(props: XsAndOsProps) {
    const [cells, setCells] = useState(initBoard)
    const [whoseGo, setWhoseGo] = useState(Players.X)
    const [winner, setWinner] = useState(false)
    const [draw, setDraw] = useState(false)
    const [scores, setScores] = useState(initScores)

    useEffect(() => {
        if (whoseGo === aiPlayer) {
            const [row, col] = ai(cells, aiPlayer)
            click(row, col)
        }
    }, [whoseGo])

    const click = (row: string, col: string) => {
        if (cells[row][col] !== "") {
            return
        }
        const update = {
            ...cells,
            [row]: {
                ...cells[row],
                [col]: whoseGo,
            },
        }

        const w = isWinner(update, whoseGo)

        const d =
            !w &&
            !range.some((row) => {
                return range.some((col) => {
                    return "" === update[row][col]
                })
            })

        setCells(update)
        if (w) {
            setWinner(true)
            setScores({ ...scores, [whoseGo]: scores[whoseGo] + 1 })
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(whoseGo === Players.X ? Players.O : Players.X)
                setWinner(false)
            }, 2000)
        } else if (d) {
            setDraw(true)
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(whoseGo === Players.X ? Players.O : Players.X)
                setDraw(false)
            }, 2000)
        } else {
            setWhoseGo(whoseGo === Players.X ? Players.O : Players.X)
        }
    }

    const reset = () => {
        setCells(initBoard)
        setScores(initScores)
        setWhoseGo(Players.X)
        setWinner(false)
        setDraw(false)
    }

    return (
        <div className={styles.content}>
            <div>
                {range.map((row) => (
                    <div key={row} className={styles.row}>
                        {range.map((col) => (
                            <div
                                key={col}
                                className={styles.cell}
                                onClick={() => click(row, col)}
                            >
                                <span>{cells[row][col]}</span>
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
                            <td>X</td>
                            <td>O</td>
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{scores[Players.X]}</td>
                            <td>{scores[Players.O]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default XsAndOs
