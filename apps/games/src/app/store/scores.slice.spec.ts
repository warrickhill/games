import { fetchScores, scoresAdapter, scoresReducer } from "./scores.slice"

describe("scores reducer", () => {
    it("should handle initial state", () => {
        const expected = scoresAdapter.getInitialState({
            loadingStatus: "not loaded",
            error: null,
        })

        expect(scoresReducer(undefined, { type: "" })).toEqual(expected)
    })

    it("should handle fetchScoress", () => {
        let state = scoresReducer(undefined, fetchScores.pending(null, null))

        expect(state).toEqual(
            expect.objectContaining({
                loadingStatus: "loading",
                error: null,
                entities: {},
            })
        )

        state = scoresReducer(
            state,
            fetchScores.fulfilled([{ id: 1 }], null, null)
        )

        expect(state).toEqual(
            expect.objectContaining({
                loadingStatus: "loaded",
                error: null,
                entities: { 1: { id: 1 } },
            })
        )

        state = scoresReducer(
            state,
            fetchScores.rejected(new Error("Uh oh"), null, null)
        )

        expect(state).toEqual(
            expect.objectContaining({
                loadingStatus: "error",
                error: "Uh oh",
                entities: { 1: { id: 1 } },
            })
        )
    })
})
