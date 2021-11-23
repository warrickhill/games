import styles from "./xs-and-os.module.scss"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Games, Players, scoresActions } from "../../store/scores.slice"

/* eslint-disable-next-line */
export interface XsAndOsProps {}

const Tokens: any = {
    [Players.Player1]: "X",
    [Players.Ai]: "O",
}

const initBoard: any = {
    a: { a: "", b: "", c: "" },
    b: { a: "", b: "", c: "" },
    c: { a: "", b: "", c: "" },
}

const range = ["a", "b", "c"]

const isWinner = (cells: any, player: Players) => {
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

const ai = (cells: any, player: Players) => {
    const move = (c: any, turn: Players, level = 1) => {
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
                        turn === Players.Player1 ? Players.Ai : Players.Player1,
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
                player === Players.Player1 ? Players.Ai : Players.Player1
            )
            if (score > best) {
                best = score
                combo = [row, col]
            }
        }
    }
    return combo
}

export function XsAndOs(props: XsAndOsProps) {
    const [cells, setCells] = useState(initBoard)
    const [whoseGo, setWhoseGo] = useState(Players.Player1)
    const dispatch = useDispatch()

    useEffect(() => {
        if (whoseGo === Players.Ai) {
            const [row, col] = ai(cells, Players.Ai)
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
            dispatch(
                scoresActions.incr({ player: whoseGo, game: Games.XsAndOs })
            )
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(
                    whoseGo === Players.Player1 ? Players.Ai : Players.Player1
                )
            }, 2000)
        } else if (d) {
            setTimeout(() => {
                setCells(initBoard)
                setWhoseGo(
                    whoseGo === Players.Player1 ? Players.Ai : Players.Player1
                )
            }, 2000)
        } else {
            setWhoseGo(
                whoseGo === Players.Player1 ? Players.Ai : Players.Player1
            )
        }
    }

    return (
        <div className={styles.content}>
            <div className={styles.board}>
                {range.map((row) => (
                    <div key={row} className={styles.row}>
                        {range.map((col) => (
                            <div
                                key={col}
                                className={styles.cell}
                                onClick={() => click(row, col)}
                            >
                                <span className={styles[cells[row][col]]}>
                                    {Tokens[cells[row][col]] || ``}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default XsAndOs
