import { useEffect, useState } from "react"
import api from "../../api/api"
import { User, MapPin, Clock, Eye, MessageCircle, Bookmark, BookmarkCheck, X } from "lucide-react";


// 1. Updated Interface to match ALL fields in your JSON response
interface ReportItem {
    _id: string;
    reportType: "Lost" | "Found";
    itemName: string;
    description: string;
    turnOver: string;          // Added
    locationDetails: string;
    contactDetails: string;
    dateLostOrFound: string;
    image: string;
    postedBy: string;          // Added (User ID)
    status: string;            // Added
    witnesses: any[];          // Added (Array)
    comments: any[];           // Added (Array)
    // __v is omitted here
}


export default function LostAndFoundContent() {
    const [reportItems, setReportItems] = useState<ReportItem[]>([]);
    const [selectedModal, setSelectedModal] = useState<{ type: "comments"; itemId: string } | null>(null);
    const [modalData, setModalData] = useState<any[]>([]);
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [witnessClicks, setWitnessClicks] = useState<Set<string>>(new Set());


    const fetchLostAndFoundContent = async () => {
        try {
            const response = await api.get("/report_types/getPosts/reportItems")
            setReportItems(response.data)
        } catch(error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchLostAndFoundContent()
    }, [])

    const handleWitnessClick = (itemId: string) => {
        // Toggle witness click state
        setWitnessClicks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }

    const handleCommentClick = (comments: any[]) => {
        setModalData(comments);
        setSelectedModal({ type: "comments", itemId: "" });
    }

    const closeModal = () => {
        setSelectedModal(null);
        setModalData([]);
    }

    const handleSaveClick = (itemId: string) => {
        setSavedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }


    return (
        <div className="w-full max-w-4xl mx-auto">
            {reportItems.map((item) => (
                <div key={item._id} className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200 mx-auto">
                   
                     {/* HEADER */}
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                            {item.image ? (
                                <img 
                                    src={item.image} 
                                    alt={item.postedBy}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={20} className="text-white" />
                            )}
                        </div>
                        <div>
                        <p className="font-semibold">{item.postedBy || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                    </div>

                    <span
                        className={`px-3 py-1 rounded-lg text-sm text-white ${
                        item.reportType === "Lost" ? "bg-red-400" : "bg-green-400"
                        }`}
                    >
                        {item.reportType}
                    </span>
                    </div>

                    {/* IMAGE */}
                    <div className="w-full h-56 bg-gray-200 rounded-lg mt-4 mb-4 flex items-center justify-center">
                    {item.image ? (
                        <img
                        src={item.image}
                        alt="item"
                        className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <span className="text-gray-500">No Image</span>
                    )}
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-3">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Item name:</p>
                        <p className="font-medium text-lg text-black">{item.itemName}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm font-medium">Description:</p>
                        <p className="text-base text-black">{item.description}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm font-medium">Contact:</p>
                        <p className="text-base text-black">{item.contactDetails}</p>
                    </div>
                    </div>

                    {/* LOCATION + TIME */}
                    <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                        <MapPin size={18} className="text-red-500" /> {item.locationDetails}
                    </p>

                    <p className="flex items-center gap-2 text-sm">
                        <Clock size={18} className="text-black" />
                        {new Date(item.dateLostOrFound).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        month: "short",
                        day: "numeric",
                        })}
                    </p>
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between text-gray-600 mt-5 border-t pt-3 text-sm">
                    <button onClick={() => handleWitnessClick(item._id)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition text-gray-600">
                        <Eye size={16} fill={witnessClicks.has(item._id) ? "currentColor" : "none"} style={{color: witnessClicks.has(item._id) ? "#fbbf24" : "inherit"}} /> {item.witnesses?.length} Witness
                    </button>

                    <button onClick={() => handleCommentClick(item.comments)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
                        <MessageCircle size={16} /> {item.comments?.length} comments
                    </button>

                    <button onClick={() => handleSaveClick(item._id)} className={`flex items-center gap-1 transition ${savedItems.has(item._id) ? "text-yellow-500" : "text-gray-600 hover:text-yellow-600"}`}>
                        {savedItems.has(item._id) ? (
                            <>
                                <BookmarkCheck size={16} fill="currentColor" /> Saved
                            </>
                        ) : (
                            <>
                                <Bookmark size={16} /> Save
                            </>
                        )}
                    </button>
                    </div>
                </div>
                ))}

            {/* MODAL - COMMENTS ONLY */}
            {selectedModal && selectedModal.type === "comments" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-96 overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Comments</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {modalData.length > 0 ? (
                                <div className="space-y-3">
                                    {modalData.map((item, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-700">{JSON.stringify(item)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-8">
                                    No comments yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
            );
}
