import styles from "./connect4.module.scss"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Games, Players, scoresActions } from "../../store/scores.slice"

/* eslint-disable-next-line */
export interface Connect4Props {}

const Tokens: any = {
    [Players.Player1]: "Red",
    [Players.Ai]: "Yellow",
}

const range = ["a", "b", "c", "d", "e", "f", "g"]

const initBoard = range.reduce((b: any, c: string) => {
    b[c] = []
    return b
}, {})

const isWinner = (cells: any, player: Players) => {
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

const ai = (cells: any, player: Players) => {
    const range = ["d", "c", "e", "b", "f", "a", "g"]
    const move = (c: any, turn: Players, level = 1) => {
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
                    turn === Players.Player1 ? Players.Ai : Players.Player1,
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
            player === Players.Player1 ? Players.Ai : Players.Player1
        )
        if (score > best) {
            best = score
            combo = col
        }
    }
    return combo
}

const aiPlayer = Players.Ai

export function Connect4(props: Connect4Props) {
    const [cells, setCells] = useState(initBoard)
    const [whoseGo, setWhoseGo] = useState(Players.Player1)
    const dispatch = useDispatch()

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
            dispatch(
                scoresActions.incr({ player: whoseGo, game: Games.Connect4 })
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

    const reset = () => {
        setCells(initBoard)
        setWhoseGo(Players.Player1)
    }
    console.log(cells)
    return (
        <div className={styles.content}>
            <div className={styles.board}>
                {range.map((col) => (
                    <div
                        key={col}
                        className={styles.col}
                        onClick={() => click(col)}
                    >
                        {cells[col].map((p: Players, i: number) => (
                            <div
                                key={i}
                                className={`${styles.cell} ${
                                    styles[`player-${p}`]
                                }`}
                            >
                                <span />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Connect4
