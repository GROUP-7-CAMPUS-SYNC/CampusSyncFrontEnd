import { Eye } from "lucide-react";

interface WitnessButtonProps {
  witnessCount: number;
  isWitnessed?: boolean;
  onToggle?: () => void;
}

export default function WitnessButton({
  witnessCount,
  isWitnessed = false,
  onToggle,
}: WitnessButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center group transition"
    >
      <Eye
        size={20}
        className={`transition ${
          isWitnessed ? "text-yellow-500" : "text-gray-500 group-hover:text-blue-500"
        }`}
      />
      <span
        className={`text-xs mt-1 font-semibold ${
          isWitnessed ? "text-yellow-600" : "text-gray-500"
        }`}
      >
        {witnessCount} Witness
      </span>
    </button>
  );
}