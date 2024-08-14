import React, { createContext, useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);

    const loadUserData = async (uid) => {
        try {
            if (!uid) {
                throw new Error('User ID is undefined or null.');
            }

            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const user = userSnap.data();

            if (user) {
                setUserData(user);

                if (user.avatar && user.name) {
                    navigate('/chat');
                } else {
                    navigate('/profile');
                }

                const updateLastSeen = async () => {
                    if (auth.currentUser) {
                        await updateDoc(userRef, { lastSeen: Date.now() });
                    }
                };

                await updateLastSeen();
                const intervalId = setInterval(updateLastSeen, 60000);
                return () => clearInterval(intervalId); // Cleanup interval on unmount
            } else {
                console.error('User data is not found.');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    useEffect(() => {
        if (userData && userData.id) {
            const chatRef = doc(db, 'chats', userData.id);

            const unSub = onSnapshot(chatRef, async (snapshot) => {
                try {
                    const chatItems = snapshot.data()?.chatData || [];
                    if (!Array.isArray(chatItems)) {
                        throw new Error('Chat data is not an array.');
                    }

                    const tempData = [];

                    for (const item of chatItems) {
                        if (item.rId) {
                            const userRef = doc(db, 'users', item.rId);
                            const userSnap = await getDoc(userRef);
                            const user = userSnap.data();

                            if (user) {
                                tempData.push({ ...item, userData: user });
                            } else {
                                console.warn(`User data for recipient ID ${item.rId} not found.`);
                            }
                        } else {
                            console.error('Recipient ID is undefined or null in chat item.');
                        }
                    }

                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } catch (error) {
                    console.error('Error fetching chat data:', error);
                }
            });

            return () => unSub(); // Cleanup listener on unmount
        } else {
            console.error('User data or user ID is undefined.');
        }
    }, [userData]);

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messages, setMessages,
        messagesId, setMessagesId,
        chatUser, setChatUser,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
