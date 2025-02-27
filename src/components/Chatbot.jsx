import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const Chatbot= () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "You are an educational chatbot." }, 
                     { role: "user", content: input }],
          max_tokens: 150,
        },
        {
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        }
      );

      const botMessage = { text: response.data.choices[0].message.content, sender: "bot" };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...messages, userMessage, { text: "Sorry, I couldn't process that request.", sender: "bot" }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-80 h-96 bg-white shadow-lg border border-gray-200 rounded-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">EduBot</span>
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg max-w-[75%] ${msg.sender === "bot" ? "bg-gray-200" : "bg-blue-500 text-white self-end ml-auto"}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="border-t flex p-2 bg-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg outline-none"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r-lg">
              ➤
            </button>
          </div>
        </motion.div>
      )}

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
};

export default Chatbot;
