import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const SCORES_FEATURE_KEY = "scores"

export enum Games {
    XsAndOs,
    Connect4,
}

export enum Players {
    Ai,
    Player1,
}

export type ScoresState = Record<string, Record<string, number>>

interface ScorePayload {
    game: Games
    player: Players
}

export const scoresSlice = createSlice({
    name: SCORES_FEATURE_KEY,
    initialState: {},
    reducers: {
        incr: (state: ScoresState, action: PayloadAction<ScorePayload>) => {
            if (state[action.payload.game] === undefined) {
                state[action.payload.game] = {}
            }
            if (
                state[action.payload.game][action.payload.player] === undefined
            ) {
                state[action.payload.game][action.payload.player] = 0
            }
            state[action.payload.game][action.payload.player]++
        },
        reset: () => ({}),
        // ...
    },
})

/*
 * Export reducer for store configuration.
 */
export const scoresReducer = scoresSlice.reducer

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(scoresActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const scoresActions = scoresSlice.actions
