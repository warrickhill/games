import { render } from "@testing-library/react"

import XsAndOs from "./xs-and-os"

describe("XsAndOs", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<XsAndOs />)
        expect(baseElement).toBeTruthy()
    })
})
