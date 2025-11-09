/**
 * Defines the props structure for the reusable Modal component.
 *
 * @param fullScreenOverlayDesign - Optional. Custom CSS classes for the full-screen backdrop.
 * @param cardContainerDesign - Optional. Custom CSS classes for the main modal card container.
 * @param children - The React content to be displayed inside the modal card.
 */
export interface ModalProps {
  fullScreenOverlayDesign?: string;
  cardContainerDesign?: string;
  children: React.ReactNode;
}
