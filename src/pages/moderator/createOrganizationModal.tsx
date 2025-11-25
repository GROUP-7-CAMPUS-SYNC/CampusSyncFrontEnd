import { useState } from 'react';
import { X, Check, Plus, User } from 'lucide-react';

// --- MOCK DATA FOR USER SELECTION ---
// In a real app, this would come from an API call like api.get('/users/candidates')
const MOCK_USERS = [
    { _id: 'u1', firstname: 'Juan', lastname: 'Dela Cruz', email: 'juan.dc@student.edu', course: 'BS Information Technology' },
    { _id: 'u2', firstname: 'Maria', lastname: 'Clara', email: 'maria.c@student.edu', course: 'BS Civil Engineering' },
    { _id: 'u3', firstname: 'Jose', lastname: 'Rizal', email: 'jose.r@student.edu', course: 'BS Computer Science' },
    { _id: 'u4', firstname: 'Andres', lastname: 'Bonifacio', email: 'andres.b@student.edu', course: 'BS Food Technology' },
    { _id: 'u5', firstname: 'Apolinario', lastname: 'Mabini', email: 'pol.m@student.edu', course: 'BS Information Technology' },
    { _id: 'u6', firstname: 'Gabriela', lastname: 'Silang', email: 'gab.s@student.edu', course: 'BS Civil Engineering' },
];

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Trigger refetch on parent
}

export default function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
    const [formData, setFormData] = useState({
        organizationName: '',
        description: '',
        course: 'BS Information Technology', // Default value from schema enum
        organizationHeadID: '',
        moderators: 'current-user-id' // Mocked ID representing the logged-in moderator
    });
    
    const [selectedHead, setSelectedHead] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSelectUser = (userId: string) => {
        setSelectedHead(userId);
        setFormData({ ...formData, organizationHeadID: userId });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // TODO: Replace with actual API call
            // await api.post('/moderator/create_organization', formData);
            
            console.log("PAYLOAD TO SEND:", formData);
            
            // Simulate network delay
            setTimeout(() => {
                alert("Organization created successfully (Mock)!");
                onSuccess(); // Refresh parent data
                onClose();
                setIsSubmitting(false);
            }, 1000);

        } catch (error) {
            console.error("Creation failed", error);
            setIsSubmitting(false);
        }
    };

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
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Select a candidate from the list
                            </div>
                            
                            {/* Scrollable User List */}
                            <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                                {MOCK_USERS.map((user) => (
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
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                                                selectedHead === user._id 
                                                    ? 'bg-indigo-200 text-indigo-700' 
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {user.firstname[0]}{user.lastname[0]}
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
                                ))}
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
                            disabled={!selectedHead || !formData.organizationName || isSubmitting}
                            className={`px-5 py-2 text-white font-medium rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                                (!selectedHead || !formData.organizationName || isSubmitting) 
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
        </div>
    );
}