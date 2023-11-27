'use client'

import GetAuthUser from "@/app/login/handleAuth";
import {useEffect, useState} from "react";
import addData from "@/app/firestore_collections/addData";
import getMessages from "@/app/firestore_collections/getData";

const ChatBox = () => {
    const user = GetAuthUser();
    const [message, setMessage] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);

    const handleFormSubmit = async (e) => {
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
    }

    const fetchChat = async () => {
        try {
            const chatData = await getMessages("chat_one");
            setDisplayMessages(chatData.result || []);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    };

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }


    useEffect(() => {
        const fetchData = async () => {
            const { result, error, unsubscribe } = await getMessages("chat_one", setDisplayMessages);

            if (error) {
                console.error("Error fetching chat data:", error);
            }

            // Clean up the listener when the component unmounts
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        };

        fetchData();
    }, []);


    return (
        <>
            <div className="flex h-[100vh] flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
            <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                    <div className="flex w-full mt-2 space-x-3 max-w-xs">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        <div>
                            <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">2 min ago, wazeback</span>
                        </div>
                    </div>
                    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                        <div>
                            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">2 min ago, wazeback</span>
                        </div>
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                    </div>
                    {displayMessages.map((message, index) => {
                        if (message.content.user_id != ( user.displayName|| user.email )) {
                            return (
                                <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                    <div>
                                        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                            <p className="text-sm">{message.content.display}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none">{timeSince(message.timestamp)}, {message.content.user_id}</span>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                                    <div>
                                        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                            <p className="text-sm">{message.content.display}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none">{timeSince(message.timestamp)}, You</span>
                                    </div>
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                </div>
                            );
                        }
                    })}

                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="bg-gray-300 p-4">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex text-black items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…"
                            required/>

                    </div>
                </form>
            </div>
            </div>
        </>
    );

};


export default ChatBox;