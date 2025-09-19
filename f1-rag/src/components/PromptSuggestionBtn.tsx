type Props = {
    text: string;
    onClick: () => void;
}

export default function PromptSuggestionBtn({text, onClick}: Props) {
    return(
        <button 
            onClick={onClick}
            className="px-4 py-2 m-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            {text}
        </button>
    )
}