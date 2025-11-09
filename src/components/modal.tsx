import FullScreenOverlay from "./fullScreenOverlay"
import CardContainer from "./cardContainer"
import type { ModalProps } from "../types/modal"


export default function modal({
    fullScreenOverlayDesign,
    cardContainerDesign,
    children,
} : ModalProps) {
  return (
    <FullScreenOverlay
        fullScreenOverlayDesign={fullScreenOverlayDesign}
    >
        <CardContainer
            cardContainerDesign={cardContainerDesign}
        >
            {children}
        </CardContainer>
    </FullScreenOverlay>
  )
}
