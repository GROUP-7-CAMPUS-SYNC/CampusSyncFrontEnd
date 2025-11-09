import type { CardContainerProps } from "../types/cardContainer"

export default function cardContainer({
    children,
    cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto"
}: CardContainerProps) {
  return (
    <div 
        className={cardContainerDesign}
    >
      {children}
    </div>
  )
}
