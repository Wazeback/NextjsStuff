import firebaseApp from "@/config/firebaseConfig";
import {
    getFirestore,
    doc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function getMessages(chatId, callback) {
    const messagesRef = collection(doc(db, "chats", chatId), "messages");

    let result = null;
    let error = null;

    return new Promise((resolve, reject) => {
        // Initial fetch
        getDocs(query(messagesRef, orderBy("timestamp")))
            .then((querySnapshot) => {
                result = querySnapshot.docs.map((doc) => doc.data());

                // Real-time listener
                const unsubscribe = onSnapshot(query(messagesRef, orderBy("timestamp")), (snapshot) => {
                    const updatedMessages = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    callback(updatedMessages);
                });

                resolve({ result, error, unsubscribe });
            })
            .catch((e) => {
                error = e;
                resolve({ result, error, unsubscribe: null });
            });
    });
}
