export default function LoadingBubble() {
    return(
        <div className="p-3 m-2 rounded-lg bg-gray-100 mr-auto max-w-xs">
            <div className="text-sm text-gray-600 mb-1">F1GPT</div>
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    )
}