import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  Assignment,
  AssignmentStatus,
  Course,
  Lesson,
  RootStackParamList,
  StudentProfile,
} from '../types/learning';
import {
  courseGrade,
  courses,
  currentSemester,
  currentSemesterCourses,
  currentWeekday,
  formatDate,
  lessons,
  weekdayName,
} from '../data/learningData';
import {
  EmptyState,
  FilterChip,
  Page,
  PageHeader,
  SearchField,
  SectionHeading,
  palette,
} from '../components/StudyUI';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type AssignmentProps = { assignments: Assignment[] };

const statusLabels: Record<AssignmentStatus, string> = {
  todo: 'Chưa làm',
  inProgress: 'Đang làm',
  completed: 'Hoàn thành',
  overdue: 'Quá hạn',
};

const statusColors: Record<AssignmentStatus, { text: string; bg: string }> = {
  todo: { text: '#66738A', bg: '#F0F2F6' },
  inProgress: { text: palette.primary, bg: palette.paleBlue },
  completed: { text: palette.green, bg: palette.paleGreen },
  overdue: { text: palette.red, bg: palette.paleRed },
};

const courseFor = (id: string) => courses.find(course => course.id === id);

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function assignmentStatus(assignment: Assignment): AssignmentStatus {
  if (assignment.status === 'completed') {
    return 'completed';
  }
  const now = new Date();
  return assignment.dueDate < dateKey(now) ? 'overdue' : assignment.status;
}

const averageGrade =
  currentSemesterCourses.reduce(
    (total, course) => total + courseGrade(course) * course.credits,
    0,
  ) /
  currentSemesterCourses.reduce((total, course) => total + course.credits, 0);

function CourseCard({
  course,
  onPress,
}: {
  course: Course;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.courseCard} onPress={onPress}>
      <View
        style={[styles.courseMark, { backgroundColor: course.color + '18' }]}
      >
        <View style={[styles.courseDot, { backgroundColor: course.color }]} />
      </View>
      <View style={styles.courseInfo}>
        <View style={styles.courseMeta}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseCredits}>{course.credits} tín chỉ</Text>
        </View>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseLecturer}>{course.lecturer}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function AssignmentCard({
  assignment,
  onPress,
}: {
  assignment: Assignment;
  onPress: () => void;
}) {
  const course = courseFor(assignment.courseId);
  const status = assignmentStatus(assignment);
  const badge = statusColors[status];
  const now = new Date();
  const today = dateKey(now);
  const soonLimit = new Date(now);
  soonLimit.setDate(soonLimit.getDate() + 3);
  const dueToday = assignment.dueDate === today;
  const dueSoon =
    status !== 'completed' &&
    assignment.dueDate > today &&
    assignment.dueDate <= dateKey(soonLimit);
  return (
    <Pressable
      style={[
        styles.assignmentCard,
        status === 'overdue' && styles.overdueCard,
        dueSoon && styles.dueSoonCard,
      ]}
      onPress={onPress}
    >
      <View style={[styles.assignmentIcon, { backgroundColor: badge.bg }]}>
        <Text style={[styles.assignmentIconText, { color: badge.text }]}>
          {status === 'completed' ? '✓' : '▤'}
        </Text>
      </View>
      <View style={styles.assignmentInfo}>
        <Text style={styles.assignmentCourse}>{course?.code ?? 'Môn học'}</Text>
        <Text style={styles.assignmentTitle} numberOfLines={2}>
          {assignment.title}
        </Text>
        <Text style={[styles.dueText, dueSoon && styles.dueSoonText]}>
          {dueToday
            ? 'Hạn hôm nay'
            : `Hạn nộp ${formatDate(assignment.dueDate)}`}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.statusText, { color: badge.text }]}>
          {statusLabels[status]}
        </Text>
      </View>
    </Pressable>
  );
}

