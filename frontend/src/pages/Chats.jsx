import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const myEmail = localStorage.getItem('email');

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages(activeChat.id);
      interval = setInterval(() => fetchMessages(activeChat.id), 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/chats/${chatId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await api.post(`/chats/${activeChat.id}/messages`, { content: newMessage });
      setNewMessage('');
      fetchMessages(activeChat.id);
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  const getOtherUser = (chat) => {
    return chat.user1.email === myEmail ? chat.user2 : chat.user1;
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="chat-container" style={{ display: 'flex', height: 'calc(100vh - 150px)', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Chats Sidebar */}
      <div className="card" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Messages</h2>
        {chats.length === 0 ? <p className="text-muted">No active conversations.</p> : (
          chats.map(chat => {
            const otherUser = getOtherUser(chat);
            return (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  background: activeChat?.id === chat.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  border: '1px solid var(--border-color)',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s'
                }}
              >
                <strong>{otherUser.name}</strong>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Area */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {activeChat ? (
          <>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.8)' }}>
              <h3 style={{ margin: 0 }}>{getOtherUser(activeChat).name}</h3>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {messages.length === 0 ? <p className="text-center text-muted mt-4">No messages yet. Say hi!</p> : (
                messages.map(msg => {
                  const isMe = msg.sender.email === myEmail;
                  return (
                    <div key={msg.id} style={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      borderBottomRightRadius: isMe ? '2px' : '12px',
                      borderBottomLeftRadius: isMe ? '12px' : '2px'
                    }}>
                      <div style={{ wordBreak: 'break-word' }}>{msg.content}</div>
                      <div style={{ fontSize: '0.7rem', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', textAlign: 'right', marginTop: '0.2rem' }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>

    </div>
  );
};

export default Chats;
