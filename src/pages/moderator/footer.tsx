import { Trash2 } from 'lucide-react';

interface FooterProps {
    handleDeleteOrganization: () => void;
    onClose: () => void;
}


export default function footer({
    handleDeleteOrganization,
    onClose,
}: FooterProps) {
  return (
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
  )
}
