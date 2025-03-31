import React from 'react';
import styles from './ChatMessage.module.scss';
import { CHAT_QUESTIONS, CHAT_STYLES } from '@/config/chatQuestions';

export default function ChatMessage({ messages, handleQuestionClick }) {
  return (
    <div 
      className={styles.chatContainer}
      style={{ '--chat-gradient': CHAT_STYLES.container }}
    >
      {messages.map((msg) => (
        <div 
          key={msg.id}
          className={`${styles.messageRow} ${msg.isBot ? styles.bot : ''}`}
        >
          <div 
            className={`${styles.messageBubble} ${msg.isBot ? styles.bot : styles.user}`}
            style={{ background: msg.isBot ? CHAT_STYLES.botBubble : CHAT_STYLES.userBubble }}
          >
            {msg.text}
            <div className={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div className={styles.questionRow}>
        {CHAT_QUESTIONS.map((q) => (
          <button
            key={q.id}
            className={styles.questionButton}
            style={{ background: q.gradient }}
            onClick={() => handleQuestionClick(q.text)}
          >
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}