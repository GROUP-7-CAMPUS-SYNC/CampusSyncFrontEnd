import { useState, useEffect } from 'react';
import { X, User, Mail, Users, ShieldCheck, Edit2, Trash2, Save } from 'lucide-react'; 
import type { IOrganization } from './index'; 
import ChangeHeadSelector from './changeHeadSelector';
import type { HeadCandidate } from "./changeHeadSelector"

// --- MOCK CANDIDATE DATA ---
const MOCK_CANDIDATES: HeadCandidate[] = [
    { _id: 'u1', firstname: 'Juan', lastname: 'Dela Cruz', email: 'juan.dc@student.edu', course: 'BS Information Technology' },
    { _id: 'u2', firstname: 'Maria', lastname: 'Clara', email: 'maria.c@student.edu', course: 'BS Civil Engineering' },
    { _id: 'u3', firstname: 'Jose', lastname: 'Rizal', email: 'jose.r@student.edu', course: 'BS Computer Science' },
    { _id: 'u4', firstname: 'Andres', lastname: 'Bonifacio', email: 'andres.b@student.edu', course: 'BS Food Technology' },
    { _id: 'u5', firstname: 'Apolinario', lastname: 'Mabini', email: 'pol.m@student.edu', course: 'BS Information Technology' },
    { _id: 'u6', firstname: 'Gabriela', lastname: 'Silang', email: 'gab.s@student.edu', course: 'BS Civil Engineering' },
];

interface OrganizationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    organization: IOrganization;
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

    // Description Editing
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState(organization.description || "");

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

    if (!isOpen) return null;

    const moderator = organization.moderators;

    // --- HANDLERS ---
    const handleSaveName = () => {
        console.log(`[API CALL] Update Name: Org ${organization._id} -> "${orgName}"`);
        setIsEditingName(false);
    };

    const handleSaveHead = () => {
        if (!selectedCandidateId) return;
        const newHead = MOCK_CANDIDATES.find(u => u._id === selectedCandidateId);
        
        if (newHead) {
            console.log(`[API CALL] Update Head: Org ${organization._id} -> User ${newHead._id}`);
            setCurrentHead({
                _id: newHead._id,
                firstname: newHead.firstname,
                lastname: newHead.lastname,
                email: newHead.email,
                course: newHead.course,
                profileLink: "" 
            });
        }
        setIsEditingHead(false);
        setSelectedCandidateId(null);
    };

    const handleSaveDescription = () => {
        console.log(`[API CALL] Update Description: Org ${organization._id} -> "${description}"`);
        setIsEditingDesc(false);
    };

    const handleDeleteOrganization = () => {
        if (confirm(`Are you sure you want to PERMANENTLY DELETE "${organization.organizationName}"? This action cannot be undone.`)) {
            console.log(`[API CALL] DELETE Organization: ${organization._id}`);
            onClose(); 
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
                <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    {/* FIXED: Added min-w-0 to allow flex child to shrink below content size (fixes overflow on 320px) */}
                    <div className="flex-1 mr-4 min-w-0">
                        {isEditingName ? (
                            <div className="animate-in fade-in zoom-in-95 duration-100">
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xl font-bold text-gray-900 mb-2"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleSaveName}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1 transition-colors"
                                    >
                                        <Save size={12} /> Save
                                    </button>
                                    <button 
                                        onClick={() => { setIsEditingName(false); setOrgName(organization.organizationName); }}
                                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="group flex items-center gap-2">
                                {/* FIXED: Added responsive text size (text-xl on mobile, text-2xl on sm+) */}
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{orgName}</h2>
                                <button 
                                    onClick={() => setIsEditingName(true)}
                                    // FIXED: Added shrink-0 to prevent button from disappearing or squashing
                                    className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-gray-200 transition-all shrink-0"
                                    title="Edit Name"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        )}
                        
                        {!isEditingName && (
                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {organization.course}
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={onClose} 
                        // FIXED: Added shrink-0
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                {/* FIXED: Reduced padding (p-4) for mobile */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-8">
                    
                    {/* 1. Description Section */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">About</h3>
                            {!isEditingDesc && (
                                <button 
                                    onClick={() => setIsEditingDesc(true)}
                                    className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                                    title="Edit Description"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                        </div>

                        {isEditingDesc ? (
                            <div className="animate-in fade-in zoom-in-95 duration-100">
                                <textarea 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 min-h-[100px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter organization description..."
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        onClick={() => { setIsEditingDesc(false); setDescription(organization.description || ""); }}
                                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveDescription}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1"
                                    >
                                        <Save size={12} /> Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="prose text-gray-600 text-sm leading-relaxed p-2 rounded hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                {description || <span className="italic text-gray-400">No description provided.</span>}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit">
                            <Users size={18} className="text-indigo-600" />
                            <span className="font-semibold">{organization.members}</span>
                            <span>Active Members</span>
                        </div>
                    </div>

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
                                        candidates={MOCK_CANDIDATES}
                                        selectedCandidateId={selectedCandidateId}
                                        onSelect={setSelectedCandidateId}
                                        onCancel={() => setIsEditingHead(false)}
                                        onSave={handleSaveHead}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {currentHead ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    {currentHead.profileLink ? (
                                                        <img src={currentHead.profileLink} alt="Head" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                            {currentHead.firstname[0]}{currentHead.lastname[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-lg">{currentHead.firstname} {currentHead.lastname}</p>
                                                        <p className="text-sm text-gray-500">{currentHead.course}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <a href={`mailto:${currentHead.email}`} className="hover:text-blue-600 hover:underline truncate">{currentHead.email}</a>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-400 italic">
                                                No head assigned. Click change to assign one.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- MODERATOR CARD (Read-Only) --- */}
                        {!isEditingHead && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Updated to bg-linear-to-r for Tailwind v4 */}
                                <div className="bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-emerald-600" />
                                    <h3 className="font-semibold text-gray-800">Approved By</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {moderator ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                                    {moderator.firstname[0]}{moderator.lastname[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{moderator.firstname} {moderator.lastname}</p>
                                                    <p className="text-xs text-gray-500">Moderator</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} />
                                                <a href={`mailto:${moderator.email}`} className="hover:text-blue-600 hover:underline truncate">{moderator.email}</a>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">System/Unknown</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="bg-gray-50 p-4 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
                    <button 
                        onClick={handleDeleteOrganization}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} /> Delete Organization
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDetailModal;