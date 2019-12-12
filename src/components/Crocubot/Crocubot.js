import React, { useState, useEffect } from "react";
import "./Crocubot.css";
import $ from "jquery";
import axios from "axios";
import Message from "../Message/Message";

const Crocubot = ({ color, name, welcomeMessage, server }) => {
  const [chatStatus, toggleExpansion] = useState("closed");
  const [botName, setName] = useState("CrocuBot");
  const [messageData, updateMessages] = useState([]);
  const [śerver, setServer] = useState("http://localhost");

  const toggle = () => {
    toggleExpansion(chatStatus === "closed" ? "expanded" : "closed");
  };

  const updateTheme = (color, name) => {
    if (color) {
      let chat = document.querySelector(".floating-chat");
      chat.style.setProperty("background", color);
    }

    if (name) setName(name);
  };

  useEffect(() => {
    updateTheme(color, name);
    if (welcomeMessage)
      updateMessages(messageData => [
        ...messageData,
        { sender: "other", text: welcomeMessage }
      ]);

    if (server) setServer(server);

    openElement();
  }, [color, name]);

  const openElement = e => {
    let element = $(".floating-chat");
    var messages = element.find(".messages");
    var textInput = element.find(".text-box");
    if (chatStatus === "closed") toggle();
    element.find(".chat").addClass("enter");
    textInput
      .keydown(onMetaAndEnter)
      .prop("disabled", false)
      .focus();
    element.find(".header button").click(closeElement);
    element.find("#sendMessage").click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
  };

  const appendMessage = message => {
    let messagesContainer = $(".messages");

    updateMessages(messageData => [...messageData, message]);

    console.log(messageData);
    var userInput = $(".text-box");
    userInput.html("");
    userInput.focus();

    messagesContainer.finish().animate(
      {
        scrollTop: messagesContainer.prop("scrollHeight")
      },
      250
    );
  };

  const processMessage = message => {
    axios
      .post(`${server}:5000/chat`, {
        message: message
      })
      .then(res => {
        appendMessage({
          sender: "other",
          text: res.data
        });
      });
  };

  const sendNewMessage = () => {
    var userInput = $(".text-box");
    var newMessage = userInput.text();

    if (!newMessage) return;

    let message = {
      sender: "self",
      text: newMessage
    };

    appendMessage(message);
    processMessage(newMessage);
  };

  const onMetaAndEnter = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendNewMessage();
    }
  };

  const closeElement = e => {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let element = $(".floating-chat");

    element
      .find(".chat")
      .removeClass("enter")
      .hide();
    element.find(">i").show();
    if (chatStatus === "expanded") toggle();
    setTimeout(function() {
      element
        .find(".chat")
        .removeClass("enter")
        .show();
      element.click(openElement);
    }, 500);
  };

  return (
    <div onClick={openElement} className={`floating-chat ${chatStatus}`}>
      <i className="fa fa-comments" aria-hidden="true"></i>
      <div className="chat">
        <div className="header">
          <span className="title">{botName}</span>
          <button onClick={closeElement}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <ul className="messages">
          {messageData.map((message, index) => (
            <Message key={index} sender={message.sender} text={message.text} />
          ))}
        </ul>
        <div className="footer">
          <div
            className="text-box"
            contentEditable="true"
            disabled={true}
          ></div>
          <button id="sendMessage">Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Crocubot;
