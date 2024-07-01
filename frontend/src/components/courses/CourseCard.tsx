import { useQuery } from 'react-query';

import { useTheme } from '../../context/ThemeContext';
import CourseService from '../../services/CourseService';

interface CourseCardProps {
  name?: string;
  description?: string;
  imageUrl?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ name, description }) => {
  const { darkMode } = useTheme();
  const { data, isLoading } = useQuery(['courses', name, description], () =>
    CourseService.findAll({
      name: name || undefined,
      description: description || undefined,
      sortBy: 'dateCreated',
      sortOrder: 'DESC',
      limit: 6,
    }),
  );

  return (
    <section className="my-8">
      <h2 className="text-2xl font-semibold mb-5">Últimos Cursos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          data?.map((course) => (
            <div
              key={course.id}
              className={`max-w-sm rounded overflow-hidden shadow-lg ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
              }`}
            >
              <div className="w-full h-48 overflow-hidden">
                <img
                  className="w-full h-full"
                  src={course?.imageUrl || '/urbano-logo.png'}
                  alt={course.name}
                />
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{course.name}</div>
                <p className="text-gray-700 text-base dark:text-white">
                  {course.description}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #course
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {new Date(course.dateCreated).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseCard;