function LessonCard({
  lesson,
  onPress,
  compact = false,
}: {
  lesson: Lesson;
  onPress: () => void;
  compact?: boolean;
}) {
  const course = courseFor(lesson.courseId);
  const weekdayOffset = lesson.weekday - currentWeekday;
  const currentTime = new Date().toTimeString().slice(0, 5);
  const state =
    weekdayOffset < 0 || (weekdayOffset === 0 && lesson.end <= currentTime)
      ? 'past'
      : weekdayOffset === 0 && lesson.start <= currentTime
      ? 'ongoing'
      : 'upcoming';
  const stateLabel =
    state === 'past'
      ? 'Đã kết thúc'
      : state === 'ongoing'
      ? 'Đang diễn ra'
      : 'Sắp diễn ra';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.lessonCard,
        state === 'past' && styles.lessonPast,
        state === 'ongoing' && styles.lessonOngoing,
      ]}
    >
      <View style={[styles.lessonRail, { backgroundColor: course?.color }]} />
      <View style={styles.lessonTime}>
        <Text style={styles.lessonStart}>{lesson.start}</Text>
        <Text style={styles.lessonEnd}>{lesson.end}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonName}>{course?.name ?? 'Môn học'}</Text>
        <Text style={styles.lessonMeta}>
          {lesson.room} · {course?.lecturer}
        </Text>
        {!compact ? (
          <Text
            style={[
              styles.lessonState,
              state === 'past' && styles.lessonStatePast,
              state === 'ongoing' && styles.lessonStateOngoing,
            ]}
          >
            {stateLabel}
          </Text>
        ) : null}
      </View>
      {!compact ? <Text style={styles.chevron}>›</Text> : null}
    </Pressable>
  );
}

export function DashboardScreen({
  student,
  assignments,
}: {
  student: StudentProfile;
  assignments: Assignment[];
}) {
  const navigation = useNavigation<Navigation>();
  const todayLessons = lessons
    .filter(item => item.weekday === currentWeekday)
    .filter(item => courseFor(item.courseId)?.semester === currentSemester);
  const upcoming = assignments
    .filter(item => {
      const status = assignmentStatus(item);
      return status === 'todo' || status === 'inProgress';
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <Page scroll>
      <PageHeader
        subtitle="THỨC DẬY VÀ CHINH PHỤC"
        title={`Chào ${student.name.split(' ').slice(-1)[0]} `}
        right={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MA</Text>
          </View>
        }
      />
      <View style={styles.studentBanner}>
        <View style={styles.bannerTop}>
          <View>
            <Text style={styles.bannerLabel}>SINH VIÊN</Text>
            <Text style={styles.bannerName}>{student.name}</Text>
          </View>
          <View style={styles.bannerId}>
            <Text style={styles.bannerIdText}>{student.id}</Text>
          </View>
        </View>
        <View style={styles.bannerDivider} />
        <View style={styles.bannerBottom}>
          <Text style={styles.bannerDetail}>{student.className}</Text>
          <Text style={styles.bannerDetail}>·</Text>
          <Text style={styles.bannerDetail}>{student.major}</Text>
        </View>
        <View style={styles.bannerOrb} />
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ĐIỂM TRUNG BÌNH</Text>
          <Text style={styles.metricValue}>{averageGrade.toFixed(2)}</Text>
          <Text style={styles.metricHint}>/ 10.0 · Học kỳ này</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardAccent]}>
          <Text style={styles.metricLabel}>CẦN HOÀN THÀNH</Text>
          <Text style={styles.metricValue}>
            {
              assignments.filter(a => {
                const status = assignmentStatus(a);
                return status !== 'completed';
              }).length
            }
          </Text>
          <Text style={styles.metricHint}>bài tập đang chờ</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeading
          title="Lịch học hôm nay"
          action="Thời khóa biểu  ›"
          onAction={() =>
            navigation.navigate('MainTabs', { screen: 'Schedule' })
          }
        />
        {todayLessons.length ? (
          todayLessons.map(item => (
            <LessonCard
              key={item.id}
              lesson={item}
              onPress={() =>
                navigation.navigate('LessonDetail', { lessonId: item.id })
              }
              compact
            />
          ))
        ) : (
          <Text style={styles.inlineEmpty}>
            Hôm nay bạn không có tiết học nào.
          </Text>
        )}
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeading
          title="Môn học của bạn"
          action="Tất cả  ›"
          onAction={() =>
            navigation.navigate('MainTabs', { screen: 'Courses' })
          }
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {currentSemesterCourses.slice(0, 4).map(course => (
            <Pressable
              key={course.id}
              onPress={() =>
                navigation.navigate('CourseDetail', { courseId: course.id })
              }
              style={[styles.miniCourse, { borderTopColor: course.color }]}
            >
              <Text style={styles.miniCode}>{course.code}</Text>
              <Text style={styles.miniName} numberOfLines={2}>
                {course.name}
              </Text>
              <Text style={styles.miniGrade}>
                {courseGrade(course).toFixed(1)}{' '}
                <Text style={styles.miniGradeLabel}>điểm</Text>
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeading
          title="Sắp đến hạn"
          action="Xem tất cả  ›"
          onAction={() =>
            navigation.navigate('MainTabs', { screen: 'Assignments' })
          }
        />
        {upcoming.map(item => (
          <AssignmentCard
            key={item.id}
            assignment={item}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: item.id })
            }
          />
        ))}
      </View>
    </Page>
  );
}

