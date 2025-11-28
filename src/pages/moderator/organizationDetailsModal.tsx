import { useState, useEffect } from 'react';
import { User, Edit2 } from 'lucide-react'; 
import type { IOrganization } from './index'; 
import ChangeHeadSelector from './changeHeadSelector';
import Footer from "./footer"
import ModeratorCard from './moderatorCard';
import CurrentHeadInformation from './currentHeadInformation';
import DescriptionSection from './descriptionSection'; // Import new component
import ModalHeader from "./ModalHeader"
import Modal from "../../components/modal"
import Button from '../../components/button';
import api from '../../api/api';

interface OrganizationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    organization: IOrganization;
}

interface Candidate {
    _id: string;
    firstname: string;
    lastname: string;
    course: string;
    email: string;
    profileLink: string;
    role: string;
}

const OrganizationDetailModal = ({ isOpen, onClose, organization }: OrganizationDetailModalProps) => {
    // --- STATE MANAGEMENT ---
    
    // Name Editing
    const [isEditingName, setIsEditingName] = useState(false);
    const [orgName, setOrgName] = useState(organization.organizationName);

    // Head Selection
    const [isEditingHead, setIsEditingHead] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [currentHead, setCurrentHead] = useState(organization.organizationHeadID);
    const [userChangeHeadCandidate, setUserChangeHeadCandidate] = useState<Candidate[]>([]);


    // Description Editing
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState(organization.description || "");

    // Moderator Delete Organization
    const [isDeleting, setIsDeleting] = useState(false);

    // Error Modal Message 
    const [errorMessage, setErrorMessage] = useState<String>("")
    const [handleButtonGotError, setHandleButtonGotError] = useState(false)

    // Success Modal Message 
    const [successMessage, setSuccessMessage] = useState<String>("")
    const [handleButtonGotSuccess, setHandleButtonGotSuccess] = useState(false)


    // Sync state with props when modal opens or organization changes
    useEffect(() => {
        if (isOpen) {
            setOrgName(organization.organizationName);
            setDescription(organization.description || "");
            setCurrentHead(organization.organizationHeadID);
            setIsEditingName(false);
            setIsEditingDesc(false);
            setIsEditingHead(false);
        }
    }, [organization, isOpen]);

    useEffect(() => {
        const fetchCandidates = async () => {

            try
            {
                const response = await api.get('/moderator/get_all_users')

                if(response.data && response.data.data){
                    setUserChangeHeadCandidate(response.data.data)
                }
            }
            catch(error : any)
            {
                const message = error.response.data.message || "Failed to fetch candidates"
                setErrorMessage(message)
                setHandleButtonGotError(true)
            }
        }
        fetchCandidates()
    }, [])

    if (!isOpen) return null;

    const moderator = organization.moderators;

    // --- HANDLERS ---
    const handleSaveName = async () => {
        try
        {   
            const payload = {
                organizationName: orgName,
                organizationId: organization._id
            }
            const response = await api.put('/moderator/update_organization_name', payload)

            if(response.status === 200)
            {
                setSuccessMessage(response.data.message || "Succesfully update organization name")
                setHandleButtonGotSuccess(true)
            }
        }catch(error : any)
        {
            const message = error.response.data.message || "Failed to update organization name"
            setErrorMessage(message)
            setHandleButtonGotError(true)
        }
    };

    const handleSaveHead = async() => {
        try
        {
            const payload = {
                newHeadId: selectedCandidateId,
                organizationId: organization._id
            }

            const response = await api.put('/moderator/change_organization_head', payload)

            if(response.status === 200)
            {
                setSuccessMessage(response.data.message || "Succesfully update organization head")
                setHandleButtonGotSuccess(true)
            }

        }
        catch(error : any)
        {
            const message = error.response.data.message || "Failed to update organization head"
            setErrorMessage(message)
            setHandleButtonGotError(true)
        }
    };

    const handleSaveDescription = async () => {
        try
        {
            const payload = {
                description: description,
                organizationId: organization._id
            }
            
            const response = await api.put('/moderator/update_organization_description', payload)

            if(response.status === 200)
            {
                setSuccessMessage(response.data.message || "Succesfully update organization Description")
                setHandleButtonGotSuccess(true)
            }
        } 
        catch(error : any)
        {
            const message = error.response.data.message || "Failed to update organization description"
            setErrorMessage(message)
            setHandleButtonGotError(true)
        }
    };

    const handleDeleteOrganization = async () => {
        try
        {
            const response = await api.delete(`/moderator/delete_organization/${organization._id}`)

            if(response.status === 200)
            {
                setSuccessMessage(response.data.message || "Succesfully delete organization")
                console.log(response.data.message)
                setHandleButtonGotSuccess(true)
            }
        }
        catch(error : any)
        {
            const message = error.response.data.message || "Failed to delete organization"
            setErrorMessage(message)
            setHandleButtonGotError(true)
        }
    };

    
    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all flex flex-col max-h-[90vh]">
                
                {/* --- HEADER --- */}
                {/* FIXED: Reduced padding (p-4) for mobile, adjusted to p-6 for tablet+ */}
                <ModalHeader
                    isEditingName={isEditingName}
                    orgName={orgName}
                    setOrgName={(e) =>setOrgName(e.target.value)}
                    onSave={handleSaveName}
                    onCancel={() => {setIsEditingName(false); setOrgName(organization.organizationName);} }
                    onClickEdit={() => setIsEditingName(true)}
                    organization={organization.course}
                    onClose={onClose}
                />

                {/* --- SCROLLABLE CONTENT --- */}
                {/* FIXED: Reduced padding (p-4) for mobile */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-8">
                    
                    {/* 1. Description Section */}
                    <DescriptionSection 
                        isEditing={isEditingDesc}
                        setIsEditing={setIsEditingDesc}
                        description={description}
                        setDescription={setDescription}
                        onSave={handleSaveDescription}
                        onCancel={() => { setIsEditingDesc(false); setDescription(organization.description || ""); }}
                        members={organization.members}
                    />

                    {/* 2. Personnel Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* --- ORGANIZATION HEAD CARD (Editable) --- */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isEditingHead ? 'border-indigo-300 ring-2 ring-indigo-100 col-span-2 md:col-span-2' : 'border-gray-200 hover:shadow-md'}`}>
                            {/* Updated to bg-linear-to-r for Tailwind v4 */}
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <User size={18} className="text-blue-600" />
                                    <h3 className="font-semibold text-gray-800">Organization Head</h3>
                                </div>
                                {!isEditingHead && (
                                    <button 
                                        onClick={() => setIsEditingHead(true)}
                                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit2 size={12} /> Change
                                    </button>
                                )}
                            </div>

                            <div className="p-4">
                                {isEditingHead ? (
                                    <ChangeHeadSelector 
                                        candidates={userChangeHeadCandidate}
                                        selectedCandidateId={selectedCandidateId}
                                        onSelect={setSelectedCandidateId}
                                        onCancel={() => setIsEditingHead(false)}
                                        onSave={handleSaveHead}
                                    />
                                ) : (
                                    <CurrentHeadInformation 
                                        currentHead={currentHead}
                                    />
                                )}
                            </div>
                        </div>

                        {/* --- MODERATOR CARD (Read-Only) --- */}
                        {!isEditingHead && (
                            <ModeratorCard 
                                moderator={moderator}
                            />
                        )}
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <Footer 
                    handleDeleteOrganization={() => setIsDeleting(true)}
                    onClose={onClose}
                />

            </div>

            {isDeleting && (
                <Modal
                    cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[85vw] max-w-md  mx-auto"
                >
                    <p className='text-center'>You want to delete  this organization?</p>

                    <div
                        className='flex justify-between gap-x-2 mt-2'
                    >
                        <Button
                            buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                            type='button'
                            buttonText='Close'
                            onClick={() => setIsDeleting(false)}
                        />

                        <Button
                            type='button'
                            buttonText='Delete'
                            buttonContainerDesign="bg-red-600 p-[10px] w-full text-white rounded-[6px] hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer"                            
                            onClick={handleDeleteOrganization}
                        />
                    </div>
                </Modal>
            )}

            {handleButtonGotError && (
                <Modal
                    cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[85vw] max-w-md  mx-auto"
                >
                    <div
                        className='mb-2'
                    >
                        <h3 className="text-lg leading-6 font-medium text-red-500">Action Failed</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 wrap-break-words self-center">
                                {errorMessage || "An unexpected error occurred."}
                            </p>
                        </div>
                    </div>
                    <Button
                        type='button'
                        buttonText='Close'
                        onClick={() => window.location.reload()}
                    />
                </Modal>
            )}

            {handleButtonGotSuccess && (
                 <Modal
                    cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[85vw] max-w-md  mx-auto"
                >
                    <div
                        className='mb-2'
                    >
                        <h3 className="text-lg leading-6 font-medium text-green-500">Success Update</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 wrap-break-words self-center">
                                { successMessage || "An unexpected error occurred."}
                            </p>
                        </div>
                    </div>
                    <Button
                        type='button'
                        buttonText='Close'
                        onClick={() => {
                            onClose();
                            window.location.reload()
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default OrganizationDetailModal;