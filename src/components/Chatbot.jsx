import { useState, useRef, useEffect } from "react";

export default function Chatbot() {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // BACKEND URL

  const BASE_URL = "http://localhost:8080";

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  const sendMessage = async () => {

    if (!input.trim()) return;

    // USER MESSAGE

    const userMessage = {

      id: Date.now(),

      text: input,

      sender: "user",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {

      // CONNECT TO SPRING BOOT BACKEND

      const response = await fetch(
        `${BASE_URL}/ask-ai?prompt=${encodeURIComponent(currentInput)}`
      );

      if (!response.ok) {
        throw new Error(
          `Backend error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.text();

      // BOT RESPONSE

      const botMessage = {

        id: Date.now() + 1,

        text: data,

        sender: "bot",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      const errorMessage = {

        id: Date.now() + 1,

        text:
          `Error: ${error.message}. Make sure backend is running on http://localhost:8080`,

        sender: "bot",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {

      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();
    }
  };

  const clearChat = () => {

    setMessages([]);
  };

  return (

    <div className="card">

      <div className="card-title">
        💬 AI Chatbot
      </div>

      <p className="card-subtitle">
        Chat with our intelligent AI assistant powered by Spring AI
      </p>

      {/* CHAT MESSAGES */}

      <div className="message-container">

        {
          messages.length === 0 ? (

            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                padding: "2rem",
              }}
            >

              <p>
                Start a conversation with the AI assistant!
              </p>

            </div>

          ) : (

            messages.map((msg) => (

              <div
                key={msg.id}
                className={`message ${msg.sender}`}
              >

                <strong>

                  {
                    msg.sender === "user"
                      ? "You"
                      : "AI Assistant"
                  }

                  :

                </strong>

                <p
                  style={{
                    marginTop: "0.5rem",
                    wordWrap: "break-word",
                  }}
                >

                  {msg.text}

                </p>

              </div>

            ))
          )
        }

        {
          loading && (

            <div className="message system">

              <span className="spinner"></span>

              <span
                style={{
                  marginLeft: "0.5rem",
                }}
              >

                AI is thinking...

              </span>

            </div>

          )
        }

        <div ref={messagesEndRef} />

      </div>

      {/* INPUT AREA */}

      <div
        style={{
          marginTop: "1.5rem",
        }}
      >

        <div className="form-group">

          <textarea
            className="form-textarea"
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyPress={handleKeyPress}
            disabled={loading}
          ></textarea>

        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >

          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={
              loading ||
              !input.trim()
            }
          >

            {
              loading ? (

                <>

                  <span className="spinner"></span>

                  {" "}Sending...

                </>

              ) : (

                <>📤 Send Message</>

              )
            }

          </button>

          <button
            className="btn btn-secondary"
            onClick={clearChat}
            disabled={
              loading ||
              messages.length === 0
            }
          >

            🗑️ Clear Chat

          </button>

        </div>

      </div>

    </div>
  );
}