/**
 * Defines the properties for the FullScreenOverlay component.
 *
 * @interface FullScreenOverlayProps
 * @property {string} [fullScreenOverlayDesign] - Optional custom TailwindCSS class string to modify the overlay's visual style or positioning.
 * @property {React.ReactNode} children - The content to be rendered inside the full-screen overlay.
 */
export interface FullScreenOverlayProps {
  fullScreenOverlayDesign?: string;
  children: React.ReactNode;
}