export function CoursesScreen() {
  const navigation = useNavigation<Navigation>();
  const [query, setQuery] = useState('');
  const [semester, setSemester] = useState('Tất cả');
  const semesters = [
    'Tất cả',
    ...new Set(courses.map(course => course.semester)),
  ];
  const filtered = courses.filter(course => {
    const matchesQuery = `${course.code} ${course.name}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return (
      matchesQuery && (semester === 'Tất cả' || course.semester === semester)
    );
  });

  return (
    <Page>
      <PageHeader
        title="Môn học"
        subtitle={`${courses.length} MÔN ĐÃ ĐĂNG KÝ`}
      />
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm mã hoặc tên môn học..."
      />
      <ScrollView
        horizontal
        style={styles.filterScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {semesters.map(item => (
          <FilterChip
            key={item}
            label={item === 'Tất cả' ? item : item.replace('Học kỳ ', 'HK ')}
            selected={semester === item}
            onPress={() => setSemester(item)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listCaption}>
            DANH SÁCH HỌC PHẦN · {filtered.length}
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            message="Thử tìm với mã môn hoặc tên khác nhé."
          />
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate('CourseDetail', { courseId: item.id })
            }
          />
        )}
      />
    </Page>
  );
}

export function ScheduleScreen() {
  const navigation = useNavigation<Navigation>();
  const [selectedDay, setSelectedDay] = useState(currentWeekday);
  const days = [1, 2, 3, 4, 5, 6, 7];
  const dayLessons = lessons
    .filter(item => item.weekday === selectedDay)
    .sort((a, b) => a.start.localeCompare(b.start));
  const today = new Date();

  return (
    <Page>
      <PageHeader
        title="Thời khóa biểu"
        subtitle={currentSemester.toUpperCase()}
      />
      <View style={styles.weekStrip}>
        {days.map((day, index) => {
          const date = new Date(today);
          const dayOffset = day - currentWeekday;
          date.setDate(date.getDate() + dayOffset);
          const selected = selectedDay === day;
          return (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayCell, selected && styles.dayCellSelected]}
            >
              <Text
                style={[styles.dayName, selected && styles.dayNameSelected]}
              >
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index]}
              </Text>
              <Text
                style={[styles.dayNumber, selected && styles.dayNameSelected]}
              >
                {date.getDate()}
              </Text>
              {lessons.some(item => item.weekday === day) ? (
                <View
                  style={[styles.dayDot, selected && styles.dayDotSelected]}
                />
              ) : (
                <View style={styles.dayDotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.scheduleHeading}>
        <View>
          <Text style={styles.scheduleDayTitle}>
            {weekdayName(selectedDay)}
          </Text>
          <Text style={styles.scheduleSub}>
            {dayLessons.length} buổi học trong ngày
          </Text>
        </View>
        <Text style={styles.calendarMark}>▦</Text>
      </View>
      <FlatList
        data={dayLessons}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scheduleList}
        ListEmptyComponent={
          <EmptyState
            title="Ngày nghỉ ngơi"
            message="Không có buổi học nào trong ngày này."
          />
        }
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            onPress={() =>
              navigation.navigate('LessonDetail', { lessonId: item.id })
            }
          />
        )}
      />
    </Page>
  );
}

const assignmentFilters: { label: string; value: AssignmentStatus | 'all' }[] =
  [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chưa làm', value: 'todo' },
    { label: 'Đang làm', value: 'inProgress' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Quá hạn', value: 'overdue' },
  ];

export function AssignmentsScreen({ assignments }: AssignmentProps) {
  const navigation = useNavigation<Navigation>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AssignmentStatus | 'all'>('all');
  const filtered = useMemo(
    () =>
      assignments
        .filter(item => {
          const titleMatches = item.title
            .toLowerCase()
            .includes(query.trim().toLowerCase());
          const statusMatches =
            filter === 'all' || assignmentStatus(item) === filter;
          return titleMatches && statusMatches;
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [assignments, filter, query],
  );

  return (
    <Page>
      <PageHeader title="Bài tập" subtitle="THEO DÕI TIẾN ĐỘ HỌC TẬP" />
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm bài tập..."
      />
      <ScrollView
        horizontal
        style={styles.filterScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {assignmentFilters.map(item => (
          <FilterChip
            key={item.value}
            label={item.label}
            selected={filter === item.value}
            onPress={() => setFilter(item.value)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listCaption}>{filtered.length} BÀI TẬP</Text>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có bài tập phù hợp"
            message="Thử đổi bộ lọc hoặc từ khóa tìm kiếm."
          />
        }
        renderItem={({ item }) => (
          <AssignmentCard
            assignment={item}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: item.id })
            }
          />
        )}
      />
    </Page>
  );
}

export function ProfileScreen({
  student,
  onUpdateStudent,
}: {
  student: StudentProfile;
  onUpdateStudent: (student: StudentProfile) => void;
}) {
  const navigation = useNavigation<Navigation>();
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEmail(student.email);
    setPhone(student.phone);
  }, [student.email, student.phone]);

  const saveContact = () => {
    if (!email.trim() || !email.includes('@') || !phone.trim()) {
      Alert.alert(
        'Thông tin chưa hợp lệ',
        'Vui lòng kiểm tra email và số điện thoại.',
      );
      return;
    }
    onUpdateStudent({ ...student, email: email.trim(), phone: phone.trim() });
    setIsEditing(false);
    Alert.alert('Đã cập nhật', 'Thông tin liên hệ của bạn đã được lưu.');
  };

  return (
    <Page scroll>
      <PageHeader title="Cá nhân" subtitle="HỒ SƠ & KẾT QUẢ HỌC TẬP" />
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>MA</Text>
        </View>
        <Text style={styles.profileName}>{student.name}</Text>
        <Text style={styles.profileMajor}>{student.major}</Text>
        <View style={styles.profileTag}>
          <Text style={styles.profileTagText}>MSSV {student.id}</Text>
        </View>
      </View>
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ĐIỂM TRUNG BÌNH</Text>
          <Text style={styles.metricValue}>{averageGrade.toFixed(2)}</Text>
          <Text style={styles.metricHint}>Hệ 10 · Học kỳ này</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TÍN CHỈ TÍCH LŨY</Text>
          <Text style={styles.metricValue}>
            {courses.reduce((sum, item) => sum + item.credits, 0)}
          </Text>
          <Text style={styles.metricHint}>đã có kết quả</Text>
        </View>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Thông tin sinh viên" />
        <View style={styles.infoPanel}>
          <InfoLine label="Lớp" value={student.className} />
          <InfoLine label="Ngành học" value={student.major} />
          <InfoLine label="Khóa học" value={student.cohort} last />
        </View>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading
          title="Thông tin liên hệ"
          action={isEditing ? 'Hủy' : 'Chỉnh sửa'}
          onAction={() => setIsEditing(!isEditing)}
        />
        <View style={styles.infoPanel}>
          <Text style={styles.fieldLabel}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.contactInput, !isEditing && styles.contactReadOnly]}
          />
          <Text style={styles.fieldLabel}>SỐ ĐIỆN THOẠI</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            keyboardType="phone-pad"
            style={[styles.contactInput, !isEditing && styles.contactReadOnly]}
          />
          {isEditing ? (
            <Pressable onPress={saveContact} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Kết quả học tập" />
        <View style={styles.infoPanel}>
          {courses.map((course, index) => (
            <Pressable
              key={course.id}
              onPress={() =>
                navigation.navigate('GradeDetail', { courseId: course.id })
              }
              style={[
                styles.gradeRow,
                index === courses.length - 1 && styles.noBorder,
              ]}
            >
              <View
                style={[styles.gradeDot, { backgroundColor: course.color }]}
              />
              <View style={styles.gradeCourse}>
                <Text style={styles.gradeCourseName}>{course.name}</Text>
                <Text style={styles.gradeCourseMeta}>
                  {course.code} · {course.credits} tín chỉ
                </Text>
              </View>
              <Text style={styles.gradeValue}>
                {courseGrade(course).toFixed(1)}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Page>
  );
}

function InfoLine({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoLine, last && styles.noBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function CourseDetailScreen({
  courseId,
  assignments,
}: {
  courseId: string;
  assignments: Assignment[];
}) {
  const navigation = useNavigation<Navigation>();
  const course = courseFor(courseId);
  if (!course) {
    return (
      <Page>
        <EmptyState
          title="Không tìm thấy môn học"
          message="Môn học này không còn trong danh sách."
        />
      </Page>
    );
  }
  const courseLessons = lessons.filter(item => item.courseId === course.id);
  const courseAssignments = assignments.filter(
    item => item.courseId === course.id,
  );
  return (
    <DetailPage title="Chi tiết môn học" subtitle={course.code}>
      <View style={[styles.detailHero, { backgroundColor: course.color }]}>
        <Text style={styles.detailEyebrow}>
          HỌC PHẦN · {course.credits} TÍN CHỈ
        </Text>
        <Text style={styles.detailTitle}>{course.name}</Text>
        <Text style={styles.detailSubtitle}>{course.lecturer}</Text>
        <View style={styles.detailHeroBottom}>
          <Text style={styles.detailHeroMeta}>{course.semester}</Text>
          <Text style={styles.detailScore}>
            {courseGrade(course).toFixed(1)}
            <Text style={styles.detailScoreSmall}> / 10</Text>
          </Text>
        </View>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Giới thiệu học phần" />
        <Text style={styles.description}>{course.description}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${course.progress}%`, backgroundColor: course.color },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          Tiến độ học tập · {course.progress}%
        </Text>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Lịch học" />
        {courseLessons.length ? (
          courseLessons.map(item => (
            <LessonCard
              key={item.id}
              lesson={item}
              onPress={() =>
                navigation.navigate('LessonDetail', { lessonId: item.id })
              }
            />
          ))
        ) : (
          <Text style={styles.inlineEmpty}>
            Học phần đã kết thúc, không có lịch học trong tuần hiện tại.
          </Text>
        )}
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Bài tập môn học" />
        {courseAssignments.length ? (
          courseAssignments.map(item => (
            <AssignmentCard
              key={item.id}
              assignment={item}
              onPress={() =>
                navigation.navigate('AssignmentDetail', {
                  assignmentId: item.id,
                })
              }
            />
          ))
        ) : (
          <Text style={styles.inlineEmpty}>Chưa có bài tập.</Text>
        )}
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate('GradeDetail', { courseId: course.id })
        }
        style={styles.gradeDetailButton}
      >
        <Text style={styles.gradeDetailButtonText}>Xem kết quả học tập ›</Text>
      </Pressable>
    </DetailPage>
  );
}

