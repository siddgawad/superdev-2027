import PromptSuggestionBtn from "./PromptSuggestionBtn"

type Props = {
    onPromptClick: (prompt: string) => void;
}

export default function PromptSuggestionRow({onPromptClick}: Props) {
    const prompts = [
        "Who is current f1 WDC?",
        "Who is Ferrari's new driver?",
        "Who is the highest paid f1 driver?"
    ]
    
    return(
        <div className="flex flex-wrap justify-center">
            {prompts.map((prompt, index) => 
                <PromptSuggestionBtn 
                    key={`suggestion-${index}`} 
                    text={prompt} 
                    onClick={() => onPromptClick(prompt)} 
                />
            )}
        </div>
    )
}