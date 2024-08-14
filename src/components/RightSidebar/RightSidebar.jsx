import React, { useContext, useState } from 'react';
import './RightSidebar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';

const RightSidebar = () => {
    const { userData, chatUser } = useContext(AppContext);
    const [input, setInput] = useState("");

    // Handle when chatUser is not set
    if (!chatUser || !chatUser.userData) {
        return (
            <div className='rs'>
                <p>No user selected</p>
                <button onClick={() => logout()}>Logout</button>
            </div>
        );
    }

    return (
        <div className='rs'>
            <div className="rs-profile">
                <img src={chatUser.userData.avatar || assets.default_avatar} alt="User Avatar" />
                <h3>
                    {chatUser.userData.name || 'Unknown User'}
                    <img src={assets.green_dot} className='dot' alt="Online Indicator" />
                </h3>
                <p>Hey there, I am using the chat app</p>
            </div>
            <hr />
            <div className='rs-media'>
                <p>Media</p>
                <div>
                    <img src={assets.pic1} alt="Media 1" />
                    <img src={assets.pic2} alt="Media 2" />
                    <img src={assets.pic3} alt="Media 3" />
                    <img src={assets.pic4} alt="Media 4" />
                    <img src={assets.pic1} alt="Media 1" />
                    <img src={assets.pic2} alt="Media 2" />
                </div>
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
};

export default RightSidebar;
