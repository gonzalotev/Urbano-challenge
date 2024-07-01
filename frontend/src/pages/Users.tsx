import { useEffect, useState } from 'react';
import { Loader, Plus, RefreshCw, User, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { Layout, Modal, ThemeButton, UsersTable } from '../components';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const { authenticatedUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    ['users', firstName, lastName, username, role],
    async () => {
      return (
        await userService.findAll({
          firstName: firstName.length >= 3 ? firstName : undefined,
          lastName: lastName.length >= 3 ? lastName : undefined,
          username: username.length >= 3 ? username : undefined,
          role: role || undefined,
        })
      ).filter((user) => user.id !== authenticatedUser.id);
    },
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        firstName.length >= 3 ||
        lastName.length >= 3 ||
        username.length >= 3 ||
        role
      ) {
        refetch();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [firstName, lastName, username, role, refetch]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <User className="text-brand-primary" size={36} />
          <h1 className="font-semibold text-3xl">Manage Users</h1>
        </div>
        <ThemeButton />
      </div>
      <hr className="border-brand-active mb-5" />
      <div className="flex flex-col sm:flex-row gap-2 justify-between my-5">
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddUserShow(true)}
        >
          <Plus /> Add User
        </button>

        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => refetch()}
        >
          <RefreshCw /> Refresh
        </button>
      </div>

      <div className="table-filter mt-2">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <select
            name=""
            id=""
            className="input w-1/2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <UsersTable data={data} isLoading={isLoading} />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex items-center">
          <h1 className="font-semibold mb-3">Add User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr className="border-brand-active mb-5" />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder="Username"
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder="Password (min 6 characters)"
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
