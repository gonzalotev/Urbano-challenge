import { useMemo, useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

import { Modal, Table, TableItem } from '../../components';
import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';

interface UsersTableProps {
  data: Course[];
  isLoading: boolean;
}

export default function CoursesTable({ data, isLoading }: UsersTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
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
  } = useForm<UpdateCourseRequest>();
  const queryClient = useQueryClient();

  const { mutate: deleteCourses } = useMutation(
    (courseId: string) => courseService.delete(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('courses');
        setDeleteShow(false);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Ocurrió un error');
      },
    },
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCourses(selectedCourseId);
    setIsDeleting(false);
  };

  const { mutate: updateCourse } = useMutation(
    (data: UpdateCourseRequest) => courseService.update(selectedCourseId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('courses');
        setUpdateShow(false);
        reset();
        setError(null);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Ocurrió un error');
      },
    },
  );

  const handleUpdate = (updateCourseRequest: UpdateCourseRequest) => {
    updateCourse(updateCourseRequest);
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
      return [...data].sort((a, b) =>
        order === 'asc'
          ? a[orderBy] > b[orderBy]
            ? 1
            : -1
          : a[orderBy] < b[orderBy]
          ? 1
          : -1,
      );
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
          columns={['Name', 'Description', 'Image', 'Created']}
          orderBy={orderBy}
          order={order}
          onSort={handleSort}
        >
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center">
                <Loader className="mx-auto animate-spin" />
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
            paginatedData.map(
              ({ id, name, description, imageUrl, dateCreated }) => (
                <tr key={id}>
                  <TableItem>
                    <Link to={`/courses/${id}`}>{name}</Link>
                  </TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem className="text-center">
                    <img
                      src={imageUrl || '/favicon.png'}
                      alt={name}
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </TableItem>
                  <TableItem>
                    {new Date(dateCreated).toLocaleDateString()}
                  </TableItem>
                  <TableItem className="text-right">
                    {['admin', 'editor'].includes(authenticatedUser.role) && (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedCourseId(id);
                          setValue('name', name);
                          setValue('description', description);
                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {authenticatedUser.role === 'admin' && (
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedCourseId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </TableItem>
                </tr>
              ),
            )
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No courses found.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
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
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        )}
      </Modal>

      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update Course</h1>
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
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <input
            type="text"
            className="input"
            placeholder="Image"
            required
            disabled={isSubmitting}
            {...register('imageUrl')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
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
