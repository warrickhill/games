import { render } from "@testing-library/react"

import Connect4 from "./connect4"

describe("Connect4", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<Connect4 />)
        expect(baseElement).toBeTruthy()
    })
})
