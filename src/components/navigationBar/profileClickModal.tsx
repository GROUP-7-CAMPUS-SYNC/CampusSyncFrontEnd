import ReuseableModal from "../../components/modal"

export default function profileClickModal() {

  return (
    <ReuseableModal>
      {/* Modal content goes here */}
      <div
        className="flex flex-col justify-center items-center"
      >
        <p>User click the profile</p>
        <p className="text-red-500 font-bold">Refresh the page to close the modal!</p>
      </div>
    </ReuseableModal>
  )
}
