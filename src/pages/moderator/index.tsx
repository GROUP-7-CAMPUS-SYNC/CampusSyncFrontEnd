import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { Plus, LogOut } from 'lucide-react';
import api from "../../api/api";
import { OrganizationTable } from './OrganizationTable'; 
import { ErrorMessage } from './ErrorMessage';
import CreateOrganizationModal from './createOrganizationModal'; 
import { clearLogInFlag } from "../../utils/clearLogInFlag";
import type { IOrganization } from "../../types/IOrganization" 

const useOrganizations = () => {
    const [data, setData] = useState<IOrganization[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/moderator/get_all_organizations'); 
            
            if (Array.isArray(response.data)) {
                 setData(response.data as IOrganization[]); 
            } else {
                 setData(response.data.data); 
            }

        } catch (err) {
            const axiosError = err as AxiosError;
            console.error("API Fetch Error:", axiosError);
            
            const errorMessage = (axiosError.response?.data as { message: string })?.message 
                                 || "Failed to retrieve organization data. Check API configuration.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default function ModeratorPage() { 
    const { data: organizations, loading, error, refetch } = useOrganizations();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearLogInFlag();
        navigate("/");
    };

    return (
        <div className="moderator-dashboard-container p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 border-b pb-4 border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Organization Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Centralized oversight for all registered student organizations.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* CREATE BUTTON */}
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Create Organization</span>
                        <span className="sm:hidden">Create</span>
                    </button>

                    {/* LOGOUT BUTTON */}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Status Handling */}
            {loading && (
                <div className="text-center p-8 bg-white shadow rounded-lg text-blue-600 font-semibold flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading organizational data...</span>
                </div>
            )}
            
            {error && <ErrorMessage message={error} onRefetch={refetch} />}

            {/* Data Display */}
            {!loading && !error && organizations && (
                <div className="shadow-2xl bg-white rounded-xl overflow-hidden border border-gray-100">
                    <OrganizationTable organizations={organizations} />
                </div>
            )}
            
            {/* Zero State */}
            {!loading && !error && organizations && organizations.length === 0 && (
                <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-xl">
                    <p className="text-gray-500 text-lg mb-4">No organizations found.</p>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Create your first organization now
                    </button>
                </div>
            )}

            {/* MODAL INSTANCE */}
            <CreateOrganizationModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refetch(); // Refresh the table after creation
                }}
            />
        </div>
    );
}