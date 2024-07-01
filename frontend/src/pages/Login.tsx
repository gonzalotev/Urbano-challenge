import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import LoginRequest from '../models/auth/LoginRequest';
import authService from '../services/AuthService';

export default function Login() {
  const { setAuthenticatedUser } = useAuth();
  const history = useHistory();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string>();
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();

  const { mutate: login } = useMutation(
    async (loginRequest: LoginRequest) => {
      const data = await authService.login(loginRequest);
      setAuthenticatedUser(data.user);
      queryClient.invalidateQueries('currentUser');
      history.push('/');
    },
    {
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Ocurrió un error');
        if (error.response?.status === 401) {
          handleFailedAttempt();
        }
      },
    },
  );

  const onSubmit = async (loginRequest: LoginRequest) => {
    try {
      await login(loginRequest);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFailedAttempt = () => {
    setFailedAttempts((prevAttempts) => prevAttempts + 1);
    if (failedAttempts >= 2) {
      setIsWaiting(true);
      setTimeout(() => {
        setIsWaiting(false);
        setFailedAttempts(0);
      }, 180000);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="card shadow">
        <h1 className="mb-3 text-center font-semibold text-4xl">Login</h1>
        <hr />
        <form
          className="flex flex-col gap-5 mt-8 w-64"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            className="input sm:text-lg"
            placeholder="Username"
            required
            disabled={isSubmitting || isWaiting}
            {...register('username')}
          />
          <input
            type="password"
            className="input sm:text-lg"
            placeholder="Password"
            required
            disabled={isSubmitting || isWaiting}
            {...register('password')}
          />
          <button
            className="btn mt-3 sm:text-lg"
            type="submit"
            disabled={isSubmitting || isWaiting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Login'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
          {isWaiting && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              Too many failed attempts. Please wait 3 minutes before trying
              again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
