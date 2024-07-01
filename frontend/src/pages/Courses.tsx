import { useState } from 'react';
import { BookOpen, Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { CoursesTable, Layout, Modal, ThemeButton } from '../components';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
      }),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="text-brand-primary" size={36} />
          <h1 className="font-semibold text-3xl">Manage Courses</h1>
        </div>
        <ThemeButton />
      </div>
      <hr className="border-brand-active mb-5" />
      {authenticatedUser.role !== 'user' && (
        <div className="flex flex-col sm:flex-row gap-2 justify-between my-5">
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Add Course
          </button>
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => refetch()}
          >
            <RefreshCw /> Refresh
          </button>
        </div>
      )}

      <div className="table-filter mb-5">
        <div className="flex flex-col md:flex-row gap-5">
          <input
            type="text"
            className="input w-full md:w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-full md:w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <CoursesTable data={data} isLoading={isLoading} />

      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <input
            type="text"
            className="input"
            placeholder="Image"
            disabled={isSubmitting}
            required
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
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 dark:bg-red-800 dark:text-red-200">
              {error}
            </div>
          )}
        </form>
      </Modal>
    </Layout>
  );
}
