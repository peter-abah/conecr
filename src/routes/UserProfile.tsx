
import useSwr from 'swr';
import { useParams } from 'react-router-dom';
import { getUser } from '@/firebase/users';
import { serializeError } from '@/lib/utils';

import BackBtn from '@/components/BackBtn';
import Loader from '@/components/Loader';
import ProfileImage from '@/components/ProfileImage';

const UserProfile = () => {
  const { user_id } = useParams() as { user_id: string };
  const { data: user, error } = useSwr(user_id, getUser);
  
  if (error) {
    return (
      <p className='p-6 text-lg'>{serializeError(error)}</p>
    );
  }

  if (!user) return <Loader />;

  const { displayName, photoUrl } = user;
  return (
    <main>
      <BackBtn className='block ml-4 mt-4' />
      <div className='flex justify-center'>
        <ProfileImage
          className='!w-32 !h-32'
          imgUrl={photoUrl}
          name={displayName || ''}
        />
      </div>
      
      <h1 className='text-xl px-4 text-center mt-4'>
        {displayName}
      </h1>
      
      <p className='text-sm text-center px-4 mt-2'>About is here</p>
    </main>
  )
};

export default UserProfile;