import React from "react"
import { Route, Switch } from "react-router-dom"
import XsAndOs from "./xs-and-os/xs-and-os"

/* eslint-disable-next-line */
export interface PageProps {}

export function Pages(props: PageProps) {
    return (
        <Switch>
            <Route path="/" exact>
                <div>Make dashboard page to go here</div>
            </Route>
            <Route path="/xs-and-os" exact>
                <XsAndOs />
            </Route>
        </Switch>
    )
}

export default Pages
