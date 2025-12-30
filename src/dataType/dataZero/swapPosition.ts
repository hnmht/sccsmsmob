import { SwapPosition } from "../types/swapPosition";

export function getEmptySwapPosition():SwapPosition {
    const sp :SwapPosition = {
        buttonPosition: "right",
        orderVisible: true,
        swapPosition: { left: -16 },
        hiddenPosition: { right: -16 },
        orderPosition: { right: 8 }
    }
    return sp;
}