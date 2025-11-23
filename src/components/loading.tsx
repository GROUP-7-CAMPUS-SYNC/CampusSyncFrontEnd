interface LoadingProps {
    message?: string;
    className?: string;
}

export default function Loading({ message = "Loading...", className = "" }: LoadingProps) {
    return (
        <div className={`flex flex-col items-center justify-center w-full h-full min-h-[150px] ${className}`}>
            {/* Spinner using your brand blue #3B82F6 */}
            <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-3 text-sm text-gray-500 font-medium animate-pulse">
                {message}
            </span>
        </div>
    );
}