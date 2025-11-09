interface LogoHoverMessageProps {
  containerDesign?: string
  messageDesign?: string
  message: string
}

export default function LogoHoverMessage({
  containerDesign = `
    absolute left-1/2 -translate-x-1/2 top-full mt-7
    invisible opacity-0 group-hover:visible group-hover:opacity-100
    transition-opacity duration-200
    bg-black/80 px-3 py-1 rounded-md text-white text-md whitespace-nowrap
  `,
  messageDesign,
  message,
}: LogoHoverMessageProps) {
  return (
    <div
      className={containerDesign}
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <p className={messageDesign}>{message}</p>
    </div>
  )
}
