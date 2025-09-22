import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { activeChatState, chatLoadingState, viewState } from '../recoil/atmos';
import { sendMessageToAgent } from '../api/api';

const ChatScreen = () => {
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);
  const [chatLoading, setChatLoading] = useRecoilState(chatLoadingState);
  const setView = useSetRecoilState(viewState);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;

    const userMessage = { role: 'user', content: inputMsg };
    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    setChatLoading(true);
    setInputMsg('');

    try {
      const response = await sendMessageToAgent(activeChat.agentId, userMessage.content);
      const agentMessage = { role: 'agent', content: response.reply };
      setActiveChat((prev) => ({
        ...prev,
        messages: [...prev.messages, agentMessage],
      }));
    } catch (error) {
      console.error('Chat failed:', error);
      setActiveChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'system', content: 'Sorry, I failed to get a response. Please try again.' },
        ],
      }));
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-inner">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-700">
          Chat with {activeChat.agentName}
        </h2>
        <button
          onClick={() => setView('dashboard')}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat.messages.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            Start a conversation...
          </div>
        ) : (
          activeChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm lg:max-w-md p-3 rounded-lg shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm text-sm rounded-bl-none animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={chatLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 focus:outline-none transition-colors"
            disabled={chatLoading || !inputMsg.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.158.553l1.583 1.583a1 1 0 00.553.158l14-7a1 1 0 000-1.788L10.894 2.553zM10 11a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatScreen;
