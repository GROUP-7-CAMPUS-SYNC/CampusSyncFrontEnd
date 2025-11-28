import { X, Edit2, Save } from 'lucide-react'; 

interface OrganizationDetailsModalHeaderProps {
    isEditingName: boolean;
    orgName: string;
    setOrgName: (e : any) => void;
    onSave: () => void;
    onCancel: () => void;
    onClickEdit: () => void;
    organization: string
    onClose: () => void;
}

export default function organizationDetailsModalHeader({
    isEditingName,
    orgName,
    setOrgName,
    onSave,
    onCancel,
    onClickEdit,
    organization,
    onClose
} : OrganizationDetailsModalHeaderProps) {
  return (
                    <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    {/* FIXED: Added min-w-0 to allow flex child to shrink below content size (fixes overflow on 320px) */}
                    <div className="flex-1 mr-4 min-w-0">
                        {isEditingName ? (
                            <div className="animate-in fade-in zoom-in-95 duration-100">
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xl font-bold text-gray-900 mb-2"
                                    value={orgName}
                                    onChange={setOrgName}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button 
                                        onClick={onSave}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1 transition-colors"
                                    >
                                        <Save size={12} /> Save
                                    </button>
                                    <button 
                                        onClick={ onCancel }
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
                                    onClick={onClickEdit}
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
                                {organization}
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
  )
}
