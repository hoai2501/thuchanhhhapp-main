import { Assignment, Course, Lesson, StudentProfile } from '../types/learning';

export const currentSemester = 'Học kỳ 1 · 2026–2027';

export const initialStudent: StudentProfile = {
  id: '22520341',
  name: 'Nguyễn Minh Anh',
  className: 'KTPM2022.1',
  major: 'Kỹ thuật phần mềm',
  cohort: 'K17 · 2022–2026',
  email: 'minhanh@student.edu.vn',
  phone: '0987 654 321',
};

export const courses: Course[] = [
  {
    id: 'mobile',
    code: 'SE405',
    name: 'Lập trình di động',
    credits: 3,
    lecturer: 'ThS. Nguyễn Quốc Bảo',
    semester: currentSemester,
    room: 'A.302',
    color: '#6558D3',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8.5 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 8.5 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8.8 },
    ],
    progress: 72,
    description:
      'Phát triển ứng dụng di động đa nền tảng với React Native, tập trung vào kiến trúc giao diện, điều hướng và kết nối dữ liệu.',
  },
  {
    id: 'database',
    code: 'SE312',
    name: 'Cơ sở dữ liệu nâng cao',
    credits: 3,
    lecturer: 'TS. Trần Thu Hà',
    semester: currentSemester,
    room: 'B.204',
    color: '#168F87',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 8 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8 },
    ],
    progress: 58,
    description:
      'Thiết kế cơ sở dữ liệu, tối ưu truy vấn, giao dịch và các kỹ thuật lưu trữ dữ liệu hiện đại.',
  },
  {
    id: 'ai',
    code: 'CS401',
    name: 'Nhập môn trí tuệ nhân tạo',
    credits: 3,
    lecturer: 'TS. Phạm Hoàng Long',
    semester: currentSemester,
    room: 'C.105',
    color: '#E58B42',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Bài tập & thực hành', weight: 30, score: 9 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 9 },
      { name: 'Thi cuối kỳ', weight: 40, score: 9 },
    ],
    progress: 84,
    description:
      'Các nền tảng về tìm kiếm, biểu diễn tri thức và học máy cùng những ứng dụng AI trong thực tế.',
  },
  {
    id: 'ux',
    code: 'SE322',
    name: 'Thiết kế trải nghiệm người dùng',
    credits: 2,
    lecturer: 'ThS. Lê Thanh Vy',
    semester: currentSemester,
    room: 'D.401',
    color: '#D45E7A',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 9 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8.5 },
    ],
    progress: 66,
    description:
      'Nghiên cứu người dùng, xây dựng luồng trải nghiệm, tạo mẫu và đánh giá tính khả dụng của sản phẩm số.',
  },
  {
    id: 'english',
    code: 'ENG302',
    name: 'Tiếng Anh chuyên ngành CNTT',
    credits: 2,
    lecturer: 'Cô Đặng Ngọc Mai',
    semester: currentSemester,
    room: 'A.106',
    color: '#3D82C4',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 8.5 },
      { name: 'Bài tập & thực hành', weight: 30, score: 7.5 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 8 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8 },
    ],
    progress: 48,
    description:
      'Phát triển kỹ năng đọc hiểu tài liệu, thuyết trình và giao tiếp tiếng Anh trong môi trường công nghệ.',
  },
  {
    id: 'algorithms',
    code: 'CS303',
    name: 'Phân tích và thiết kế thuật toán',
    credits: 3,
    lecturer: 'TS. Nguyễn Thành Đạt',
    semester: 'Học kỳ 2 · 2025–2026',
    room: 'B.302',
    color: '#4277B8',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 8 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8.5 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 7.5 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8 },
    ],
    progress: 100,
    description:
      'Phân tích độ phức tạp và thiết kế các thuật toán nền tảng như chia để trị, quy hoạch động và tham lam.',
  },
  {
    id: 'web',
    code: 'SE301',
    name: 'Phát triển ứng dụng web',
    credits: 3,
    lecturer: 'ThS. Vũ Hải Yến',
    semester: 'Học kỳ 2 · 2025–2026',
    room: 'A.201',
    color: '#B66B44',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 8.5 },
      { name: 'Thi cuối kỳ', weight: 40, score: 8 },
    ],
    progress: 100,
    description:
      'Xây dựng ứng dụng web theo mô hình client-server, làm việc với API, xác thực và cơ sở dữ liệu.',
  },
  {
    id: 'software-design',
    code: 'SE202',
    name: 'Phương pháp phát triển phần mềm',
    credits: 3,
    lecturer: 'TS. Lâm Ngọc Sơn',
    semester: 'Học kỳ 1 · 2025–2026',
    room: 'C.203',
    color: '#8A66B2',
    assessments: [
      { name: 'Chuyên cần', weight: 10, score: 8.5 },
      { name: 'Bài tập & thực hành', weight: 30, score: 8 },
      { name: 'Kiểm tra giữa kỳ', weight: 20, score: 8 },
      { name: 'Thi cuối kỳ', weight: 40, score: 7.5 },
    ],
    progress: 100,
    description:
      'Tìm hiểu quy trình phát triển phần mềm, quản lý yêu cầu, kiểm thử và phương pháp Agile/Scrum.',
  },
];

