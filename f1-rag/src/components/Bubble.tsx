type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
}

type Props = {
    message: Message;
}

export default function Bubble({message}: Props) {
    const {content, role} = message;
    
    console.log(`Rendering ${role} message:`, content); // Debug log
    
    return(
        <div className={`p-4 m-2 rounded-lg border ${
            role === 'user' 
                ? 'bg-blue-100 border-blue-200 ml-auto max-w-lg' 
                : 'bg-gray-100 border-gray-200 mr-auto max-w-2xl'
        }`}>
            <div className="text-xs text-gray-600 mb-2 font-medium">
                {role === 'user' ? 'You' : 'F1GPT'}
            </div>
            <div className="text-sm text-gray-800">
                {content || <span className="text-red-500">No content</span>}
            </div>
            {/* Debug info */}
            <div className="text-xs text-gray-400 mt-2">
                ID: {message.id.slice(0, 8)}... | Length: {content?.length || 0}
            </div>
        </div>
    )
}