import { useState, useEffect } from 'react';
import { X, Check, Plus, User, Loader2 } from 'lucide-react';
import api from '../../api/api'; // Ensuring we use the configured instance
import Modal from "../../components/modal"
import Button from "../../components/button"

interface Candidate {
    _id: string;
    firstname: string;
    lastname: string;
    course: string;
    email: string;
    profileLink: string;
    role: string;
}

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormDataState {
    organizationName: string,
    description: string,
    course: string,
    organizationHeadID: string,
}

const InitialFormData = {
    organizationName: '',
    description: '',
    course: 'BS Information Technology',
    organizationHeadID: '',
}

export default function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
    const [formData, setFormData] = useState<FormDataState>(InitialFormData);
    
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
    const [selectedHead, setSelectedHead] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Error Modal Message 
    const [errorMessage, setErrorMessage] = useState<String>("")
    const [handleButtonGotError, setHandleButtonGotError] = useState(false)

    // Success Modal Message 
    const [successMessage, setSuccessMessage] = useState<String>("")
    const [handleButtonGotSuccess, setHandleButtonGotSuccess] = useState(false)

    // Fetch users when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCandidates();
        }
    }, [isOpen]);

    const fetchCandidates = async () => {
        setIsLoadingCandidates(true);
        try {
            // Using the api instance (baseURL is already configured)
            const response = await api.get('/moderator/get_all_users');
            
            // Axios places the body in response.data. 
            // Based on your JSON, the array is in response.data.data
            if (response.data && response.data.data) {
                setCandidates(response.data.data);
            }

        } catch (error) {
            console.error("Failed to fetch candidates:", error);
        } finally {
            setIsLoadingCandidates(false);
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedHead(userId);
        setFormData({ ...formData, organizationHeadID: userId });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await api.post('/moderator/create_organization', formData);
            
            if(response.status === 200)
            {
                setSuccessMessage(response.data.message || "Succesfully create organization")
                setHandleButtonGotSuccess(true)
            }
            
        } 
        catch (error: any) 
        {
            
            const message = error.response.data.message || "Failed to create organization"
            setErrorMessage(message)
            setHandleButtonGotError(true)
        } 
        finally 
        {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create New Organization</h2>
                        <p className="text-sm text-gray-500">Register a student body and assign a head.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Organization Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g., Cursor Code Club"
                                value={formData.organizationName}
                                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Focus</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    value={formData.course}
                                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                                >
                                    <option value="BS Information Technology">BS Information Technology</option>
                                    <option value="BS Civil Engineering">BS Civil Engineering</option>
                                    <option value="BS Computer Science">BS Computer Science</option>
                                    <option value="BS Food Technology">BS Food Technology</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Brief mission statement..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Assignment Section */}
                    <div className="border-t border-gray-100 pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Organization Head</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                                <span>Select a candidate from the list</span>
                                {isLoadingCandidates && <Loader2 size={14} className="animate-spin text-indigo-600"/>}
                            </div>
                            
                            {/* Scrollable User List */}
                            <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                                {isLoadingCandidates ? (
                                    <div className="p-4 text-center text-sm text-gray-500">Loading candidates...</div>
                                ) : candidates.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">No users found.</div>
                                ) : (
                                    candidates.map((user) => (
                                        <div 
                                            key={user._id}
                                            onClick={() => handleSelectUser(user._id)}
                                            className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-150 ${
                                                selectedHead === user._id 
                                                    ? 'bg-indigo-50 border-l-4 border-indigo-600' 
                                                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold shadow-sm ${
                                                    selectedHead === user._id 
                                                        ? 'bg-indigo-200 text-indigo-700' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {user.profileLink ? (
                                                        <img src={user.profileLink} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{user.firstname[0]}{user.lastname[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${selectedHead === user._id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                        {user.firstname} {user.lastname}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{user.course}</p>
                                                </div>
                                            </div>
                                            {selectedHead === user._id && (
                                                <div className="bg-indigo-100 p-1 rounded-full">
                                                    <Check size={16} className="text-indigo-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        {!selectedHead && <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">* <User size={12}/> Selection required</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedHead || !formData.organizationName  || !formData.description || isSubmitting}
                            className={`px-5 py-2 text-white font-medium rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                                (!selectedHead || !formData.organizationName || !formData.description  || isSubmitting) 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                            }`}
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Create Organization
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

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
}