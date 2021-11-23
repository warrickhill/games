import { render } from "@testing-library/react"

import ScoreBoard from "./score-board"

describe("ScoreBoard", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ScoreBoard />)
        expect(baseElement).toBeTruthy()
    })
})
