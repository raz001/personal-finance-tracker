import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MessageCircle, MessageCircleOff, Send, Trash2 } from "lucide-react";
import { addMessage, clearChat, sendChatMessage } from "../features/chat/chatSlice.js";

const SUGGESTIONS = [
  "What's my biggest expense this month?",
  "Which category should I cut back on?",
  "How does my spending look overall?",
  "What's my average spend per transaction?"
];

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-surface-2 border border-border rounded-lg rounded-bl-sm px-[0.9rem] py-[0.65rem] max-w-[82%]">
      <span className="inline-flex items-center gap-1 py-[0.1rem]">
        <span className="fc-typing-dot" />
        <span className="fc-typing-dot" />
        <span className="fc-typing-dot" />
      </span>
    </div>
  </div>
);

const MessageBubble = ({ message }) => (
  <div className={`flex mb-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`rounded-lg max-w-[82%] px-[0.9rem] py-[0.65rem] ${
        message.role === "user"
          ? "bg-primary text-white rounded-br-sm"
          : "bg-surface-2 border border-border text-text-base rounded-bl-sm"
      }`}
    >
      <p className="text-[0.9rem] leading-[1.55] m-0 mb-[0.3rem] whitespace-pre-wrap break-words">
        {message.content}
      </p>
      <span className={`block text-[0.68rem] opacity-65 ${message.role === "user" ? "text-right" : "text-left"}`}>
        {formatTime(message.timestamp)}
      </span>
    </div>
  </div>
);

const iconBtn = "flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]";

const FinanceChat = ({ expenses, month, year, onClose }) => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll the messages container itself — not the whole page
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const submit = async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };
    dispatch(addMessage(userMessage));
    setInput("");

    const allMessages = [...messages, userMessage].map(({ role, content: c }) => ({ role, content: c }));

    try {
      await dispatch(sendChatMessage({ messages: allMessages, expenses, month, year })).unwrap();
    } catch {
      // Error surfaced via useEffect above
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); }
  };

  return (
    <section className="bg-surface border border-border rounded-lg shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-[160ms] h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-[1.1rem]">
        <div className="flex flex-col gap-[0.15rem]">
          <span className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase">
            <MessageCircle size={11} />
            Gemini AI
          </span>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] m-0">Chat with your finances</h2>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button type="button" className={iconBtn} onClick={() => dispatch(clearChat())} title="Clear chat" aria-label="Clear chat">
              <Trash2 size={15} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className={iconBtn}
              onClick={onClose}
              title="Close chat"
              aria-label="Close chat"
            >
              <MessageCircleOff size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="fc-messages flex-1 h-[320px] overflow-y-auto p-4 px-5"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full text-text-muted text-center p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft text-primary">
              <MessageCircle size={22} />
            </div>
            <p className="text-text-base text-[0.95rem] font-semibold m-0">Ask me about your spending</p>
            <p className="text-[0.85rem] m-0">I have full context of your expenses this month.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  disabled={loading}
                  className="bg-surface-2 border border-border rounded-full text-text-base text-[0.78rem] font-medium px-[0.85rem] py-[0.35rem] hover:bg-primary-soft hover:border-primary/30 hover:text-primary transition-colors duration-[160ms] disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
            {loading && <TypingIndicator />}
          </>
        )}
      </div>

      {/* Input footer */}
      <div className="flex gap-2 border-t border-border px-5 py-[0.85rem]">
        <input
          ref={textareaRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your spending…"
          disabled={loading}
          aria-label="Chat input"
          className="flex-1 bg-surface-2 border border-border rounded-md text-text-base text-[0.9rem] !py-[0.55rem] !px-[0.85rem] outline-none focus:border-primary focus:shadow-glow transition-all duration-[160ms] placeholder:text-text-subtle disabled:opacity-55"
        />
        <button
          type="button"
          onClick={() => submit(input)}   
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="inline-flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-md bg-primary text-white hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-[160ms]"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="flex items-start gap-[0.35rem] border-t border-border text-text-subtle text-[0.7rem] leading-[1.5] px-5 py-[0.6rem]">
        AI responses are based on your expense data and may not always be accurate.
      </p>
    </section>
  );
};

export default FinanceChat;
