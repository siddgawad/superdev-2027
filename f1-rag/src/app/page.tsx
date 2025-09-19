"use client"
import { useState } from 'react';
import Navbar from "@/components/Nav";
import PromptSuggestionRow from '@/components/PromptSuggestionsRow';
import LoadingBubble from '@/components/LoadingBubble';
import Bubble from '@/components/Bubble';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
}

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handlePromptClick = (promptText: string) => {
        const userMessage: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        handleF1Query(promptText);
    };

    const handleF1Query = async (query: string) => {
        console.log("🚀 Starting F1 query:", query);
        setLoading(true);
        
        try {
            const userMessage: Message = {
                id: crypto.randomUUID(),
                content: query,
                role: "user"
            };

            console.log("📤 Sending request to /api/chat");
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                }),
            });

            console.log("📥 Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ API Error:", errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            if (!response.body) {
                throw new Error("No response body received");
            }

            // Create assistant message
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                content: '',
                role: "assistant"
            };

            // Add the empty assistant message
            setMessages(prev => [...prev, assistantMessage]);

            // Use the ReadableStream directly with AI SDK format parsing
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("✅ Stream completed, final content:", assistantContent);
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    console.log("📦 Raw chunk:", chunk);
                    
                    // AI SDK format: each line starts with "0:" followed by JSON
                    const lines = chunk.split('\n').filter(line => line.trim());
                    
                    for (const line of lines) {
                        console.log("🔍 Processing line:", line);
                        
                        // AI SDK streaming format: "0:"{...json...}""
                        if (line.startsWith('0:')) {
                            try {
                                // Extract the JSON part after "0:"
                                const jsonStr = line.substring(2);
                                console.log("📊 Extracted JSON string:", jsonStr);
                                
                                // Parse the JSON
                                const data = JSON.parse(jsonStr);
                                console.log("📊 Parsed data:", data);
                                
                                // Check for text delta
                                if (data.type === 'text-delta' && data.textDelta) {
                                    assistantContent += data.textDelta;
                                    console.log("✅ Added text delta:", data.textDelta);
                                    console.log("📝 Current content length:", assistantContent.length);
                                    
                                    // Update the UI immediately
                                    setMessages(prev => 
                                        prev.map(msg => 
                                            msg.id === assistantMessage.id 
                                                ? { ...msg, content: assistantContent }
                                                : msg
                                        )
                                    );
                                }
                                // Handle other types of messages
                                else if (data.type === 'finish') {
                                    console.log("🏁 Stream finished");
                                }
                                else {
                                    console.log("ℹ️ Other data type:", data.type);
                                }
                                
                            } catch (parseError) {
                                console.log("❌ JSON parse error:", parseError);
                                console.log("❌ Failed line:", line);
                            }
                        }
                        // Handle any other formats
                        else if (line.trim().startsWith('{')) {
                            try {
                                const data = JSON.parse(line.trim());
                                if (data.textDelta) {
                                    assistantContent += data.textDelta;
                                    setMessages(prev => 
                                        prev.map(msg => 
                                            msg.id === assistantMessage.id 
                                                ? { ...msg, content: assistantContent }
                                                : msg
                                        )
                                    );
                                }
                            } catch (e) {
                                console.log("❌ Alternative parse failed:", e);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }

            // Final update to ensure content is displayed
            console.log("🏁 Final assistant content:", assistantContent);
            if (assistantContent) {
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === assistantMessage.id 
                            ? { ...msg, content: assistantContent }
                            : msg
                    )
                );
            } else {
                console.log("⚠️ No content received, adding debug message");
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === assistantMessage.id 
                            ? { ...msg, content: "Debug: No content was parsed from the stream. Check browser console for details." }
                            : msg
                    )
                );
            }
            
        } catch (error) {
            console.error('💥 API Error:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Please try again.'}`,
                role: "assistant"
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            console.log("🏁 Query completed");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!input.trim()) return;
        
        const userMessage: Message = {
            id: crypto.randomUUID(),
            content: input,
            role: "user"
        };
        
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        
        await handleF1Query(currentInput);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
                {messages.length === 0 ? (
                    <div className="text-center mt-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Ultimate Page for Formula One Super Fans!
                        </h2>
                        <p className="text-gray-600 mb-8">Ask f1GPT Anything.</p>
                        <PromptSuggestionRow onPromptClick={handlePromptClick} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => 
                            <Bubble key={`message-${index}`} message={message} />
                        )}
                        {loading && <LoadingBubble />}
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <input 
                                onChange={handleInputChange} 
                                value={input} 
                                placeholder="Ask anything about Formula 1..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                disabled={loading}
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !input.trim()}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}