// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBlwbsoxWMwUSua627CiHygoYNsm7dIARI",
  authDomain: "chat-app-832fc.firebaseapp.com",
  projectId: "chat-app-832fc",
  storageBucket: "chat-app-832fc.appspot.com",
  messagingSenderId: "345825440899",
  appId: "1:345825440899:web:2ce413f76eca6e3de417b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    console.log("Signing up user...");
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log("User created:", user.uid);

    // Save user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, I am using Chat App",
      lastSeen: Date.now()
    });
    console.log("User data stored in Firestore");

    // Initialize an empty chat document for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatData: []
    });
    console.log("Chat data initialized");

  } catch (error) {
    console.error("Error signing up:", error);
    toast.error(error.code.split('/')[1].split('-').join(" "))

  }
};

const login = async (email,password) =>{
    try {
        await signInWithEmailAndPassword(auth,email,password)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }

}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
   
}


export { signup,login,logout,auth,db };
