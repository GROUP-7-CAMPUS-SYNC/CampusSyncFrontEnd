import Button from "../../button"
import { useState } from "react"
import SuggestionGroupClickModal from "./suggestionGroupClickModal"
import { Users } from "lucide-react"

export default function suggestionGroup() {
    
    const [clickSuggestionGroup, setClickSuggestionGroup] = useState<boolean>(false)

    const handleClickSuggestionGroup = (e: React.FormEvent) => {
        e.preventDefault()

        setClickSuggestionGroup(true)
    }

    return (
    <form action="" onSubmit={handleClickSuggestionGroup}>
        <button
            type="button"
            className="block [@media(min-width:820px)]:hidden
            bg-[#3B82F6] px-3 py-[3px] w-fit text-white rounded-md
            hover:bg-[#2563EB] transition-colors
            duration-200 hover:cursor-pointer"
            onClick={() => setClickSuggestionGroup(true)}
        >
            <Users />
        </button>
        <Button
            type="button"
            buttonContainerDesign="hidden [@media(min-width:820px)]:block bg-[#3B82F6] px-[8px] py-[6px] text-white rounded-[6px]
            hover:bg-[#2563EB] transition-colors duration-200 hover:cursor-pointer whitespace-nowrap
            "
            buttonText="Suggest Group"
            onClick={() => setClickSuggestionGroup(true)}
        />
        {clickSuggestionGroup && (<SuggestionGroupClickModal onClose={() => setClickSuggestionGroup(false)}/>)}
    </form>
  )
}
