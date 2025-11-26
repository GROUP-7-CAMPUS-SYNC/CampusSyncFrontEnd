import { Users, Edit2, Save } from 'lucide-react'; 

interface DescriptionSectionProps {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void; // Fixed type to accept boolean
    description: string;
    setDescription: (value: string) => void; // Fixed type to accept string
    onSave: () => void;   // Added missing prop
    onCancel: () => void; // Added missing prop for revert logic
    members: number;      // Added missing prop for the stats display
}

export default function DescriptionSection({
    isEditing,
    setIsEditing,
    description,
    setDescription,
    onSave,
    onCancel,
    members
}: DescriptionSectionProps) {
    return (
        <div className="space-y-2 group">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">About</h3>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                        title="Edit Description"
                    >
                        <Edit2 size={14} />
                    </button>
                )}
            </div>

            {isEditing ? (
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
                            onClick={onCancel}
                            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onSave}
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
                <span className="font-semibold">{members}</span>
                <span>Active Members</span>
            </div>
        </div>
    );
}