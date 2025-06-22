import React, { useState, useEffect, useRef } from 'react';

const MessageThread = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  loading 
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText('');
  };
  
  if (!conversation) {
    return (
      <div className="chat-panel">
        <div className="chat-empty-state" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px',
          textAlign: 'center',
          color: '#65676b'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            Select a conversation
          </div>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const groupMessages = (msgs) => {
    if (!msgs || msgs.length === 0) return [];

    return msgs.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      const isCustomer = message.sender === 'customer';

      if (lastGroup && lastGroup.isCustomer === isCustomer) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          id: message._id,
          isCustomer,
          messages: [message],
          senderName: isCustomer ? conversation.customerName || 'Customer' : 'You',
          avatar: isCustomer 
            ? conversation.customerAvatar || `/uploads/user1.jpg`  
            : '/uploads/avatar.jpg',
        });
      }

      return groups;
    }, []);
  };

  const messageGroups = groupMessages(messages);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div style={{ fontWeight: '500' }}>{conversation.customerName}</div>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            {messageGroups.map((group, groupIndex) => (
              <div 
                key={group.id || `group-${groupIndex}`} 
                className={`message-group ${group.isCustomer ? '' : 'outgoing'}`}
              >
                {/* Avatar */}
                <img 
                  src={group.avatar} 
                  alt="avatar" 
                  className="message-avatar"
                />

                
                  {/* Message Bubbles */}
                  <div className="message-bubble-container">
  {group.messages.map((message, msgIndex) => (
    <div 
      key={message._id || `msg-${groupIndex}-${msgIndex}`} 
      className={`message ${group.isCustomer ? 'message-incoming' : 'message-outgoing'}`}
    >
      {message.content}
    </div>
  ))}
  <div style={{ 
    fontSize: '0.7rem', 
    color: '#65676b', 
    marginTop: '2px',
    textAlign: group.isCustomer ? 'left' : 'right'
  }}>
    {formatTime(group.messages[group.messages.length - 1].timestamp)}
  </div>
</div>

                  
              </div>
            ))}

            {/* Scroll to Bottom Ref */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={!messageText.trim() || loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
