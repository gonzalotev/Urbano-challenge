import { useMemo, useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { Modal, Table, TableItem } from '../../components';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import userService from '../../services/UserService';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersTable({ data, isLoading }: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 10;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation } = useMutation(
    async (userId: string) => {
      await userService.delete(userId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setDeleteShow(false);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Ocurrió un error');
      },
    },
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUserMutation(selectedUserId);
    } finally {
      setIsDeleting(false);
    }
  };

  const { mutate: updateUserMutation } = useMutation(
    async (data: UpdateUserRequest) => {
      await userService.update(selectedUserId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setUpdateShow(false);
        reset();
        setError(null);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Ocurrió un error');
      },
    },
  );

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await updateUserMutation(updateUserRequest);
    } catch (error) {
      setError(error.response?.data?.message || 'Ocurrió un error');
    }
  };

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (orderBy && order) {
      return [...data].sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      });
    }
    return data;
  }, [data, orderBy, order]);

  const paginatedData = useMemo(() => {
    if (sortedData && sortedData.length > 0) {
      const startIndex = (currentPage - 1) * perPage;
      return sortedData.slice(startIndex, startIndex + perPage);
    }
    return [];
  }, [sortedData, currentPage, perPage]);

  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  return (
    <>
      <div className="table-container dark:bg-gray-800">
        <Table
          columns={['Name', 'Username', 'Status', 'Role']}
          orderBy={orderBy}
          order={order}
          onSort={handleSort}
        >
          {isLoading ? (
            <Loader className="mx-auto animate-spin" />
          ) : (
            paginatedData.map(
              ({ id, firstName, lastName, role, isActive, username }) => (
                <tr key={id}>
                  <TableItem>{`${firstName} ${lastName}`}</TableItem>
                  <TableItem>{username}</TableItem>
                  <TableItem>
                    {isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </TableItem>
                  <TableItem>{role}</TableItem>
                  <TableItem className="text-right">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      onClick={() => {
                        setSelectedUserId(id);

                        setValue('firstName', firstName);
                        setValue('lastName', lastName);
                        setValue('username', username);
                        setValue('role', role);
                        setValue('isActive', isActive);

                        setUpdateShow(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                      onClick={() => {
                        setSelectedUserId(id);
                        setDeleteShow(true);
                      }}
                    >
                      Delete
                    </button>
                  </TableItem>
                </tr>
              ),
            )
          )}
        </Table>

        {!isLoading && data.length === 0 && (
          <div className="text-center my-5 text-gray-500 dark:text-white">
            <h1>Empty</h1>
          </div>
        )}
      </div>
      {/* Delete User Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10 dark:text-white">
          <h3 className="mb-2 font-semibold">Delete User</h3>
          <hr className="border-gray-600 dark:border-white" />
          <p className="mt-2">
            Are you sure you want to delete the user? All of user's data will be
            permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
        {error && (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 dark:bg-red-800 dark:border-red-900">
            {error}
          </div>
        )}
      </Modal>
      {/* Update User Modal */}
      <Modal show={updateShow}>
        <div className="flex dark:text-white">
          <h1 className="font-semibold mb-3">Update User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr className="border-gray-600 dark:border-white" />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2 dark:bg-gray-700 dark:text-white"
              placeholder="First Name"
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2 dark:bg-gray-700 dark:text-white"
              placeholder="Last Name"
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input dark:bg-gray-700 dark:text-white"
            placeholder="Username"
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input dark:bg-gray-700 dark:text-white"
            placeholder="Password"
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input dark:bg-gray-700 dark:text-white"
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <div>
            <label className="font-semibold mr-3 dark:text-white">Active</label>
            <input
              type="checkbox"
              className="input dark:bg-gray-700 dark:text-white w-5 h-5"
              {...register('isActive')}
            />
          </div>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 dark:bg-red-800 dark:border-red-900">
              {error}
            </div>
          )}
        </form>
      </Modal>

      {/* Pagination */}
      <div className="flex justify-between mt-5">
        <button className="btn" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn"
          onClick={nextPage}
          disabled={paginatedData.length < perPage}
        >
          Next
        </button>
      </div>
    </>
  );
}
