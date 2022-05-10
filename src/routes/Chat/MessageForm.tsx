import { useForm } from 'react-hook-form';
import TextArea from 'react-textarea-autosize';
import toast from 'react-hot-toast';
import Spinner from '@/components/Spinner';

import useUploadFile from '@/hooks/useUploadFile';
import { sendMessage } from '@/firebase/messages';
import { Chat } from '@/types';
import { useAppContext } from '@/context/AppContext'
import { serializeError } from '@/lib/utils';
import { MdSend, MdImage, MdClose } from 'react-icons/md'

type FormData = { body: string };
const MessageForm = ({ chat }: { chat: Chat }) => {
  const { register, formState, reset, handleSubmit } = useForm<FormData>();
  const { isSubmitting, errors } = formState;
  const { currentUser } = useAppContext();
  const { file, handleFileChange, fileUrl, setFile } = useUploadFile();

  const onSubmit = async ({ body }: FormData) => {
    try {
      if (!currentUser) return;

      const data = { body, file };
      await sendMessage(chat, currentUser, data);
      reset();
      setFile(null);
    } catch (e) {
      toast.error('An error occured');
    }
  };
 
  return (
    <section className='sticky bottom-0 bg-transparent z-10 px-4 md:px-12'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-start bg-bg py-2 md:py-6'
      >
        <div className='grow'>
          <div className='flex items-end p-2 rounded-3xl bg-msg-other'>
            <TextArea 
              className='bg-bg px-2 text-text bg-inherit focus:outline-none grow'
              maxRows={5}
              placeholder='Message'
              {...register('body', { required: 'Enter Message' })}
            />
            
            <input
              className='hidden fixed top-[9999px] z-[-1]'
              id='group-image'
              type='file'
              accept=".jpg,.png,.gif,.jpeg"
              onChange={handleFileChange}
            />
            <label 
              htmlFor='group-image'
              className='p-1.5 rounded-full hover:border'
            ><MdImage className='text-xl text-gray-600' /></label>
          </div>
          
          {fileUrl && (
            <div 
              className='relative w-20 h-20 overflow-hidden rounded-md mt-2'
            >
              <img
                src={fileUrl}
                className='w-full object-cover max-h-full'
              />
              <button
                onClick={() => setFile(null)}
                className='absolute right-0 top-0 p-1 rounded-full bg-msg-other border-text'
              >
                <MdClose />
              </button>
            </div>
          )}
        </div>
        <button
          className='ml-2 px-3 py-1 bg-primary text-white rounded-xl font-bold'
          type='submit'
        >{
          isSubmitting ?
            <Spinner className='fill-white' loading /> :
            <MdSend className='text-2xl md:text-3xl'/>
          }
        </button>
      </form>
    </section>
  )
};

export default MessageForm;