import { useState } from 'react';
import { Loader, User } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { Layout, ThemeButton } from '../components';
import useAuth from '../hooks/useAuth';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import userService from '../services/UserService';

export default function UpdateProfile() {
  const { authenticatedUser } = useAuth();
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    `user-${authenticatedUser.id}`,
    () => userService.findOne(authenticatedUser.id),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (updateUserRequest.username === data.username) {
        delete updateUserRequest.username;
      }
      await userService.update(authenticatedUser.id, updateUserRequest);
      setError(null);
      setValue('password', '');
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  if (!isLoading) {
    return (
      <Layout>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-500">
            <User className="w-12 h-12 text-brand-primary dark:text-dark-primary" />
          </div>
          <ThemeButton />
        </div>

        <div className="card shadow-lg p-6 dark:text-white">
          <form
            className="flex mt-3 flex-col gap-5 justify-center md:w-1/2 lg:w-1/3 mx-auto items-center"
            onSubmit={handleSubmit(handleUpdateUser)}
          >
            <h1 className="font-semibold text-4xl mb-5 text-center">{`Welcome, ${data.firstName}`}</h1>
            <hr className="w-full" />
            <div className="flex gap-3 w-full">
              <div className="w-1/2">
                <label className="font-semibold block mb-2">First Name</label>
                <input
                  type="text"
                  className="input w-full"
                  defaultValue={data.firstName}
                  disabled={isSubmitting}
                  placeholder="First Name"
                  {...register('firstName')}
                />
              </div>
              <div className="w-1/2">
                <label className="font-semibold block mb-2">Last Name</label>
                <input
                  type="text"
                  className="input w-full"
                  defaultValue={data.lastName}
                  disabled={isSubmitting}
                  placeholder="Last Name"
                  {...register('lastName')}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-semibold block mb-2">Username</label>
              <input
                type="text"
                className="input w-full"
                defaultValue={data.username}
                disabled={isSubmitting}
                placeholder="Username"
                {...register('username')}
              />
            </div>
            <div className="w-full">
              <label className="font-semibold block mb-2">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Password (min 6 characters)"
                disabled={isSubmitting}
                {...register('password')}
              />
            </div>
            <button className="btn w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                'Update'
              )}
            </button>
            {error && (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 dark:bg-red-800 dark:text-red-200">
                {error}
              </div>
            )}
          </form>
        </div>
      </Layout>
    );
  }

  return null;
}
