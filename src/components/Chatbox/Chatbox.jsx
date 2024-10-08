// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import './Chatbox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
const Chatbox = () => {

  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);

  const [input,setInput] = useState("");



  return chatUser? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>

      <div className="chat-message">
        <div className="s-msg">
          <p className='msg'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>

        <div className="s-msg">
          <img className='msg-img' src={assets.pic1} alt="" />

          <div>
            <img src={chatUser.userData.avatar} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>

        <div className="r-msg">
          <p className='msg'>
            Lorem ipsum dolor sit amet consectetur</p>

          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 pm</p>
          </div>
        </div>
      </div>








      <div className="chat-input">
        <input type="text" placeholder='Send a Message' />
        <input type="file" id='image' accept='image/png, image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  )

  :<div className='chat-welcome'>
    <img src={assets.logo_icon} alt="" />
<p>Chat anytime, anywhere</p>
  </div>
}

export default Chatbox
