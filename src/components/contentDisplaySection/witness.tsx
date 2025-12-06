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
      className="flex flex-row gap-x-2 justify-center items-center group transition"
    >
      <Eye
        className={`transition ${
          isWitnessed
            ? "text-yellow-500"
            : "text-gray-500 group-hover:text-blue-500"
        }`}
      />
      <span
        className={`text-sm  font-semibold ${
          isWitnessed ? "text-yellow-600" : "text-gray-500"
        }`}
      >
        {witnessCount} Witness
      </span>
    </button>
  );
}
