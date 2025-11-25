// FIXED: Removed unused import 'React' to resolve error 6133

// Define the shape and types of the props
interface ErrorMessageProps {
    message: string;
    onRefetch: () => void; 
}

// FIXED: Removed explicit return type to resolve "Cannot find namespace 'JSX'" error (2503)
export function ErrorMessage({ message, onRefetch }: ErrorMessageProps) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative shadow-md" role="alert">
            <strong className="font-bold mr-2">System Alert:</strong>
            <span className="block sm:inline">{message}</span>
            <button 
                onClick={onRefetch} 
                className="ml-4 bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded text-sm transition duration-150 ease-in-out"
                aria-label="Retry data fetching"
            >
                Retry Fetch
            </button>
        </div>
    );
}