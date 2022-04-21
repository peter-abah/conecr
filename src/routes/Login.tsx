import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '@/firebase/users';

interface FormData {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = async ({email, password}: FormData) => {
    try {
      await signInWithEmail(email, password);
      navigate('/');
    } catch (e) {
      window.alert('An error occured could not sign in' + JSON.stringify(e))
    }
  }

  return (
    <main>
      <h1 className="mx-4 my-6 text-2xl">Chat</h1>
      <section className="p-4">
        <h2 className="mb-3 text-lg">Sign in to Chat</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <label className="font-bold">Email: </label>
            <input 
              className="px-3 py-2 border rounded-md"
              type='email'
              {...register('email', { required: 'Email cannot be empty' })}
            />
            {errors.email && <small className="pl-2 text-sm">{errors.email.message}</small>}
          </div>
          
          <div className="flex flex-col">
            <label className="font-bold">Password: </label>
            <input
              className="px-3 py-2 border rounded-md"
              type='password'
              {...register('password', { required: 'Enter your password.' })} 
            />
            {errors.password && <small className="pl-2 text-sm">{errors.password.message}</small>}
          </div>
          
          <div className="mt-8">
            <button
              className="block mx-auto px-4 py-2 min-w-[10rem] rounded-lg border"
              type='submit'
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  )
};

export default Login;