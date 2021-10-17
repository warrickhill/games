import React from "react"
import { Link, Route, Switch } from "react-router-dom"
import XsAndOs from "./xs-and-os/xs-and-os"
import Connect4 from "./connect4/connect4"

/* eslint-disable-next-line */
export interface PageProps {}

export function Pages(props: PageProps) {
    return (
        <Switch>
            <Route path="/" exact>
                <div>
                    <div>
                        <Link to="/xs-and-os">Xs and Os</Link>
                    </div>
                    <div>
                        <Link to="/connect4">Connect 4</Link>
                    </div>
                </div>
            </Route>
            <Route path="/xs-and-os" exact>
                <XsAndOs />
            </Route>
            <Route path="/connect4" exact>
                <Connect4 />
            </Route>
        </Switch>
    )
}

export default Pages
