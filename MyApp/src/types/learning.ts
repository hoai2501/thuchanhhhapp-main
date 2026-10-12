import type { NavigatorScreenParams } from '@react-navigation/native';

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  semester: string;
  room: string;
  color: string;
  assessments: GradeAssessment[];
  progress: number;
  description: string;
};

export type GradeAssessment = {
  name: string;
  weight: number;
  score: number;
};

export type Lesson = {
  id: string;
  courseId: string;
  weekday: number;
  start: string;
  end: string;
  room: string;
};

export type AssignmentStatus = 'todo' | 'inProgress' | 'completed' | 'overdue';

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  status: AssignmentStatus;
  description: string;
  requirements: string[];
};

export type StudentProfile = {
  id: string;
  name: string;
  className: string;
  major: string;
  cohort: string;
  email: string;
  phone: string;
};

export type MainTabParamList = {
  Overview: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  CourseDetail: { courseId: string };
  LessonDetail: { lessonId: string };
  AssignmentDetail: { assignmentId: string };
  GradeDetail: { courseId: string };
};
