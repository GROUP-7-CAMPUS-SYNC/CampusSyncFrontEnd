import { X, User, Mail, Users, ShieldCheck } from 'lucide-react'; 
import type { IOrganization } from './index'; 

interface OrganizationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    organization: IOrganization;
}

const OrganizationDetailModal = ({ isOpen, onClose, organization }: OrganizationDetailModalProps) => {
    if (!isOpen) return null;

    const head = organization.organizationHeadID;
    const moderator = organization.moderators;

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all flex flex-col max-h-[90vh]">
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

                <div className="p-6 overflow-y-auto space-y-8">
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

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <User size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-800">Organization Head</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {head ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {head.profileLink ? (
                                                <img src={head.profileLink} alt="Head" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {head.firstname[0]}{head.lastname[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{head.firstname} {head.lastname}</p>
                                                <p className="text-xs text-gray-500">{head.course}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} />
                                            <a href={`mailto:${head.email}`} className="hover:text-blue-600 hover:underline truncate">{head.email}</a>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-red-500 text-sm font-medium">Position Vacant</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-liner-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDetailModal;