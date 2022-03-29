import React from "react"
import { Link, Route, Switch } from "react-router-dom"
import XsAndOs from "./xs-and-os/xs-and-os"
import Connect4 from "./connect4/connect4"
import styles from "./pages.module.scss"
import ScoreBoard from "../component/score-board/score-board"
import BattleShips from "./battle-ships/battle-ships"

/* eslint-disable-next-line */
export interface PageProps {}

export function Pages(props: PageProps) {
    return (
        <div className={styles.content}>
            <Switch>
                <Route path="/" exact>
                    <div>
                        <div>
                            <Link to="/xs-and-os">Xs and Os</Link>
                        </div>
                        <div>
                            <Link to="/connect4">Connect 4</Link>
                        </div>
                        <div>
                            <Link to="/battle-ships">Battle Ships</Link>
                        </div>
                    </div>
                </Route>
                <Route path="/xs-and-os" exact>
                    <XsAndOs />
                </Route>
                <Route path="/connect4" exact>
                    <Connect4 />
                </Route>
                <Route path="/battle-ships" exact>
                    <BattleShips />
                </Route>
            </Switch>
            <div className={styles.scores}>
                <ScoreBoard />
            </div>
        </div>
    )
}

export default Pages
