import { db } from '.'
import { 
  getDoc, 
  getDocs,
  collection,
  doc,
  query,
  where,
  startAfter,
  limit,
  orderBy
} from 'firebase/firestore';

import { partitionArray } from '@/lib/utils';
import { User } from '@/types';

const usersCache : { [index: string]: User } = {}

export const getUser = async (uid: string) => {
  if (usersCache[uid]) return usersCache[uid];
  
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (snapshot.exists()) {
    const user = snapshot.data() as User;
    usersCache[uid] = user;
    return user;
  }
  
  throw new Error('User not found');
};

const usersQuery = () => {
  return query(collection(db, 'users'),
    limit(25),
    orderBy('displayName')
  );
};

const nextUsersQuery = (lastUid: string) => {
  return query(collection(db, 'users'),
    limit(25),
    startAfter(lastUid),
    orderBy('displayName')
  );
}

export const getUsers = async (lastUid?: string) => {
  const query = lastUid ? nextUsersQuery(lastUid) : usersQuery();
  const snapshot = await getDocs(query);
  const users = snapshot.docs.map((e) => e.data() as User)
  return users;
};

const _getParticipants = async (participants: string[]) => {
  if (participants.length > 10) {
    throw new Error('Participants length must not be greater than 10');
  }

  const q = query(collection(db, 'users'),
    where('uid', 'in', participants)
  );

  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((e) => e.data() as User)
  return users;
}

// get participants in chunks of ten since firebase allows
// maximum of 10 elements in array for in operator
export const getParticipants = async (participants: string[]) => {
  const partitionedParticipants = partitionArray(participants, 10);
  const participantsPromises = partitionedParticipants.map(
    (p) => _getParticipants(p)
  );
  const result = await Promise.all(participantsPromises);
  const merged = result.reduce((total, arr) => total.concat(arr), []);
  return merged;
};