import { User, MapPin, Clock, MessageCircle, Users, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import SaveButton from "./saveButton";
import WitnessButton from "./witness";
import WitnessModal from "./witnessModal";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Modal from "../../components/modal";
import Button from "../../components/button"

// --- Helper: Format Time ---
const timeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
};

// --- Types ---
interface UserProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink: string;
}

// Structure for the fetched detail list
interface WitnessData {
  user: UserProfile;
  vouchTime?: string;
  _id?: string;
}

export interface ReportItem {
  _id: string;
  reportType: "Lost" | "Found";
  itemName: string;
  description: string;
  turnOver: string;
  locationDetails: string;
  contactDetails: string;
  dateLostOrFound: string;
  image: string;
  postedBy: UserProfile | null;
  status: string;
  // Generic array because initial feed might not have full details
  witnesses: any[]; 
  comments: any[];
  createdAt: string;
  isWitnessed?: boolean;
}

interface LostFoundCardProps {
  item: ReportItem;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onCommentClick?: (comments: any[]) => void;
}

export default function LostFoundCard({
  item,
  isSaved = false,
  onToggleSave,
  onCommentClick,
}: LostFoundCardProps) {
  
  // Local state
  const [showModal, setShowModal] = useState(false);
  const [showWitnessList, setShowWitnessList] = useState(false);
  
  // State to hold the fetched detailed list
  const [witnessList, setWitnessList] = useState<WitnessData[]>([]); 
  const [isLoadingWitnesses, setIsLoadingWitnesses] = useState(false);

  const [hasWitnessed, setHasWitnessed] = useState(item.isWitnessed);
  const [witnessCount, setWitnessCount] = useState(item.witnesses?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post owner witness himself 
  const [userWitnessErrorModal, setUserWitnessErrorModal] = useState(false);
  const [userWitnessErrorMessage, setUserWitnessErrorMessage] = useState("");


  // --- 1. CHECK WITNESS STATUS (User Specific) ---
  useEffect(() => {
    const checkWitnessStatus = async () => {
      try {
        const response = await api.get(`/report_types/${item._id}/witnesses`);
        if (response.status === 200) {
           setHasWitnessed(response.data.isWitness);
        }
      } catch (error) {
        console.error("Error fetching witness status:", error);
      }
    };
    checkWitnessStatus();
  }, [item._id]);

  // --- 2. FETCH WITNESS LIST (Lazy Load) ---
  const handleToggleWitnessList = async () => {
    // If we are opening the list AND we haven't fetched data yet
    if (!showWitnessList && witnessList.length === 0) {
        setIsLoadingWitnesses(true);
        try {
            // Call the NEW independent controller
            const response = await api.get(`/report_types/${item._id}/witness-list`);
            if (response.status === 200) {
                setWitnessList(response.data);
            }
        } catch (error) {
            console.error("Failed to load witness list", error);
        } finally {
            setIsLoadingWitnesses(false);
        }
    }
    // Toggle the view
    setShowWitnessList(!showWitnessList);
  };

  // --- 3. SUBMIT WITNESS ACTION ---
  const handleWitnessSubmit = async () => {
    if (hasWitnessed) return; 
    setIsSubmitting(true);

    try {
      const response = await api.post(`/report_types/${item._id}/witnesses`);
      if (response.status === 200) {
        setHasWitnessed(true);
        setWitnessCount((prev) => prev + 1);
        // Clear list so it refetches next time or manually add self (optional)
        setWitnessList([]); 
        setShowModal(false);
      }
    } catch (error: any) {

      if(error.response?.status === 400 && error.response?.data?.message === "You cannot witness your own report.")
        {
          setUserWitnessErrorModal(true);
          setUserWitnessErrorMessage("You cannot witness your own report");
          return
        }

      console.error("Witness submission failed:", error);
      alert(error.response?.data?.message || "Failed to submit witness statement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const posterName = item.postedBy 
    ? `${item.postedBy.firstname} ${item.postedBy.lastname}` 
    : "Unknown User";

  const avatarSrc = item.postedBy?.profileLink;

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200 mx-auto hover:shadow-lg transition-shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} className="w-full h-full object-cover" alt="user avatar" />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{posterName}</p>
            <p className="text-xs text-gray-500">
              {item.createdAt ? timeAgo(item.createdAt) : "Just now"}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium text-white ${item.reportType === "Lost" ? "bg-red-400" : "bg-green-400"}`}>
          {item.reportType}
        </span>
      </div>

      {/* MAIN IMAGE */}
      <div className="w-full h-56 bg-gray-100 rounded-lg mt-4 mb-4 flex items-center justify-center border border-gray-100 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt="item" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-gray-400 text-sm">No Image Available</span>
        )}
      </div>

      {/* DETAILS */}
      <div className="space-y-3">
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Item name</p>
          <p className="text-sm sm:text-base font-semibold text-gray-800">{item.itemName}</p>
        </div>
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Description</p>
          <p className="text-sm text-gray-700">{item.description}</p>
        </div>
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Contact</p>
          <p className="text-sm font-medium text-blue-600">{item.contactDetails}</p>
        </div>
      </div>

      {/* LOCATION + TIME */}
      <div className="space-y-3 mt-3">
        <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg flex items-center gap-3">
          <MapPin className="text-red-500 w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Location</p>
            <p className="font-medium text-sm">{item.locationDetails}</p>
          </div>
        </div>
        <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Date</p>
            <p className="font-medium text-sm">
              {new Date(item.dateLostOrFound).toLocaleString("en-US", { hour: "numeric", minute: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* --- SEE WITNESSES TOGGLE (Lazy Load) --- */}
      {witnessCount > 0 && (
        <div className="mt-4 mb-2">
            <button 
                disabled={isSubmitting}
                onClick={handleToggleWitnessList}
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Users size={16} />
                {showWitnessList ? "Hide Witnesses" : `See ${witnessCount} Witnesses`}
                {showWitnessList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* WITNESS LIST DROPDOWN */}
            {showWitnessList && (
                <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto border border-gray-100 shadow-inner custom-scrollbar">
                    {isLoadingWitnesses ? (
                        <div className="flex justify-center py-2">
                             <Loader2 size={20} className="animate-spin text-gray-400" />
                        </div>
                    ) : (
                        witnessList.map((witness, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    {witness.user?.profileLink ? (
                                        <img src={witness.user.profileLink} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                            <User size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                {/* Details */}
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-800">
                                        {witness.user ? `${witness.user.firstname} ${witness.user.lastname}` : "Unknown User"}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                        Vouched {timeAgo(witness.vouchTime || new Date().toISOString())}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
      )}

      {/* --- FOOTER --- */}
      <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <WitnessButton 
          witnessCount={witnessCount}
          isWitnessed={hasWitnessed}
          onToggle={() => { if (!hasWitnessed) setShowModal(true); }}
        />
        <button
          onClick={() => onCommentClick?.(item.comments)}
          className="flex flex-col items-center group transition"
        >
          <MessageCircle size={20} className="text-gray-500 group-hover:text-blue-500 transition" />
          <span className="text-xs mt-1 font-semibold text-gray-500 group-hover:text-blue-600">
            {item.comments?.length || 0} Comments
          </span>
        </button>
        <SaveButton
            postId={item._id}
            postType="report"
            initialIsSaved={isSaved}
            onToggle={() => onToggleSave?.(item._id)}
        />
      </div>
      
      {/* MODAL */}
      {showModal && (
        <WitnessModal onClose={() => setShowModal(false)} onProceed={handleWitnessSubmit} />
      )}

      {userWitnessErrorModal && (
        <Modal>
          {userWitnessErrorMessage}

          <div
            className="mt-2"
          >
            <Button 
              type="button"
              buttonText="Close"
              onClick={() => setUserWitnessErrorModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}