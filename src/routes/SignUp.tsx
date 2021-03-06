import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { signUpWithEmail, errorToMsg } from '@/firebase/auth';
import Spinner from '@/components/Spinner';

const formSchema = yup.object({
  name: yup.string().required('Enter your name.'),
  email: yup.string().required('Enter your email.')
    .email('Enter valid email.'),
  password: yup.string().required('Enter password')
    .min(8, 'Password must have at least 8 characters'),
  passwordConfirmation: yup.string().oneOf(
    [yup.ref('password'), null],
    'Password must match'
  )
}).required();

type FormData = yup.InferType<typeof formSchema>

const SignUp = () => {
  const navigate = useNavigate();

  let { register, handleSubmit, setError, formState } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  });
  const { isSubmitting } = formState;
  
  // adding unknown property to errors type
  type ErrorsType = (typeof formState.errors & { unknown?: { message: string }})
  const errors: ErrorsType = formState.errors;

  const onSubmit = async (formData: FormData) => {
    try {
      await signUpWithEmail(formData);
      navigate('/');
    } catch (e: any) {
      const [key, message] = Object.entries(errorToMsg(e))[0] as [any, any];
      setError(key, message)
    }
  };

  return (
    <main className='mx-auto max-w-[40rem]'>
      <h1 className="px-4 my-6 text-3xl md:text-4xl md:mt-10 font-display">Conecr</h1>
      <section className="p-4">
        <h2 className="mb-3 text-lg md:text-xl">Sign up on Conecr</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <label className="font-bold mb-2">Name: </label>
            <input 
              className="px-3 py-2 border border-gray-400 rounded-md"
              type='text'
              {...register('name')}
            />
            {errors.name &&
              <small className="pl-2 text-sm">
                {errors.name.message}
              </small>
            }
          </div>
    
          <div className="flex flex-col mb-4">
            <label className="font-bold mb-2">Email: </label>
            <input 
              className="px-3 py-2 border border-gray-400 rounded-md"
              type='email'
              {...register('email')}
            />
            {errors.email && 
              <small className="pl-2 text-sm">
                {errors.email.message}
              </small>
            }
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="font-bold mb-2">Password: </label>
            <input
              className="px-3 py-2 border border-gray-400 rounded-md"
              type='password'
              {...register('password')} 
            />
            {errors.password && 
              <small className="pl-2 text-sm">
                {errors.password.message}
              </small>
            }
          </div>
          
          <div className="flex flex-col">
            <label className="font-bold mb-2">Confirm Password: </label>
            <input
              className="px-3 py-2 border border-gray-400 rounded-md"
              type='password'
              {...register('passwordConfirmation')} 
            />
            {errors.passwordConfirmation && 
              <small className="pl-2 text-sm">
                {errors.passwordConfirmation.message}
              </small>
            }
          </div>
  
          {errors.unknown &&
            <small className='text-sm mt-3'>
              {errors.unknown.message}
            </small>
          }
          
          <div className="mt-8">
            <button
              className="flex bg-primary text-white items-center justify-center mx-auto px-4 py-2 min-w-[15rem] rounded-lg"
              type='submit'
              disabled={isSubmitting}
            >
              <Spinner loading={isSubmitting} className='!fill-white' />
              <span className='ml-4 font-bold'>Sign up</span>
            </button>
          </div>
          
          <p className='mt-8 text-sm text-center'>
            <span>Already have an account? </span>
            <Link to='/login' className='underline text-primary'>Login</Link>
          </p>
        </form>
      </section>
    </main>
  )
};

export default SignUp;