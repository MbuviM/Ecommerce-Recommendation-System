import React, { useState } from 'react';
import styles from './ChatInterface.module.scss';
import ChatMessage from '../ChatMessage/ChatMessage';
import { CHAT_STYLES } from '@/config/chatQuestions';

export default function ChatInterface({ onAddToCart }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { data: cartData } = useCart();

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
      products: [
        { id: '1', name: 'Product 1', price: 49.99 },
        { id: '2', name: 'Product 2', price: 59.99 }
      ],
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