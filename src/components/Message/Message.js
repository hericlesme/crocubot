import React from 'react';
import './Message.css';

const Message = ({ text, sender }) => (
  <li className={sender}>
    {text}
  </li>
);

export default Message;