export function LessonDetailScreen({ lessonId }: { lessonId: string }) {
  const lesson = lessons.find(item => item.id === lessonId);
  const course = lesson ? courseFor(lesson.courseId) : undefined;
  if (!lesson || !course) {
    return (
      <Page>
        <EmptyState
          title="Không tìm thấy buổi học"
          message="Buổi học này không còn trong thời khóa biểu."
        />
      </Page>
    );
  }
  return (
    <DetailPage
      title="Chi tiết buổi học"
      subtitle={weekdayName(lesson.weekday)}
    >
      <View style={[styles.detailHero, { backgroundColor: course.color }]}>
        <Text style={styles.detailEyebrow}>
          {course.code} · {weekdayName(lesson.weekday)}
        </Text>
        <Text style={styles.detailTitle}>{course.name}</Text>
        <Text style={styles.detailSubtitle}>{course.lecturer}</Text>
      </View>
      <View style={styles.infoPanel}>
        <InfoLine label="Thời gian" value={`${lesson.start} – ${lesson.end}`} />
        <InfoLine label="Phòng học" value={lesson.room} />
        <InfoLine label="Giảng viên" value={course.lecturer} />
        <InfoLine label="Số tín chỉ" value={`${course.credits} tín chỉ`} last />
      </View>
    </DetailPage>
  );
}

