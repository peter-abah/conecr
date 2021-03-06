import {
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  serverTimestamp,
  arrayRemove,
  arrayUnion,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";
import { db, auth } from '.';
import { authenticate, authorize } from './auth'
import { saveFile } from './storage';
import { Chat, GroupChat, PrivateChat } from '@/types';
import { getChatId } from '@/lib/chats';
import { NotFoundError } from '@/lib/errors';

export const getChats = (callbackFn: (chats: Chat[]) => void) => {
  authenticate();
 
  const q = query(collection(db, "chats"), 
    where("participants", "array-contains", auth.currentUser!.uid),
    orderBy('updatedAt', 'desc')
  );
  const unsub = onSnapshot(q, (snapshot) => {
    const result: Chat[] = [];
    snapshot.forEach((doc) => {
      const data = {...doc.data(), id: doc.id } as Chat;
      result.push(data);
    });
    callbackFn(result);
  });
  
  return unsub;
};

export const getChat = async (id: string) => {
  const snapshot = await getDoc(doc(db, 'chats', id));
  if (snapshot.exists()) {
    const chat ={
      ...snapshot.data(),
      id: snapshot.id
    }  as Chat;
    return chat;
  }
  
  throw new NotFoundError('Chat not found');
};

export const getAllUserChats = async () => {
  authenticate();
  
  const q = query(collection(db, 'chats'),
    where('participants', 'array-contains', auth.currentUser!.uid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs;
};

export const removeUserFromGroup = async (chat: GroupChat, userId: string) => {
  authenticate();

  const isAuthorized = (chat.owner === auth.currentUser?.uid) ||
    (userId === auth.currentUser?.uid)
  authorize(isAuthorized);

  await updateDoc(doc(db, 'chats', chat.id), {
    participants: arrayRemove(userId)
  });
};

export const addUsersToGroup = async (chat: GroupChat, uids: string[]) => {
  authenticate();
  authorize(
    chat.owner === auth.currentUser?.uid,
    'Not authorized. Must own group to edit'
  );

  await updateDoc(doc(db, 'chats', chat.id), {
    participants: arrayUnion(...uids)
  });
};

export const deleteGroup = async (chat: GroupChat) => {
  authenticate();
  authorize(
    chat.owner === auth.currentUser?.uid,
    'Not authorized. Must own group to delete'
  );

  await deleteDoc(doc(db, 'chats', chat.id));
};

export const deleteChat = async (chat: PrivateChat) => {
  authenticate();
  authorize(
    chat.participants.includes(auth.currentUser!.uid)
  );

  await deleteDoc(doc(db, 'chats', chat.id));
};

export const chatsQuery = () => {
  authenticate();
  return query(collection(db, "chats"), 
    where("participants", "array-contains", auth.currentUser!.uid),
    orderBy('updatedAt', 'desc')
  );
}

export const createChat = async (uid: string) => {
  authenticate();
  
  const chatId = getChatId(uid, auth.currentUser!.uid);
  const docRef = doc(db, 'chats', chatId);
  await setDoc(docRef, {
    type: 'private',
    participants: [uid, auth.currentUser!.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

interface GroupData {
  name: string;
  picture?: File | null;
  participants: string[];
  description: string;
}

export const createGroupChat = async (data: GroupData) => {
  authenticate();

  const {name, picture, participants, description} = data;
  const photoUrl = picture ? await saveFile(picture) : undefined;

  await addDoc(collection(db, 'chats'), {
    participants: [...participants, auth.currentUser!.uid],
    owner: auth.currentUser!.uid,
    type: 'group',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    name,
    description,
    ...(photoUrl) && { photoUrl }
  });
}