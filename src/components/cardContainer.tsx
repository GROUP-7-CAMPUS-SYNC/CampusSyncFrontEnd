import type { CardContainerProps } from "../types/cardContainer";

export default function cardContainer({
  children,
  cardContainerDesign = "bg-white rounded-lg p-6 mx-auto",
}: CardContainerProps) {
  return <div className={cardContainerDesign}>{children}</div>;
}
