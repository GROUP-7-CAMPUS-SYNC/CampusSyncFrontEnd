import type { FullScreenOverlayProps } from "../types/fullScreenOverlay"

/**
 * A reusable full-screen overlay component that covers the entire viewport.
 * Commonly used for modals, dialogs, or backdrops.
 */
export default function FullScreenOverlay({
  fullScreenOverlayDesign = "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]",
  children,
}: FullScreenOverlayProps) {
  return (
    <div className={fullScreenOverlayDesign}>
      {children}
    </div>
  )
}
