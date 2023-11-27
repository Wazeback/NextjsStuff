'use client'

import GetAuthUser from "@/app/login/handleAuth";
import addData from "@/app/firestore_collections/addData";
import { useState, useEffect } from 'react';
import getMessages from "@/app/firestore_collections/getData";

const Home = () => {
    const [message, setMessage] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    const user = GetAuthUser();

    const handleForm = async (e) => {
        e.preventDefault();
        const data = {
            user_id: user.displayName || user.email,
            display: message,
        };
        const { result, error } = await addData('chat_one', data);
        if (error) {
            return console.log(error);
        }
        setMessage('');
    };

    const fetchChat = async () => {
        try {
            const chatData = await getMessages("chat_one");
            setDisplayMessages(chatData.result || []);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    };

    useEffect(() => {
        fetchChat();
    }, []);

    return (
        <>
            <h1>Welcome, {user.displayName || user.email}!</h1>
            <h1>Add a message</h1>
            <div id={"displayMessages"}>
                {displayMessages.map((displayMessage, index) => (
                    <>
                        <div className={"bg-amber-500 h-20 w-1/4 m-4"}>
                            <div key={index}> {displayMessage.content.user_id} </div>
                            <div > {displayMessage.content.display} </div>
                        </div>

                    </>
                ))}
            </div>
            <div id={"form_for_add_message"}>
                <form onSubmit={handleForm}>
                    <input
                        className={"text-black"}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <input type="submit"/>
                </form>
            </div>
        </>
    );
};

export default Home;
