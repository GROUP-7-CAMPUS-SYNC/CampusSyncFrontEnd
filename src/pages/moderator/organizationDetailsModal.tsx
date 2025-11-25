import { useState } from 'react';
import { X, User, Mail, Users, ShieldCheck, Edit2 } from 'lucide-react'; 
import type { IOrganization } from './index'; 
// FIXED: Separate value import from type import for verbatimModuleSyntax compatibility
import ChangeHeadSelector from './changeHeadSelector';
import type { HeadCandidate } from './changeHeadSelector';

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
    const [isEditingHead, setIsEditingHead] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [currentHead, setCurrentHead] = useState(organization.organizationHeadID);

    if (!isOpen) return null;

    const moderator = organization.moderators;

    const handleSaveHead = () => {
        if (!selectedCandidateId) return;

        const newHead = MOCK_CANDIDATES.find(u => u._id === selectedCandidateId);
        
        if (newHead) {
            console.log(`Updating Organization ${organization._id} head to user ${newHead._id}`);
            // Optimistic update
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

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{organization.organizationName}</h2>
                        <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {organization.course}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-8">
                    
                    {/* Stats Row */}
                    <div className="space-y-4">
                        <div className="prose text-gray-600 text-sm leading-relaxed">
                            {organization.description || <span className="italic text-gray-400">No description available.</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit">
                            <Users size={18} className="text-indigo-600" />
                            <span className="font-semibold">{organization.members}</span>
                            <span>Active Members</span>
                        </div>
                    </div>

                    {/* Personnel Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* --- ORGANIZATION HEAD CARD --- */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isEditingHead ? 'border-indigo-300 ring-2 ring-indigo-100 col-span-2 md:col-span-2' : 'border-gray-200 hover:shadow-md'}`}>
                            {/* FIXED: Updated to bg-linear-to-r for Tailwind v4 */}
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
                                    /* Decoupled Selector Component */
                                    <ChangeHeadSelector 
                                        candidates={MOCK_CANDIDATES}
                                        selectedCandidateId={selectedCandidateId}
                                        onSelect={setSelectedCandidateId}
                                        onCancel={() => setIsEditingHead(false)}
                                        onSave={handleSaveHead}
                                    />
                                ) : (
                                    /* VIEW MODE: CURRENT HEAD DETAILS */
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

                        {/* --- MODERATOR CARD (Only visible if not editing head for layout balance) --- */}
                        {!isEditingHead && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* FIXED: Updated to bg-linear-to-r for Tailwind v4 */}
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
            </div>
        </div>
    );
};

export default OrganizationDetailModal;