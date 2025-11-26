import { Mail, ShieldCheck} from 'lucide-react'; 


interface ModeratorCard {
    moderator: any
}

export default function moderatorCard({
    moderator,
} : ModeratorCard) {
  return (
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
    )
}
