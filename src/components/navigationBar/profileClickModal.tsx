import ReuseableModal from "../../components/modal";
import { forwardRef } from "react";

// Use forwardRef to accept a ref from the parent
const ProfileClickModal = forwardRef<HTMLDivElement>((_props, ref) => {
    return (
        // Attach the ref to the root element of your modal
        // Assuming ReuseableModal passes the ref to its root div
        <div ref={ref}>
            <ReuseableModal>
                {/* Modal content goes here */}
                <div
                    className="flex flex-col justify-center items-center"
                >
                    <p>User click the profile</p>
                    <p className="text-red-500 font-bold">Refresh the page to close the modal!</p>
                </div>
            </ReuseableModal>
        </div>
    );
});

export default ProfileClickModal;