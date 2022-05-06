import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import ProfileImage from '@/components/ProfileImage';

export interface FormData {
  displayName: string;
  about: string;
};

interface Props {
  onSubmit: (data: FormData) => void;
  onImgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgUrl: string | null;
  clearImage: () => void;
};

const Form = ({onSubmit, onImgChange, clearImage, imgUrl}: Props) => {
  const { currentUser } = useAppContext();
  const defaultValues = {
    displayName: currentUser?.displayName,
    about: ''
  };
  const {
    register,
    handleSubmit,
    getValues,
    formState
  } = useForm<FormData>({defaultValues});
  const { isSubmitting, errors } = formState;

  return (
    <section>
      <Header heading='Edit Profile' />
 
      <form className='px-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4 flex flex-col items-center'>
          <ProfileImage
            className='!w-32 !h-32'
            imgUrl={imgUrl}
            name={getValues('displayName') || ''}
          />
          <input
            className='hidden fixed top-[9999px] z-[-1]'
            id='group-image'
            type='file'
            accept=".jpg,.png,.gif,.jpeg"
            onChange={onImgChange}
          />
          <div className='mt-2 flex w-fit'>
            <label 
              htmlFor='group-image'
              className='px-4 py-1 text-sm rounded-md text-white bg-primary mr-4'
            >Select Image</label>
            <button
              type='button'
              className='px-4 py-1 text-sm rounded-md text-white bg-zinc-600'
              onClick={clearImage}
            >Remove</button>
          </div>
        </div>
 
        <div className="flex flex-col">
          <label htmlFor='name' className="font-bold">Name</label>
          <input
            id='name' 
            className="px-3 py-2 border rounded-md"
            type='text'
            {...register('displayName', { required: 'Name cannot be empty' })}
          />
          {errors.displayName && <small className="pl-2 text-sm">{errors.displayName.message}</small>}
        </div>
        
        <div className="flex flex-col">
          <label htmlFor='about' className="font-bold">About</label>
          <input
            id='about'
            className="px-3 py-2 border rounded-md"
            type='text'
            {...register('about')}
          />
        </div>
        
        <button
          className="flex items-center justify-center mt-8 px-4 py-2 min-w-[10rem] rounded-lg bg-primary disabled:opacity-50 text-white"
          type='submit'
          disabled={isSubmitting}
        >Save</button>
      </form>
    </section>
  )
};

export default Form;