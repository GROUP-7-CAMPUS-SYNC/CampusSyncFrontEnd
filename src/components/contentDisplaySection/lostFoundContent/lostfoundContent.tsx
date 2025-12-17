import {
  User,
  MapPin,
  Clock,
  MessageCircle,
  Users,
  ChevronDown,
  Loader2,
  XCircleIcon
} from "lucide-react";
import SaveButton from "../saveButton";
import WitnessButton from "../witness";
import WitnessModal from "./witnessModal";
import { useEffect, useState, useRef } from "react";
import api from "../../../api/api";
import Modal from "../../modal";
import Button from "../../button";
import PostOptionDropDown from "./postOptionDropdown";
import ChatInitiationModal from "./chatInitiationModal";
import SelfChatErrorModal from "./SelfChatErrorModal";
import ReportForm from "../../../pages/lost&found/formPost/index"; // Imported the Form

// --- Helper: Format Time ---
const timeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface UserProfile {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  profileLink: string;
}

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
  const [showModal, setShowModal] = useState(false);
  const [showWitnessList, setShowWitnessList] = useState(false);
  const [witnessList, setWitnessList] = useState<WitnessData[]>([]);
  const [isLoadingWitnesses, setIsLoadingWitnesses] = useState(false);
  const [hasWitnessed, setHasWitnessed] = useState(item.isWitnessed);
  const [witnessCount, setWitnessCount] = useState(item.witnesses?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userWitnessErrorModal, setUserWitnessErrorModal] = useState(false);
  const [userWitnessErrorMessage, setUserWitnessErrorMessage] = useState("");

  // Dropdown state
  const [userClickDropDown, setUserClickDropDown] = useState<boolean>(false);

  // 2. Chat Modal State
  const [showChatModal, setShowChatModal] = useState(false);
  const [isNotValidChat, setIsNotValidChat] = useState<boolean>(false);

  // Response Api modal state
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // NEW: Update Modal State
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Ref to track the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside Logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserClickDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- CHECK WITNESS STATUS ---
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

  // --- FETCH WITNESS LIST ---
  const handleToggleWitnessList = async () => {
    if (!showWitnessList && witnessList.length === 0) {
      setIsLoadingWitnesses(true);
      try {
        const response = await api.get(
          `/report_types/${item._id}/witness-list`
        );
        if (response.status === 200) {
          setWitnessList(response.data);
        }
      } catch (error) {
        console.error("Failed to load witness list", error);
      } finally {
        setIsLoadingWitnesses(false);
      }
    }
    setShowWitnessList(!showWitnessList);
  };

  // --- SUBMIT WITNESS ACTION ---
  const handleWitnessSubmit = async () => {
    if (hasWitnessed) return;
    setIsSubmitting(true);
    try {
      const response = await api.post(`/report_types/${item._id}/witnesses`);
      if (response.status === 200) {
        setHasWitnessed(true);
        setWitnessCount((prev) => prev + 1);
        setWitnessList([]);
        setShowModal(false);
      }
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "You cannot witness your own report."
      ) {
        setUserWitnessErrorModal(true);
        setUserWitnessErrorMessage("You cannot witness your own report");
        return;
      }
      console.error("Witness submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUserChat = async () => {
    if (item.postedBy?.email === localStorage.getItem("email")) {
      setIsNotValidChat(true);
    }
    else {
      setUserClickDropDown(false); // Close the menu
      setShowChatModal(true);      // Open the modal
    }
  }

  const deletePost = async () => {
    try {
      const response = await api.delete(`/report_types/delete/${item._id}`);

      if (response.status === 200) {
        window.location.reload();
      }
    }
    catch (error: any) {
      setErrorMessage(error.response.data.message);
      setErrorModal(true);
    }
  }

  const posterName = item.postedBy
    ? `${item.postedBy.firstname} ${item.postedBy.lastname}`
    : "Unknown User";

  const avatarSrc = item.postedBy?.profileLink;

  return (
    <div className="w-full bg-white shadow-sm sm:rounded-xl p-5 mb-0.5 sm:mb-5 mx-auto ">
      {/* HEADER */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                className="w-full h-full object-cover"
                alt="user avatar"
              />
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

        <div className="flex items-center gap-4">
          {/* Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-gray-500 cursor-pointer hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setUserClickDropDown(!userClickDropDown)}
            >
              •••
            </button>

            {/* Dropdown Logic */}
            {userClickDropDown && (
              <PostOptionDropDown
                onClose={() => setUserClickDropDown(false)}
                onChatClick={() => validateUserChat()}
                onDeleteClick={() => deletePost()}
                // 1. CONNECT UPDATE CLICK
                onUpdateClick={() => setShowUpdateModal(true)}
              />
            )}
          </div>

          <span
            className={`px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium text-white ${item.reportType === "Lost" ? "bg-red-700" : "bg-green-700"
              }`}
          >
            {item.reportType}
          </span>
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div className="w-full bg-gray-100 rounded-lg mt-4 mb-4 border overflow-hidden border-gray-100 max-h-[500px] flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt="item"
            className="object-contain w-full max-h-[400px]"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image Available</span>
        )}
      </div>

      {/* DETAILS */}
      <div className="space-y-3">
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">
            Item name
          </p>
          <p className="text-sm sm:text-base font-semibold text-gray-800">
            {item.itemName}
          </p>
        </div>
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">
            Description
          </p>
          <p className="text-sm text-gray-700">{item.description}</p>
        </div>
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">
            Contact
          </p>
          <p className="text-sm font-medium text-blue-600">
            {item.contactDetails}
          </p>
        </div>

        {item.reportType === "Found" && (
          <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
            <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">
              Turn Over
            </p>
            <p className="text-sm font-medium text-gray-700">
              {item.turnOver}
            </p>
          </div>
        )}
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
              {new Date(item.dateLostOrFound).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* WITNESS TOGGLE */}
      <div className="flex flex-row justify-between mt-4 mb-2 ">
        {witnessCount > 0 ? (
          <button
            disabled={isSubmitting}
            onClick={handleToggleWitnessList}
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-800 transition-all duration-200 cursor-pointer"
          >
            <Users size={20} />
            {showWitnessList
              ? "Hide Witnesses"
              : `See ${witnessCount} Witnesses`}
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${showWitnessList ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={() => onCommentClick?.(item.comments)}
          className="flex justify-end text-sm sm:text-base cursor-pointer text-gray-500 hover:text-black"
        >
          {item.comments?.length || 0} Comments
        </button>
      </div>

      {/* WITNESS LIST */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out mt-0 ${showWitnessList
          ? "max-h-48 mt-2 opacity-100 p-3"
          : "max-h-0 mt-0 opacity-0"
          } bg-gray-50 rounded-lg space-y-3 border border-gray-100 shadow-inner custom-scrollbar`}
      >
        {isLoadingWitnesses ? (
          <div className="flex justify-center py-2">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : (
          witnessList.map((witness, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {witness.user?.profileLink ? (
                  <img
                    src={witness.user.profileLink}
                    className="w-full h-full object-cover"
                    alt="witness avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-gray-800">
                  {witness.user
                    ? `${witness.user.firstname} ${witness.user.lastname}`
                    : "Unknown User"}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500">
                  Vouched{" "}
                  {timeAgo(witness.vouchTime || new Date().toISOString())}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <hr className="border-gray-200"></hr>

      {/* FOOTER */}
      <div className="flex items-center gap-x-5 sm:gap-x-0 sm:justify-around pt-4 text-gray-600">
        <WitnessButton
          witnessCount={witnessCount}
          isWitnessed={hasWitnessed}
          onToggle={() => {
            if (!hasWitnessed) setShowModal(true);
          }}
        />
        <button
          onClick={() => onCommentClick?.(item.comments)}
          className="flex flex-row gap-x-2 items-center group cursor-pointer"
        >
          <MessageCircle className="text-gray-500 group-hover:text-black" />
          <span className="text-s mt-1 font-semibold text-gray-500 group-hover:text-black hidden sm:inline">
            Comments
          </span>
        </button>
        <SaveButton
          postId={item._id}
          postType="report"
          initialIsSaved={isSaved}
          onToggle={() => onToggleSave?.(item._id)}
        />
      </div>

      {/* --- 2. RENDER UPDATE FORM MODAL --- */}
      {showUpdateModal && (
        <ReportForm
          onClose={() => window.location.reload()}
          initialData={{
            _id: item._id,
            reportType: item.reportType,
            itemName: item.itemName,
            description: item.description,
            turnOver: item.turnOver,
            locationDetails: item.locationDetails,
            contactDetails: item.contactDetails,
            dateLostOrFound: item.dateLostOrFound,
            image: item.image
          }}
        />
      )}

      {/* --- MODALS --- */}
      {showModal && (
        <WitnessModal
          onClose={() => setShowModal(false)}
          onProceed={handleWitnessSubmit}
        />
      )}
      {userWitnessErrorModal && (
        <Modal>
          {userWitnessErrorMessage}
          <div className="mt-2">
            <Button
              type="button"
              buttonText="Close"
              onClick={() => setUserWitnessErrorModal(false)}
            />
          </div>
        </Modal>
      )}

      {/* 4. Render the Chat Modal */}
      {showChatModal && (
        <ChatInitiationModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          poster={item.postedBy}
        />
      )}

      {isNotValidChat && (
        <SelfChatErrorModal
          isOpen={isNotValidChat}
          onClose={() => setIsNotValidChat(false)}
        />
      )}

      {errorModal && (
        <Modal>
          <div className="text-center flex flex-col items-center justify-center p-4">
            <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {errorMessage}
            </h2>
            <Button type="button" buttonText="Close" onClick={() => setErrorModal(false)} />
          </div>
        </Modal>
      )
      }
    </div>
  );
}