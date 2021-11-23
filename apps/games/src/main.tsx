import { StrictMode } from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

import App from "./app/app"

import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

import {
    SCORES_FEATURE_KEY,
    scoresReducer,
    ScoresState,
} from "./app/store/scores.slice"

const preloadedStateJson = localStorage.getItem("reduxState")
const preloadedState =
    preloadedStateJson !== null ? JSON.parse(preloadedStateJson) : {}

export type RootState = { [SCORES_FEATURE_KEY]: ScoresState }

const store = configureStore({
    reducer: { [SCORES_FEATURE_KEY]: scoresReducer },
    // Additional middleware can be passed to this array
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== "production",
    // Optional Redux store enhancers
    enhancers: [],
    preloadedState,
})

store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()))
})

ReactDOM.render(
    <Provider store={store}>
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>
    </Provider>,
    document.getElementById("root")
)
