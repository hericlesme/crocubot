import React, { useState } from "react";
import './Crocubot.css'
import $ from 'jquery';
import axios from 'axios';

const Crocubot = ({ }) => {

  let [chatStatus, toggleExpansion] = useState("closed");


  const toggle = () => {
    toggleExpansion(chatStatus === 'closed' ? 'expanded' : 'closed');
  }

  const openElement = (e) => {
    let element = $('.floating-chat');
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    console.log(element)
    if (chatStatus === 'closed') toggle();
    element.find('.chat').addClass('enter');
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
  }

  const appendMessage = (message, sender) => {

    var messagesContainer = $('.messages');

    messagesContainer.append([
      `<li class="${sender}">`,
      message,
      '</li>'
    ].join(''));

    var userInput = $('.text-box');
    userInput.html('');
    userInput.focus();

    messagesContainer.finish().animate({
      scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
  }

  const processMessage = (message) => {
    axios.post('http://localhost:5000/chat', {
      "message": message
    }).then(res => {
      appendMessage(res.data, 'other')
    })
  }

  const sendNewMessage = () => {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) return;

    appendMessage(newMessage, 'self');
    processMessage(newMessage);
  }

  const onMetaAndEnter = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
      sendNewMessage();
    }
  }

  const closeElement = (e) => {

    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let element = $('.floating-chat');

    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    if (chatStatus === 'expanded') toggle()
    setTimeout(function () {
      element.find('.chat').removeClass('enter').show()
      element.click(openElement);
    }, 500);

  }

  return (
    <div onClick={openElement} className={`floating-chat ${chatStatus}`}>
      <i className="fa fa-comments" aria-hidden="true"></i>
      <div className="chat">
        <div className="header">
          <span className="title">
            Crocubot
        </span>
          <button onClick={closeElement}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>

        </div>
        <ul className="messages">
        </ul>
        <div className="footer">
          <div className="text-box" contentEditable="true" disabled={true}></div>
          <button id="sendMessage">Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default Crocubot;