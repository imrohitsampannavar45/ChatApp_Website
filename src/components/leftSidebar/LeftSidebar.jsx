import React, { useContext, useState } from "react";
import assets from "../../assets/assets";
import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setChatUser, setMessagesId } = useContext(AppContext);
  const [searchedUser, setSearchedUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    const input = e.target.value;
    if (input) {
      try {
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const user = querySnap.docs[0].data();
          if (user.id !== userData?.id) {
            const userExists = chatData.some(chat => chat.rID === user.id);
            if (!userExists) {
              setSearchedUser(user);
            } else {
              setSearchedUser(null);
            }
          }
        } else {
          setSearchedUser(null);
        }
      } catch (error) {
        console.error("Error searching user:", error);
        toast.error("Error searching user");
      }
    } else {
      setShowSearch(false);
    }
  };

  const addChat = async () => {
    if (!searchedUser) return;

    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      const newChatData = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rID: userData?.id,
        updatedAt: Date.now(),
        messageSeen: true
      };

      await updateDoc(doc(chatsRef, searchedUser.id), {
        chatData: arrayUnion({ ...newChatData, rID: userData?.id })
      });

      await updateDoc(doc(chatsRef, userData?.id), {
        chatData: arrayUnion({ ...newChatData, rID: searchedUser.id })
      });

      setChatUser({ ...newChatData, userData: searchedUser });
      setMessagesId(newMessageRef.id);

      toast.success("Chat added successfully!");
    } catch (error) {
      console.error("Error adding chat:", error);
      toast.error("Error adding chat");
    }
  };

  const setChat = (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu Icon" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search Icon" />
          <input onChange={inputHandler} type="text" placeholder="Search Here...." />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && searchedUser ? (
          <div onClick={addChat} className="friends add-user">
            <img src={searchedUser.avatar} alt="User Avatar" />
            <p>{searchedUser.name}</p>
          </div>
        ) : (
          chatData && chatData.length > 0 ? (
            chatData.map((item, index) => (
              <div onClick={() => setChat(item)} key={index} className="friends">
                <img src={item.userData.avatar} alt="Profile" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="not">No chats available</p>
          )
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
