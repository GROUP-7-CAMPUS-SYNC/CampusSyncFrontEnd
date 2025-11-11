interface UserNameProps{
    userNameDesign?: string
    userName: string
}

export default function userName({
    userNameDesign,
    userName
} : UserNameProps) {
  return (
    <p 
        className={userNameDesign}
    >
        {userName}
    </p>
  )
}
