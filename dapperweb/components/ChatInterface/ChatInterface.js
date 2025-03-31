import React, { useState } from 'react';
import styles from './ChatInterface.module.scss';
import ChatMessage from '../ChatMessage/ChatMessage';
import { CHAT_STYLES } from '@/config/chatQuestions';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuestionClick = async (questionText) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: questionText,
      isBot: false,
      timestamp: new Date()
    }]);

    // Simulate bot response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: 'Here are some curated suggestions based on your style preferences 🎉',
      isBot: true,
      timestamp: new Date()
    }]);
    setIsTyping(false);
  };

  return (
    <div 
      className={styles.chatInterface}
      style={{ background: CHAT_STYLES.container }}
    >
      <div className={styles.header}>
        <h2>Style Assistant</h2>
        <div className={styles.decorativeLine}></div>
      </div>
      
      <ChatMessage 
        messages={messages} 
        handleQuestionClick={handleQuestionClick} 
      />

      {isTyping && (
        <div className={styles.typingIndicator}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      )}
    </div>
  );
}