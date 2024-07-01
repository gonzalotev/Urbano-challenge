import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike, FindManyOptions } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    const whereClause: any = {};
    const findOptions: FindManyOptions<Course> = {
      where: {},
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    };

    if (courseQuery.name) {
      whereClause.name = ILike(`%${courseQuery.name}%`);
    }
    if (courseQuery.description) {
      whereClause.description = ILike(`%${courseQuery.description}%`);
    }
    if (courseQuery.imageUrl) {
      whereClause.imageUrl = ILike(`%${courseQuery.imageUrl}%`);
    }

    if (courseQuery.sortBy && courseQuery.sortOrder) {
      findOptions.order = {
        [courseQuery.sortBy]: courseQuery.sortOrder,
      };
    }

    if (courseQuery.limit) {
      findOptions.take = courseQuery.limit;
    }

    findOptions.where = whereClause;

    return await Course.find(findOptions);
  }


  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
