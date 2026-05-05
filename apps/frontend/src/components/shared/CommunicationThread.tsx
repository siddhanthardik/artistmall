import React, { useState } from 'react';
import { MessageSquare, Send, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

interface CommunicationThreadProps {
  entityType: 'ARTIST' | 'BOOKING' | 'KYC';
  entityId: string;
}

// Dummy data
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'admin1',
    senderName: 'Platform Admin',
    senderRole: 'SUPER_ADMIN',
    text: 'Please upload a higher resolution PDF for the Technical Rider. The current one is illegible.',
    timestamp: '2 hours ago'
  }
];

export const CommunicationThread: React.FC<CommunicationThreadProps> = ({ entityType, entityId }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: user?.id || 'unknown',
      senderName: user?.email || 'You',
      senderRole: user?.role || 'USER',
      text: inputText,
      timestamp: 'Just now'
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const isAdmin = (role: string) => ['SUPER_ADMIN', 'SUB_ADMIN'].includes(role);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-3 bg-slate-800/50 border-b border-slate-700/50 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-medium text-white">{entityType} Thread</h3>
        <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          ID: {entityId.substring(0, 8)}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          const fromAdmin = isAdmin(msg.senderRole);

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {fromAdmin ? (
                  <ShieldCheck className="w-3 h-3 text-red-400" />
                ) : (
                  <User className="w-3 h-3 text-slate-500" />
                )}
                <span className={`text-[10px] font-medium ${fromAdmin ? 'text-red-400' : 'text-slate-500'}`}>
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">• {msg.timestamp}</span>
              </div>
              
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : fromAdmin
                    ? 'bg-slate-800 border border-red-500/20 text-white rounded-tl-none'
                    : 'bg-slate-800 text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-800/30 border-t border-slate-700/50">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Reply to this thread..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-500 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
      
    </div>
  );
};
