import { doc, getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '@/config/firebaseConfig';

const db = getFirestore(firebaseApp);

export default async function addMessageToChat(chatId, content) {
    let result = null;
    let error = null;

    try {
        const chatRef = doc(db, 'chats', chatId);
        const messagesCollection = collection(chatRef, 'messages');

        result = await addDoc(messagesCollection, {
            content: content,
            timestamp: Date.now(),
        });

    } catch (e) {
        error = e;
    }

    return { result, error };
}
