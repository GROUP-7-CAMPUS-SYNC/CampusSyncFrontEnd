import { useEffect, useState } from "react";
import api from "../../api/api";
import { X } from "lucide-react";
import LostFoundCard, { type ReportItem } from "../../components/contentDisplaySection/lostfoundContent";

interface LostAndFoundContentProps {
  searchQuery: string;
}

export default function LostAndFoundContent({ searchQuery }: LostAndFoundContentProps) {
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  // Interaction States
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [witnessClicks, setWitnessClicks] = useState<Set<string>>(new Set());
  
  // Modal States
  const [selectedModal, setSelectedModal] = useState<{
    type: "comments";
    itemId: string;
  } | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);

  // --- Handlers ---

  const handleWitnessClick = (itemId: string) => {
    setWitnessClicks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) { newSet.delete(itemId); } else { newSet.add(itemId); }
      return newSet;
    });
  };

  const handleSaveClick = (itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) { newSet.delete(itemId); } else { newSet.add(itemId); }
      return newSet;
    });
  };

  const handleCommentClick = (comments: any[]) => {
    setModalData(comments);
    setSelectedModal({ type: "comments", itemId: "" });
  };

  const closeModal = () => {
    setSelectedModal(null);
    setModalData([]);
  };

  // --- API Logic ---

  const fetchLostAndFoundContent = async () => {
    try {
      const url = searchQuery
        ? `/report_types/getPosts/reportItems?search=${encodeURIComponent(searchQuery)}`
        : "/report_types/getPosts/reportItems";

      const response = await api.get(url);

      if (response.status === 200) {
        setSearchError(false);
        const sortedData = response.data.sort((a: ReportItem, b: ReportItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReportItems(sortedData);
      }
    } catch (error) {
      console.log(error);
      setSearchError(true);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLostAndFoundContent();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- Render ---

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Search Feedback */}
      {searchError || (searchQuery && reportItems.length === 0) ? (
        <div className="flex justify-center py-10">
          <p className="font-semibold text-gray-500">No items found matching "{searchQuery}".</p>
        </div>
      ) : (
        <>
          {reportItems.map((item) => (
            <LostFoundCard
              key={item._id}
              item={item}
              isSaved={savedItems.has(item._id)}
              isWitnessed={witnessClicks.has(item._id)}
              onToggleSave={handleSaveClick}
              onToggleWitness={handleWitnessClick}
              onCommentClick={handleCommentClick}
            />
          ))}
        </>
      )}

      {/* MODAL (Unchanged) */}
      {selectedModal && selectedModal.type === "comments" && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Comments</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {modalData.length > 0 ? (
                <div className="space-y-3">
                  {modalData.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-700">
                        {JSON.stringify(item)}
                      </p>
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