import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit"

export const SCORES_FEATURE_KEY = "scores"

/*
 * Update these interfaces according to your requirements.
 */
export interface ScoresEntity {
    id: number
}

export interface ScoresState extends EntityState<ScoresEntity> {
    loadingStatus: "not loaded" | "loading" | "loaded" | "error"
    error: string
}

export const scoresAdapter = createEntityAdapter<ScoresEntity>()

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
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
 *   dispatch(fetchScores())
 * }, [dispatch]);
 * ```
 */
export const fetchScores = createAsyncThunk(
    "scores/fetchStatus",
    async (_, thunkAPI) => {
        /**
         * Replace this with your custom fetch call.
         * For example, `return myApi.getScoress()`;
         * Right now we just return an empty array.
         */
        return Promise.resolve([])
    }
)

export const initialScoresState: ScoresState = scoresAdapter.getInitialState({
    loadingStatus: "not loaded",
    error: null,
})

export const scoresSlice = createSlice({
    name: SCORES_FEATURE_KEY,
    initialState: initialScoresState,
    reducers: {
        add: scoresAdapter.addOne,
        remove: scoresAdapter.removeOne,
        // ...
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScores.pending, (state: ScoresState) => {
                state.loadingStatus = "loading"
            })
            .addCase(
                fetchScores.fulfilled,
                (state: ScoresState, action: PayloadAction<ScoresEntity[]>) => {
                    scoresAdapter.setAll(state, action.payload)
                    state.loadingStatus = "loaded"
                }
            )
            .addCase(fetchScores.rejected, (state: ScoresState, action) => {
                state.loadingStatus = "error"
                state.error = action.error.message
            })
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

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllScores);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = scoresAdapter.getSelectors()

export const getScoresState = (rootState: unknown): ScoresState =>
    rootState[SCORES_FEATURE_KEY]

export const selectAllScores = createSelector(getScoresState, selectAll)

export const selectScoresEntities = createSelector(
    getScoresState,
    selectEntities
)