const today = new Date();
const weekdayFor = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  const day = date.getDay();
  return day === 0 ? 7 : day;
};

const dateFor = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const lessons: Lesson[] = [
  {
    id: 'lesson-mobile',
    courseId: 'mobile',
    weekday: 1,
    start: '07:30',
    end: '10:00',
    room: 'A.302',
  },
  {
    id: 'lesson-ai',
    courseId: 'ai',
    weekday: 1,
    start: '13:00',
    end: '15:30',
    room: 'C.105',
  },
  {
    id: 'lesson-database',
    courseId: 'database',
    weekday: 2,
    start: '09:30',
    end: '12:00',
    room: 'B.204',
  },
  {
    id: 'lesson-ux',
    courseId: 'ux',
    weekday: 3,
    start: '07:30',
    end: '09:00',
    room: 'D.401',
  },
  {
    id: 'lesson-english',
    courseId: 'english',
    weekday: 3,
    start: '13:00',
    end: '14:30',
    room: 'A.106',
  },
  {
    id: 'lesson-mobile-lab',
    courseId: 'mobile',
    weekday: 4,
    start: '13:00',
    end: '15:30',
    room: 'Lab. 02',
  },
  {
    id: 'lesson-ai-lab',
    courseId: 'ai',
    weekday: 5,
    start: '09:30',
    end: '12:00',
    room: 'C.105',
  },
  {
    id: 'lesson-database-lab',
    courseId: 'database',
    weekday: 5,
    start: '13:00',
    end: '15:30',
    room: 'B.204',
  },
  {
    id: 'lesson-today',
    courseId: 'ux',
    weekday: weekdayFor(0),
    start: '16:00',
    end: '17:30',
    room: 'D.401',
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: 'assignment-prototype',
    courseId: 'mobile',
    title: 'Hoàn thiện ứng dụng quản lý học tập',
    dueDate: dateFor(2),
    status: 'inProgress',
    description:
      'Xây dựng ứng dụng React Native giúp sinh viên theo dõi môn học, lịch học, bài tập và kết quả học tập.',
    requirements: [
      'Thiết kế giao diện thân thiện với thiết bị di động.',
      'Sử dụng Bottom Tab và Stack Navigation.',
      'Nộp source code cùng video giới thiệu sản phẩm.',
    ],
  },
  {
    id: 'assignment-query',
    courseId: 'database',
    title: 'Tối ưu truy vấn dữ liệu',
    dueDate: dateFor(4),
    status: 'todo',
    description:
      'Phân tích và tối ưu các truy vấn trên bộ dữ liệu bán hàng mẫu.',
    requirements: [
      'So sánh kế hoạch thực thi trước và sau tối ưu.',
      'Giải thích chỉ mục được sử dụng.',
    ],
  },
  {
    id: 'assignment-ai',
    courseId: 'ai',
    title: 'Bài tập tìm kiếm A*',
    dueDate: dateFor(-2),
    status: 'overdue',
    description:
      'Cài đặt thuật toán tìm kiếm A* để giải quyết bài toán đường đi trên bản đồ.',
    requirements: [
      'Trình bày hàm heuristic.',
      'Nộp mã nguồn và báo cáo kết quả thử nghiệm.',
    ],
  },
  {
    id: 'assignment-persona',
    courseId: 'ux',
    title: 'Nghiên cứu người dùng và persona',
    dueDate: dateFor(1),
    status: 'todo',
    description:
      'Thực hiện phỏng vấn nhanh và xây dựng persona cho sản phẩm nhóm.',
    requirements: [
      'Tổng hợp ít nhất 5 phản hồi người dùng.',
      'Trình bày insight và persona trên một trang.',
    ],
  },
  {
    id: 'assignment-glossary',
    courseId: 'english',
    title: 'Thuật ngữ công nghệ',
    dueDate: dateFor(-1),
    status: 'completed',
    description: 'Tạo bảng thuật ngữ tiếng Anh chuyên ngành và ví dụ sử dụng.',
    requirements: ['Tối thiểu 20 thuật ngữ có định nghĩa và ví dụ.'],
  },
];

export const weekdayName = (weekday: number) =>
  ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'][
    weekday - 1
  ];

export const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const currentWeekday = weekdayFor(0);

export const courseGrade = (course: Course) =>
  course.assessments.reduce(
    (total, assessment) => total + assessment.score * assessment.weight,
    0,
  ) /
  course.assessments.reduce(
    (total, assessment) => total + assessment.weight,
    0,
  );

export const currentSemesterCourses = courses.filter(
  course => course.semester === currentSemester,
);
