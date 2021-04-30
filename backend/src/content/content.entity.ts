import { Course } from 'src/course/course.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateCreated: Date;

  @Column({ select: false, nullable: false })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.contents)
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
