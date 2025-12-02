import Modal from "../../modal"; // Your existing Modal component
import Button from "../../button"; // Your existing Button component
import { Calendar, MapPin, BookOpen, User } from "lucide-react"; // Icons for data points

// 1. Define the Data Shapes matching your Models
interface BasePost {
  _id: string;
  image: string;
  createdAt: string;
  // We don't strictly need postedBy/organization here if they are displayed in the header
  // but we include them if needed for the detail view
}

interface EventData extends BasePost {
  eventName: string;
  location: string;
  course: string;
  openTo: string;
  startDate: string;
  endDate: string;
  type: "event"; // From Mongoose default
}

interface AcademicData extends BasePost {
  title: string;
  content: string;
  type: "academic"; // From Mongoose default
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EventData | AcademicData | null; // It can be either
  type: string; // "Event" or "Academic" (from referenceModel)
}

// Helper to format dates nicely
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PostDetailModal({ isOpen, onClose, data, type }: PostDetailModalProps) {
  if (!isOpen || !data) return null;

  // Type Guard to check if it's an Event
  const isEvent = type === "Event" || (data as EventData).eventName !== undefined;

  return (
    <Modal
      cardContainerDesign="bg-white shadow-2xl rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        
        {/* === HEADER: IMAGE === */}
        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={data.image} 
            alt="Post Cover" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* === BODY: CONTENT === */}
        <div className="flex flex-col gap-2">
            {/* Title / Name */}
            <h2 className="text-2xl font-bold text-gray-900">
                {isEvent ? (data as EventData).eventName : (data as AcademicData).title}
            </h2>

            {/* Type Badge */}
            <span className={`
                inline-block w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${isEvent ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}
            `}>
                {isEvent ? "Event" : "Academic Post"}
            </span>

            {/* === CONDITIONAL RENDERING BASED ON MODEL === */}
            {isEvent ? (
                // --- EVENT SPECIFIC FIELDS ---
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-red-500" />
                        <span className="font-semibold">Location:</span> {(data as EventData).location}
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-500" />
                        <span className="font-semibold">Course:</span> {(data as EventData).course}
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={18} className="text-green-500" />
                        <span className="font-semibold">Open To:</span> {(data as EventData).openTo}
                    </div>
                    
                    <div className="col-span-2 bg-gray-50 p-3 rounded-md border border-gray-100 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={18} className="text-purple-500" />
                            <span className="font-bold">Schedule</span>
                        </div>
                        <p>Start: {formatDate((data as EventData).startDate)}</p>
                        <p>End: {formatDate((data as EventData).endDate)}</p>
                    </div>
                </div>
            ) : (
                // --- ACADEMIC SPECIFIC FIELDS ---
                <div className="mt-4">
                     <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {(data as AcademicData).content}
                     </p>
                </div>
            )}
        </div>

        {/* === FOOTER === */}
        <div className="mt-6 flex justify-end">
          <Button 
            type="button" 
            buttonText="Close" 
            onClick={onClose} 
            buttonContainerDesign="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
}