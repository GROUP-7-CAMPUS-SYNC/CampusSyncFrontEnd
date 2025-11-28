import { Check, AlertCircle } from 'lucide-react';
import type { Candidate } from "../../../types/candidates"

interface ChangeHeadSelectorProps {
    candidates: Candidate[];
    selectedCandidateId: string | null;
    onSelect: (id: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

export default function ChangeHeadSelector({ 
    candidates, 
    selectedCandidateId, 
    onSelect, 
    onCancel, 
    onSave 
}: ChangeHeadSelectorProps) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Select New Head:</label>
                <div className="flex gap-2">
                    <button 
                        onClick={onCancel}
                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onSave}
                        disabled={!selectedCandidateId}
                        className={`text-xs px-3 py-1 rounded text-white font-medium transition-colors ${
                            selectedCandidateId 
                                ? 'bg-indigo-600 hover:bg-indigo-700' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-h-48 overflow-y-auto divide-y divide-gray-200">
                {candidates.map((user) => (
                    <div 
                        key={user._id}
                        onClick={() => onSelect(user._id)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                            selectedCandidateId === user._id 
                                ? 'bg-indigo-50 border-l-4 border-indigo-600' 
                                : 'hover:bg-white border-l-4 border-transparent'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold shadow-sm ${
                                    selectedCandidateId === user._id 
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
                                <p className={`text-sm font-medium ${
                                    selectedCandidateId === user._id ? 'text-indigo-900' : 'text-gray-900'
                                }`}>
                                    {user.firstname} {user.lastname}
                                </p>
                                <p className="text-xs text-gray-500">{user.course}</p>
                            </div>
                        </div>
                        {selectedCandidateId === user._id && <Check size={16} className="text-indigo-600" />}
                    </div>
                ))}
            </div>

            {/* Warning Footer */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle size={12} />
                This action will revoke admin privileges from the current head.
            </div>
        </div>
    );
}