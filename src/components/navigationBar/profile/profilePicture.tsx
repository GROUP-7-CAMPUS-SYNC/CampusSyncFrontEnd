interface ProfileProps {
  profileImageURL: string;
  profileDesign?: string;
  imageDesign?: string;
  onClick: () => void;
}

export default function profile({
  profileImageURL,
  profileDesign = "flex items-center rounded-full",
  imageDesign = "lg:h-[4vh] w-[30px] h-[30px] cursor-pointer transition-all duration-200 ",
  onClick,
}: ProfileProps) {
  return (
    <div className={profileDesign}>
      <button onClick={onClick}>
        <img src={profileImageURL} className={imageDesign} alt="Profile" />
      </button>
    </div>
  );
}
