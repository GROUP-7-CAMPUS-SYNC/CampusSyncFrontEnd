import { useState } from "react";
import { X, Loader2 } from "lucide-react";

// --- Import Reusable Cards & Types ---
import EventCard, { type EventPost } from "../contentDisplaySection/eventContent";
import AcademicCard, { type AcademicPost } from "../contentDisplaySection/academicContent";
import LostFoundCard, { type ReportItem } from "../contentDisplaySection/lostfoundContent";
import CommentModal from "../../pages/event/commentModal"; 

// --- Define Union Type ---
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
    // --- Interaction States (Local to this modal) ---
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
    const [witnessItems, setWitnessItems] = useState<Set<string>>(new Set());
    const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(new Set());

    // --- Modal State ---
    const [activeModal, setActiveModal] = useState<{
        type: "comment_api" | "comment_list";
        id: string;
        data?: any;
        postedBy?: any;
    } | null>(null);

    if (!isOpen) return null;

    // --- Handlers (Identical to Dashboard) ---
    const handleToggleSave = (id: string) => {
        setSavedItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; });
    };
    const handleToggleNotify = (id: string) => {
        setNotifyItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; });
    };
    const handleToggleWitness = (id: string) => {
        setWitnessItems((prev) => { const newSet = new Set(prev); if(newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; });
    };
    const handleOpenCommentForm = (id: string, postedBy: any) => {
        setActiveModal({ type: "comment_api", id, postedBy });
        setCommentOpenItems(prev => new Set(prev).add(id));
    };
    const handleViewComments = (comments: any[]) => {
        setActiveModal({ type: "comment_list", id: "", data: comments });
    };
    const closeModal = () => {
        if (activeModal?.type === "comment_api") {
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

                {/* Content Area */}
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
                            <p className="text-sm">Try using different keywords or check spelling.</p>
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
                                                commentCount={3000}
                                                onToggleSave={handleToggleSave}
                                                onToggleNotify={handleToggleNotify}
                                                onCommentClick={handleOpenCommentForm}
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
                                                onCommentClick={handleOpenCommentForm}
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
                                                onCommentClick={handleViewComments}
                                            />
                                        );
                                    default: return null;
                                }
                            })}
                        </div>
                    )}
                </div>

                {/* --- Internal Modal for Comments (Nested) --- */}
                {activeModal?.type === "comment_api" && (
                    <CommentModal
                        postId={activeModal.id}
                        postedBy={activeModal.postedBy}
                        onClose={closeModal}
                    />
                )}

                {activeModal?.type === "comment_list" && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-bold">Comments</h3>
                                <button onClick={closeModal}><X size={20} /></button>
                            </div>
                            <div className="p-4 overflow-y-auto">
                                {activeModal.data?.length > 0 ? (
                                    activeModal.data.map((c:any, i:number) => (
                                        <div key={i} className="p-2 mb-2 bg-gray-100 rounded text-sm text-black">
                                            {JSON.stringify(c)}
                                        </div>
                                    ))
                                ) : <p className="text-center text-gray-500">No comments.</p>}
                            </div>
                        </div>
                    </div>
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