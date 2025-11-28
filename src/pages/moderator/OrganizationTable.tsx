import { useState } from 'react';
import { Users, Mail, ShieldCheck } from 'lucide-react'; 
import type { IOrganization } from '../../types/IOrganization'; 
import OrganizationDetailModal from './clickOrganizationRow';

interface OrganizationTableProps {
    organizations: IOrganization[] | null | undefined; 
}

export function OrganizationTable({ organizations }: OrganizationTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<IOrganization | null>(null);

    if (!organizations || organizations.length === 0) {
        return null; 
    }

    const handleRowClick = (org: IOrganization) => {
        setSelectedOrg(org);
        setIsModalOpen(true);
    };

    const renderUserName = (user: { firstname: string, lastname: string } | undefined) => {
        return user ? `${user.firstname} ${user.lastname}` : 'N/A';
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 hidden sm:table-header-group">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Focus</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Members</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Head</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Approver</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {organizations.map((org: IOrganization) => {
                        const head = org.organizationHeadID;
                        const moderator = org.moderators;
                        const rowKey = String(org._id);

                        return (
                            <tr 
                                key={rowKey} 
                                className="block border-b border-gray-200 p-4 sm:table-row transition-colors duration-200 hover:bg-gray-50 cursor-pointer group"
                                onClick={() => handleRowClick(org)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap block sm:table-cell">
                                    <div className="flex items-center">
                                        <div className="shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-lg">
                                            {org.organizationName.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {org.organizationName}
                                            </div>
                                            <div className="text-xs text-gray-500 sm:hidden">{org.course}</div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {org.course.replace("BS ", "")}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} className="text-gray-400" />
                                        {org.members}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap block sm:table-cell">
                                    <div className="flex items-center">
                                        <div className="sm:hidden w-20 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Head:</div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {head ? renderUserName(head) : <span className="text-red-400 italic">Vacant</span>}
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {head?.email ? (
                                        <div className="flex items-center gap-2 hover:text-blue-600">
                                            <Mail size={14} />
                                            <span className="truncate max-w-[150px]">{head.email}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {moderator ? (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            <span>{renderUserName(moderator)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">System</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {selectedOrg && (
                <OrganizationDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    organization={selectedOrg}
                />
            )}
        </div>
    );
}