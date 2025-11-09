import Modal from "../../modal"
import Button from "../../button"
import { useEffect, useState } from "react"
import type { SuggestionGroup } from "../../../types/suggestionGroup.type"
import { Users } from "lucide-react"

interface SuggestionGroupClickModalProps {
  onClose: () => void
}

export default function SuggestionGroupClickModal({
  onClose
}: SuggestionGroupClickModalProps) {
  const [suggestionGroups, setSuggestionGroups] = useState<SuggestionGroup[]>([])

  useEffect(() => {
    fetch("/src/api/suggestGroup.json")
      .then((res) => res.json())
      .then((data) => setSuggestionGroups(data))
  }, [])

  return (
    <Modal
      cardContainerDesign="lg:w-[450px] md:w-[400px] sm:w-[350px] min-w-[300px] max-h-[70vh] bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto flex flex-col"
    >
      <h1 className="text-lg font-semibold mb-4">Suggestion Groups</h1>

      {/* Scrollable content area */}
      <div className="flex flex-col gap-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {suggestionGroups.map((groupDetails) => (
          <div
            key={groupDetails.id}
            className="flex lg:flex-row flex-col justify-between items-center border gap-y-2 p-4 rounded-md shadow-sm bg-white hover:bg-gray-100 transition"
          >
            <div className="flex justify-start w-full items-start flex-col">
              <h2 className="font-medium text-gray-900">{groupDetails.groupName}</h2>
              <div className="flex items-center text-sm text-gray-500 gap-x-1">
                <Users className="text-blue-500 w-5 h-5" />
                <span>{groupDetails.members} members</span>
              </div>
            </div>

            <Button
              buttonContainerDesign="lg:w-fit bg-[#3B82F6] w-full px-4 py-2 cursor-pointer text-white rounded-md hover:bg-[#2563EB] transition-colors"
              type="button"
              buttonText="Follow"
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        buttonText="Close"
        onClick={onClose}
        buttonContainerDesign="bg-white border-2 border-[#3B82F6] px-[15px] py-[5px] w-fit 
        text-[#3B82F6] rounded-[6px] hover:bg-[#E0ECFF] hover:border-[#2563EB] transition-colors 
        duration-200 hover:cursor-pointer mt-4"
      />
    </Modal>
  )
}
