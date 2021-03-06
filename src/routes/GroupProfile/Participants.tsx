import useSWR, { useSWRConfig } from 'swr';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import useAsync from '@/hooks/useAsync';
import toast from 'react-hot-toast';

import { removeUserFromGroup, deleteGroup } from '@/firebase/chats';
import { getParticipants } from '@/firebase/users';
import { serializeError } from '@/lib/utils';
import { GroupChat } from '@/types';

import User from '@/components/User';
import Loader from '@/components/Loader';
import LoadingBar from '@/components/LoadingBar';
import ErrorPage from '@/components/ErrorPage';
import { MdDelete, MdPersonAdd } from 'react-icons/md';

const Participants = ({chat}: {chat: GroupChat}) => {
  const { mutate } = useSWRConfig();
  const { data: participants, error } = useSWR(
    [chat.participants], getParticipants
  );
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  const { func: _removeUserFromGroup, loading: loadingRemoveUser } = useAsync(removeUserFromGroup);

  if (error) return <ErrorPage />;
  if (!participants) return <Loader />
  
  const handleUserClick = (uid: string) => {
    return () => navigate(`/users/${uid}`, {replace: true})
  };
  
  const canRemoveUser = (uid: string) => {
    return currentUser?.uid === chat.owner && uid !== currentUser?.uid;
  }
  
  const removeUser = async (uid: string) => {
    if (!canRemoveUser(uid)) return;
  
    const shouldDelete = window.confirm('Are you sure you want to remove this user');
    if (!shouldDelete) return;
  
    try {
      await _removeUserFromGroup(chat, uid);
      
      // refetching chat data
      mutate([chat.participants]);
      mutate(chat.id);
      toast.success('User removed');
    } catch (e) {
      toast.error('Unable to remove user')
    }
  }

  return (
    <section className='pr-4'>
      {loadingRemoveUser && <LoadingBar />  }
      <h2 className='font-bold mb-2'>Participants</h2>

      <Link 
        to='add_participants'
        className='flex items-center px-4 py-2 font-bold'
      >
        <MdPersonAdd className='text-4xl p-2 mr-4' />
        <span>Add Participants</span>
      </Link>
 
      {participants.map((user) => (
        <div key={user.uid} className='flex items-center'>
          <User
            user={user}
            onClick={handleUserClick(user.uid)}
          />
          {canRemoveUser(user.uid) &&
            <button onClick={() => removeUser(user.uid)}>
              <MdDelete className='text-xl md:text-2xl text-red-600' />
            </button>
          }
        </div>
      ))}
    </section>
  )
};

export default Participants;