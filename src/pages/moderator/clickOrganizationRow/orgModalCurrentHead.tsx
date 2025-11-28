import type { IOrganization } from '../index';
import { Mail } from 'lucide-react'; 


interface CurrentHeadPorp {
    currentHead: IOrganization["organizationHeadID"]

}
export default function currentHeadInformation({currentHead} : CurrentHeadPorp) {
  return (
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
  )
}
