import React, { useState, useEffect, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { Plus, Search, Check, User, X } from 'lucide-react'; // Added icons for the new UI
import api from "../../api/api";
import { OrganizationTable } from './OrganizationTable'; 
import { ErrorMessage } from './ErrorMessage'; 

// --- Data Interfaces (Data Contract) ---
interface IOrganizationHead {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profileLink?: string;
    course: string;
}

interface IModerator {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface IOrganization {
    _id: string;
    organizationName: string;
    description?: string;
    profileLink?: string;
    course: "BS Civil Engineering" | "BS Information Technology" | "BS Computer Science" | "BS Food Technology";
    members: number;
    organizationHeadID: IOrganizationHead; 
    moderators: IModerator; 
    __v: number;
}
// --- End Data Interfaces ---

// --- MOCK DATA FOR USERS ---
const MOCK_USERS = [
    { _id: 'u1', firstname: 'Juan', lastname: 'Dela Cruz', email: 'juan.dc@student.edu', course: 'BS Information Technology' },
    { _id: 'u2', firstname: 'Maria', lastname: 'Clara', email: 'maria.c@student.edu', course: 'BS Civil Engineering' },
    { _id: 'u3', firstname: 'Jose', lastname: 'Rizal', email: 'jose.r@student.edu', course: 'BS Computer Science' },
    { _id: 'u4', firstname: 'Andres', lastname: 'Bonifacio', email: 'andres.b@student.edu', course: 'BS Food Technology' },
    { _id: 'u5', firstname: 'Apolinario', lastname: 'Mabini', email: 'pol.m@student.edu', course: 'BS Information Technology' },
    { _id: 'u6', firstname: 'Gabriela', lastname: 'Silang', email: 'gab.s@student.edu', course: 'BS Civil Engineering' },
];

// --- CREATE MODAL COMPONENT ---
interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Callback for when org is created
}

const CreateOrganizationModal = ({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) => {
    const [formData, setFormData] = useState({
        organizationName: '',
        description: '',
        course: 'BS Information Technology',
        organizationHeadID: '',
        moderators: 'current-user-id' // Mocked for now
    });
    const [selectedHead, setSelectedHead] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSelectUser = (userId: string) => {
        setSelectedHead(userId);
        setFormData({ ...formData, organizationHeadID: userId });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrate actual API call here using Organization Model structure
        console.log("Creating Organization Payload:", formData);
        alert("Organization Created (Mock)!"); 
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Create New Organization</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Focus</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Short description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Assignment Scrollbar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Organization Head</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                                Select a User from the list
                            </div>
                            
                            {/* Scrollable User List */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                                {MOCK_USERS.map((user) => (
                                    <div 
                                        key={user._id}
                                        onClick={() => handleSelectUser(user._id)}
                                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-150 ${
                                            selectedHead === user._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50 border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                selectedHead === user._id ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-600'
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
                                            <Check size={18} className="text-indigo-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {!selectedHead && <p className="text-xs text-red-500 mt-1">* Please select an organization head</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedHead || !formData.organizationName}
                            className={`px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ${
                                (!selectedHead || !formData.organizationName) 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            <Plus size={18} />
                            Create Organization
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


/**
 * Custom hook for fetching organization data asynchronously.
 */
const useOrganizations = () => {
    const [data, setData] = useState<IOrganization[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: The API call remains unchanged as per instruction.
            const response = await api.get('/moderator/get_all_organizations'); 
            
            // Handle array response correctly
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


/**
 * Main Moderator Dashboard Component.
 */
export default function ModeratorPage() { 
    const { data: organizations, loading, error, refetch } = useOrganizations();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
                
                {/* CREATE BUTTON */}
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold"
                >
                    <Plus size={20} />
                    Create Organization
                </button>
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
            
            {/* Safe check for zero organizations */}
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

            {/* Create Organization Modal */}
            <CreateOrganizationModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refetch(); // Refresh list after creation
                }}
            />
        </div>
    );
}