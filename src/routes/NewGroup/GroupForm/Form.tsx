import React from 'react';
import { useForm } from 'react-hook-form';

import TextArea from 'react-textarea-autosize';
import Header from '@/components/Header';
import ProfileImage from '@/components/ProfileImage';
import Spinner from '@/components/Spinner';

export interface FormData {
  name: string;
  description: string;
};

interface Props {
  onSubmit: (data: FormData) => void;
  onImgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgUrl: string | null;
  clearImage: () => void;
};

const Form = ({onSubmit, onImgChange, clearImage, imgUrl}: Props) => {
  const { register, handleSubmit, getValues, formState } = useForm<FormData>();
  const { isSubmitting, errors } = formState;

  return (
    <section>
      <Header heading='Create group' subheading='Name group' />
 
      <form className='px-4 max-w-[35rem] mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4 flex flex-col items-center'>
          <ProfileImage
            className='!w-32 !h-32 !text-7xl !md:w-48 !md:h-48'
            imgUrl={imgUrl}
            name={getValues('name') || ''}
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
 
        <div className="flex flex-col mb-4">
          <label className="font-bold mb-2">Group Name</label>
          <input 
            className="px-3 py-2 border-2 border-gray-400 rounded-md"
            type='text'
            {...register('name', { required: 'Name cannot be empty' })}
          />
          {errors.name && <small className="pl-2 text-sm">{errors.name.message}</small>}
        </div>
        
        <div className="flex flex-col">
          <label className="font-bold mb-2">Description</label>
          <TextArea
            className="px-3 py-2 border-2 border-gray-400 rounded-md bg-bg text-text"
            maxRows={5}
            {...register('description', { required: 'Description cannot be empty' })}
          />
          {errors.description && <small className="pl-2 text-sm">{errors.description.message}</small>}
        </div>
        
        <button
          className="flex items-center justify-center mt-8 px-4 py-2 min-w-[10rem] rounded-lg bg-primary disabled:opacity-50 text-white"
          type='submit'
        >
          {isSubmitting ?
            <Spinner className='!text-white' loading /> :
            <span>Save</span>
          }
        </button>
      </form>
    </section>
  )
};

export default Form;