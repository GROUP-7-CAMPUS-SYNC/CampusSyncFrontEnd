import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../../api/api"; 

// Import Reusable Cards
import EventCard, { type EventPost } from "../contentDisplaySection/eventContent";
import AcademicCard, { type AcademicPost } from "../contentDisplaySection/academicContent";
import LostFoundCard, { type ReportItem } from "../contentDisplaySection/lostfoundContent";

// ✅ Import the Shared Comment Modal
import CommentModal from "../contentDisplaySection/comment"; 

type FeedItem = 
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: FeedItem[];
    loading: boolean;
    searchQuery: string;
}

export default function GlobalSearchModal({ isOpen, onClose, results, loading, searchQuery }: GlobalSearchModalProps) {
    // Interaction States
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
    const [witnessItems, setWitnessItems] = useState<Set<string>>(new Set());
    const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(new Set());

    // Modal State
    const [activeModal, setActiveModal] = useState<{
        id: string;
        feedType?: "event" | "academic" | "report";
        data?: any;
        postedBy?: any;
    } | null>(null);

    // --- Handle Adding Comment ---
    const handleAddComment = async (text: string) => {
        if (!activeModal || !activeModal.id || !activeModal.feedType) return;

        try {
            let endpoint = "";
            if (activeModal.feedType === "event") endpoint = `/events/${activeModal.id}/comments`;
            else if (activeModal.feedType === "academic") endpoint = `/academic/${activeModal.id}/comments`;
            else if (activeModal.feedType === "report") endpoint = `/report_types/${activeModal.id}/comments`;
            
            const response = await api.post(endpoint, { text });

            if (response.status === 200) {
                const updatedComments = response.data;
                // Update the Modal's internal data to show the new comment immediately
                setActiveModal(prev => prev ? { ...prev, data: updatedComments } : null);
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    if (!isOpen) return null;

    // --- Card Handlers ---
    const handleToggleSave = (id: string) => { setSavedItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    const handleToggleNotify = (id: string) => { setNotifyItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    const handleToggleWitness = (id: string) => { setWitnessItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    
    // Unified Handler for Opening Comment Modal (Event/Academic)
    const handleOpenCommentForm = (id: string, postedBy: any, feedType: "event" | "academic") => {
        const item = results.find(r => r._id === id);
        setActiveModal({ 
            id, 
            postedBy, 
            feedType,
            data: item?.comments || [] 
        });
        setCommentOpenItems(prev => new Set(prev).add(id));
    };

    const closeModal = () => {
        if (activeModal) {
           setCommentOpenItems(prev => { const newSet = new Set(prev); newSet.delete(activeModal.id); return newSet; });
        }
        setActiveModal(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-10 sm:pt-20">
            <div className="bg-white w-full max-w-4xl h-[90vh] sm:h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative mx-4">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        Search Results for <span className="text-blue-600">"{searchQuery}"</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                            <Loader2 className="animate-spin" size={32} />
                            <p>Searching database...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
                            <SearchIconPlaceholder />
                            <p className="font-medium">No results found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {results.map((item) => {
                                switch (item.feedType) {
                                    case "event":
                                        return (
                                            <EventCard
                                                key={item._id}
                                                post={item as EventPost}
                                                isSaved={savedItems.has(item._id)}
                                                isNotify={notifyItems.has(item._id)}
                                                isCommentOpen={commentOpenItems.has(item._id)}
                                                commentCount={item.comments?.length || 0}
                                                onToggleSave={handleToggleSave}
                                                onToggleNotify={handleToggleNotify}
                                                onCommentClick={(id, postedBy) => handleOpenCommentForm(id, postedBy, "event")}
                                            />
                                        );
                                    case "academic":
                                        return (
                                            <AcademicCard
                                                key={item._id}
                                                post={item as AcademicPost}
                                                isSaved={savedItems.has(item._id)}
                                                isCommentOpen={commentOpenItems.has(item._id)}
                                                onToggleSave={handleToggleSave}
                                                onCommentClick={(id, postedBy) => handleOpenCommentForm(id, postedBy, "academic")}
                                            />
                                        );
                                    case "report":
                                        return (
                                            <LostFoundCard
                                                key={item._id}
                                                item={item as ReportItem}
                                                isSaved={savedItems.has(item._id)}
                                                isWitnessed={witnessItems.has(item._id)}
                                                onToggleSave={handleToggleSave}
                                                onToggleWitness={handleToggleWitness}
                                                onCommentClick={(comments) => {
                                                    setActiveModal({
                                                        id: item._id,
                                                        feedType: "report",
                                                        data: comments,
                                                        postedBy: null // Reports might not need "Reply to X"
                                                    });
                                                }}
                                            />
                                        );
                                    default: return null;
                                }
                            })}
                        </div>
                    )}
                </div>

                {/* --- Unified Comment Modal --- */}
                {/* Now uses the EXACT same component as LostAndFound page */}
                {activeModal && (
                    <CommentModal
                        postId={activeModal.id}
                        postedBy={activeModal.postedBy}
                        comments={activeModal.data}
                        onClose={closeModal}
                        onAddComment={handleAddComment} 
                    />
                )}
            </div>
        </div>
    );
}

function SearchIconPlaceholder() {
    return (
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}