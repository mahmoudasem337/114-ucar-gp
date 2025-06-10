import React, { useState, KeyboardEvent, FormEvent } from "react";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",apiKey:"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"
});

interface Message {
  text: string;
  sender: "user" | "bot";
  time: string;
}

const Chatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]); 
  const [message, setMessage] = useState<string>("");

  const toggleChat = (): void => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    try {
      const aiMsg = await llm.invoke([
        {
          role: "system",
          content:
            "You are a helpful assistant in cars shop.",
        },
        { role: "user", content: newMessage.text },
      ]);
      console.log(aiMsg.content); // Log the AI response for debugging

      const botReply: Message = {
        text: aiMsg.content || "I'm sorry, I couldn't process that.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorReply: Message = {
        text: "There was an error processing your request. Please try again later.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prevMessages) => [...prevMessages, errorReply]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chatbox-wrapper">
    <div className="chatbox-toggle" onClick={toggleChat}>
      <i className="ri-message-2-line"></i>
    </div>
  
    <div className={`chatbox-message-wrapper ${isOpen ? "show" : ""}`}>
      <div className="chatbox-message-header">
        <div className="chatbox-message-profile">
          <div>
            <h4 className="chatbox-message-name">UCAR</h4>
            <p className="chatbox-message-status">online</p>
          </div>
        </div>
      </div>
  
      <div className="chatbox-message-content">
        {messages.length === 0 ? (
          <h4 className="chatbox-message-no-message">You don't have a message yet!</h4>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chatbox-message-item ${msg.sender === "user" ? "sent" : "received"}`}>
              <span className="chatbox-message-item-text">{msg.text}</span>
              <span className="chatbox-message-item-time">{msg.time}</span>
            </div>
          ))
        )}
      </div>
  
      <div className="chatbox-message-bottom">
        <form onSubmit={handleSendMessage} className="chatbox-message-form">
          <textarea
            rows={1}
            placeholder="Type message..."
            className="chatbox-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button type="submit" className="chatbox-message-submit">
            <i className="ri-send-plane-2-line"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default Chatbox;