export function AssignmentDetailScreen({
  assignmentId,
  assignments,
  onUpdateAssignment,
}: {
  assignmentId: string;
  assignments: Assignment[];
  onUpdateAssignment: (assignment: Assignment) => void;
}) {
  const assignment = assignments.find(item => item.id === assignmentId);
  const course = assignment ? courseFor(assignment.courseId) : undefined;
  if (!assignment || !course) {
    return (
      <Page>
        <EmptyState
          title="Không tìm thấy bài tập"
          message="Bài tập này không còn trong danh sách."
        />
      </Page>
    );
  }
  const currentStatus = assignmentStatus(assignment);
  return (
    <DetailPage title="Chi tiết bài tập" subtitle={course.code}>
      <View style={styles.assignmentDetailCard}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[currentStatus].bg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColors[currentStatus].text },
            ]}
          >
            {statusLabels[currentStatus]}
          </Text>
        </View>
        <Text style={styles.assignmentDetailTitle}>{assignment.title}</Text>
        <Text style={styles.assignmentCourse}>{course.name}</Text>
        <View style={styles.duePanel}>
          <Text style={styles.duePanelIcon}>◷</Text>
          <View>
            <Text style={styles.fieldLabel}>HẠN NỘP</Text>
            <Text style={styles.duePanelDate}>
              {formatDate(assignment.dueDate)}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Mô tả</Text>
        <Text style={styles.description}>{assignment.description}</Text>
        <Text style={[styles.sectionTitle, styles.spacedSectionTitle]}>
          Yêu cầu
        </Text>
        {assignment.requirements.map((requirement, index) => (
          <View key={requirement} style={styles.requirementRow}>
            <Text style={styles.requirementNumber}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text style={styles.requirementText}>{requirement}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.actionCaption}>CẬP NHẬT TRẠNG THÁI</Text>
      <View style={styles.statusActions}>
        {(['todo', 'inProgress', 'completed'] as AssignmentStatus[]).map(
          status => (
            <Pressable
              key={status}
              onPress={() => onUpdateAssignment({ ...assignment, status })}
              style={[
                styles.statusAction,
                currentStatus === status && {
                  backgroundColor: statusColors[status].bg,
                  borderColor: statusColors[status].text,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusActionText,
                  currentStatus === status && {
                    color: statusColors[status].text,
                  },
                ]}
              >
                {statusLabels[status]}
              </Text>
            </Pressable>
          ),
        )}
      </View>
    </DetailPage>
  );
}

export function GradeDetailScreen({ courseId }: { courseId: string }) {
  const course = courseFor(courseId);
  if (!course) {
    return (
      <Page>
        <EmptyState
          title="Không tìm thấy kết quả"
          message="Hãy quay lại danh sách môn học."
        />
      </Page>
    );
  }
  const grade = courseGrade(course);
  const assessments = course.assessments;
  return (
    <DetailPage title="Kết quả học tập" subtitle={course.code}>
      <View style={[styles.gradeHero, { backgroundColor: course.color }]}>
        <Text style={styles.detailEyebrow}>ĐIỂM TỔNG KẾT</Text>
        <Text style={styles.gradeHeroScore}>{grade.toFixed(1)}</Text>
        <Text style={styles.gradeHeroCourse}>{course.name}</Text>
        <Text style={styles.gradeHeroMeta}>
          {course.credits} tín chỉ · {course.semester}
        </Text>
      </View>
      <View style={styles.sectionBlock}>
        <SectionHeading title="Thành phần điểm" />
        <View style={styles.infoPanel}>
          {assessments.map((item, index) => (
            <View
              key={item.name}
              style={[
                styles.assessmentRow,
                index === assessments.length - 1 && styles.noBorder,
              ]}
            >
              <View style={styles.assessmentName}>
                <Text style={styles.assessmentTitle}>{item.name}</Text>
                <Text style={styles.assessmentWeight}>
                  Trọng số {item.weight}%
                </Text>
              </View>
              <Text style={[styles.assessmentScore, { color: course.color }]}>
                {item.score.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.gradeFootnote}>
        Điểm số được tổng hợp từ dữ liệu học tập mẫu.
      </Text>
    </DetailPage>
  );
}

function DetailPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const navigation = useNavigation<Navigation>();
  return (
    <Page scroll>
      <View style={styles.detailHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.detailHeaderText}>
          <Text style={styles.detailHeaderTitle}>{title}</Text>
          <Text style={styles.detailHeaderSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {children}
    </Page>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#E3E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: palette.primary },
  studentBanner: {
    backgroundColor: '#26365E',
    marginHorizontal: 20,
    borderRadius: 23,
    padding: 20,
    overflow: 'hidden',
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#AFBCE0',
    letterSpacing: 1.2,
  },
  bannerName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bannerId: {
    backgroundColor: '#FFFFFF1A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bannerIdText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  bannerDivider: {
    height: 1,
    backgroundColor: '#FFFFFF24',
    marginVertical: 15,
  },
  bannerBottom: { flexDirection: 'row', gap: 8 },
  bannerDetail: { color: '#D2DAF0', fontSize: 12, fontWeight: '500' },
  bannerOrb: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#FFFFFF0C',
    right: -55,
    bottom: -78,
  },
  metricRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 14,
    gap: 11,
  },
  metricCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 15,
    borderWidth: 1,
    borderColor: palette.line,
  },
  metricCardAccent: { backgroundColor: '#FFF8EF', borderColor: '#F6E8D7' },
  metricLabel: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 7,
  },
  metricHint: { color: palette.muted, fontSize: 10, marginTop: 2 },
  sectionBlock: { marginHorizontal: 20, marginTop: 25 },
  inlineEmpty: {
    color: palette.muted,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    fontSize: 13,
  },
  miniCourse: {
    width: 142,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.line,
    borderTopWidth: 3,
    marginRight: 10,
    padding: 13,
    minHeight: 126,
  },
  miniCode: { fontSize: 10, color: palette.muted, fontWeight: '700' },
  miniName: {
    fontSize: 13,
    color: palette.ink,
    fontWeight: '700',
    marginTop: 9,
    lineHeight: 18,
    flex: 1,
  },
  miniGrade: {
    fontSize: 16,
    color: palette.primary,
    fontWeight: '800',
    marginTop: 8,
  },
  miniGradeLabel: { fontSize: 10, color: palette.muted, fontWeight: '500' },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.line,
  },
  courseMark: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  courseDot: { width: 13, height: 13, borderRadius: 7 },
  courseInfo: { flex: 1 },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseCode: { fontSize: 10, fontWeight: '800', color: palette.primary },
  courseCredits: { fontSize: 10, color: palette.muted },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
    marginTop: 5,
  },
  courseLecturer: { fontSize: 11, color: palette.muted, marginTop: 4 },
  chevron: { fontSize: 25, color: '#B4BDCC', marginLeft: 8 },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    borderWidth: 1,
    borderColor: palette.line,
  },
  overdueCard: { borderColor: '#F2CDD1' },
  dueSoonCard: { borderColor: '#F1D7B8' },
  assignmentIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  assignmentIconText: { fontSize: 18, fontWeight: '800' },
  assignmentInfo: { flex: 1, paddingRight: 6 },
  assignmentCourse: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.primary,
    marginBottom: 4,
  },
  assignmentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.ink,
    lineHeight: 18,
  },
  dueText: { fontSize: 10, color: palette.muted, marginTop: 5 },
  dueSoonText: { color: palette.orange, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 9, fontWeight: '700' },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    marginBottom: 10,
    padding: 14,
    minHeight: 80,
    borderWidth: 1,
    borderColor: palette.line,
    overflow: 'hidden',
  },
  lessonPast: { opacity: 0.58 },
  lessonOngoing: { borderColor: palette.primary },
  lessonRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  lessonTime: { width: 55 },
  lessonStart: { fontSize: 13, color: palette.ink, fontWeight: '800' },
  lessonEnd: { fontSize: 10, color: palette.muted, marginTop: 4 },
  lessonInfo: { flex: 1, paddingLeft: 5 },
  lessonName: { fontSize: 13, fontWeight: '700', color: palette.ink },
  lessonMeta: { fontSize: 10, color: palette.muted, marginTop: 6 },
  lessonState: {
    fontSize: 9,
    color: palette.primary,
    fontWeight: '700',
    marginTop: 5,
  },
  lessonStatePast: { color: palette.muted },
  lessonStateOngoing: { color: palette.green },
  filterScroll: { flexGrow: 0, flexShrink: 0, height: 54 },
  chipScroll: {
    height: 54,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 28, flexGrow: 1 },
  listCaption: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.muted,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 12,
  },
  weekStrip: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 8,
    borderWidth: 1,
    borderColor: palette.line,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  dayCellSelected: { backgroundColor: palette.primary },
  dayName: { fontSize: 9, color: palette.muted, fontWeight: '700' },
  dayNameSelected: { color: '#FFFFFF' },
  dayNumber: {
    fontSize: 15,
    color: palette.ink,
    fontWeight: '800',
    marginTop: 7,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.primary,
    marginTop: 6,
  },
  dayDotSelected: { backgroundColor: '#FFFFFF' },
  dayDotPlaceholder: { height: 4, marginTop: 6 },
  scheduleHeading: {
    marginHorizontal: 22,
    marginTop: 27,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleDayTitle: { fontSize: 18, fontWeight: '800', color: palette.ink },
  scheduleSub: { fontSize: 11, color: palette.muted, marginTop: 4 },
  calendarMark: { fontSize: 23, color: palette.primary },
  scheduleList: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    alignItems: 'center',
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.line,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: '#E8EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.primary,
  },
  profileName: {
    fontSize: 20,
    color: palette.ink,
    fontWeight: '800',
    marginTop: 13,
  },
  profileMajor: { fontSize: 12, color: palette.muted, marginTop: 5 },
  profileTag: {
    backgroundColor: palette.paleBlue,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 12,
  },
  profileTagText: { fontSize: 10, color: palette.primary, fontWeight: '800' },
  infoPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 16,
  },
  infoLine: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: { fontSize: 12, color: palette.muted },
  infoValue: {
    fontSize: 12,
    color: palette.ink,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: palette.muted,
    letterSpacing: 0.7,
    marginTop: 13,
  },
  contactInput: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  contactReadOnly: { borderBottomColor: 'transparent' },
  saveButton: {
    backgroundColor: palette.primary,
    borderRadius: 13,
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 15,
    marginBottom: 4,
  },
  saveButtonText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  gradeRow: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  noBorder: { borderBottomWidth: 0 },
  gradeDot: { width: 9, height: 9, borderRadius: 5, marginRight: 11 },
  gradeCourse: { flex: 1 },
  gradeCourseName: { fontSize: 12, fontWeight: '700', color: palette.ink },
  gradeCourseMeta: { fontSize: 10, color: palette.muted, marginTop: 4 },
  gradeValue: { fontSize: 15, color: palette.ink, fontWeight: '800' },
  detailHeader: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: { color: palette.ink, fontSize: 30, marginTop: -4 },
  detailHeaderText: { flex: 1 },
  detailHeaderTitle: { fontSize: 18, fontWeight: '800', color: palette.ink },
  detailHeaderSubtitle: { fontSize: 11, color: palette.muted, marginTop: 3 },
  detailHero: {
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 23,
    padding: 21,
    overflow: 'hidden',
  },
  detailEyebrow: {
    fontSize: 9,
    color: '#FFFFFFC9',
    fontWeight: '800',
    letterSpacing: 1,
  },
  detailTitle: {
    fontSize: 23,
    lineHeight: 30,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 15,
  },
  detailSubtitle: { fontSize: 12, color: '#FFFFFFD9', marginTop: 7 },
  detailHeroBottom: {
    marginTop: 21,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  detailHeroMeta: { fontSize: 10, color: '#FFFFFFC9' },
  detailScore: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  detailScoreSmall: { fontSize: 11, fontWeight: '600' },
  description: { fontSize: 13, lineHeight: 21, color: '#657188' },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E8EBF2',
    marginTop: 17,
    overflow: 'hidden',
  },
  progressFill: { height: 7, borderRadius: 4 },
  progressLabel: { fontSize: 10, color: palette.muted, marginTop: 7 },
  gradeDetailButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 28,
    backgroundColor: palette.ink,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  gradeDetailButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  assignmentDetailCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: palette.line,
  },
  assignmentDetailTitle: {
    fontSize: 21,
    color: palette.ink,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: 14,
  },
  sectionTitle: { fontSize: 15, color: palette.ink, fontWeight: '700' },
  spacedSectionTitle: { marginTop: 20 },
  duePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EA',
    borderRadius: 14,
    padding: 13,
    marginTop: 18,
    marginBottom: 20,
  },
  duePanelIcon: { fontSize: 22, color: palette.orange, marginRight: 12 },
  duePanelDate: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.ink,
    marginTop: 4,
  },
  requirementRow: { flexDirection: 'row', marginTop: 12 },
  requirementNumber: {
    fontSize: 11,
    color: palette.primary,
    fontWeight: '800',
    marginRight: 11,
    marginTop: 2,
  },
  requirementText: { flex: 1, fontSize: 12, color: '#657188', lineHeight: 18 },
  actionCaption: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: palette.muted,
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 28,
  },
  statusAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
  },
  statusActionText: { fontSize: 10, fontWeight: '700', color: palette.muted },
  gradeHero: {
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 23,
    alignItems: 'center',
    paddingVertical: 27,
    paddingHorizontal: 20,
  },
  gradeHeroScore: {
    fontSize: 63,
    fontWeight: '800',
    lineHeight: 72,
    color: '#FFFFFF',
    marginTop: 8,
  },
  gradeHeroCourse: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 3,
  },
  gradeHeroMeta: { fontSize: 10, color: '#FFFFFFC9', marginTop: 8 },
  assessmentRow: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  assessmentName: { flex: 1 },
  assessmentTitle: { fontSize: 12, fontWeight: '700', color: palette.ink },
  assessmentWeight: { fontSize: 10, color: palette.muted, marginTop: 4 },
  assessmentScore: { fontSize: 17, fontWeight: '800' },
  gradeFootnote: {
    fontSize: 10,
    color: palette.muted,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
});
