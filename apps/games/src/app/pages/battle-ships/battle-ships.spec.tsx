import { render } from "@testing-library/react"

import BattleShips from "./battle-ships"

describe("BattleShips", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<BattleShips />)
        expect(baseElement).toBeTruthy()
    })
})
