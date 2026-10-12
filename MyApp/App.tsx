import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearningApp, {
  AssignmentDetailScreen,
  CourseDetailScreen,
  GradeDetailScreen,
  LessonDetailScreen,
} from './src/navigation/LearningApp';
import { initialAssignments, initialStudent } from './src/data/learningData';
import {
  Assignment,
  RootStackParamList,
  StudentProfile,
} from './src/types/learning';

const Stack = createNativeStackNavigator<RootStackParamList>();
const STORAGE_KEY = '@study-planner/state-v1';

type PersistedAppState = {
  student: StudentProfile;
  assignments: Assignment[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function isPersistedAppState(value: unknown): value is PersistedAppState {
  if (
    !isRecord(value) ||
    !isRecord(value.student) ||
    !Array.isArray(value.assignments)
  ) {
    return false;
  }
  const studentFields = [
    'id',
    'name',
    'className',
    'major',
    'cohort',
    'email',
    'phone',
  ];
  const studentIsValid = studentFields.every(
    field => typeof value.student[field] === 'string',
  );
  const statuses = ['todo', 'inProgress', 'completed', 'overdue'];
  const assignmentsAreValid = value.assignments.every(
    assignment =>
      isRecord(assignment) &&
      typeof assignment.id === 'string' &&
      typeof assignment.courseId === 'string' &&
      typeof assignment.title === 'string' &&
      typeof assignment.dueDate === 'string' &&
      typeof assignment.description === 'string' &&
      statuses.includes(String(assignment.status)) &&
      Array.isArray(assignment.requirements) &&
      assignment.requirements.every(
        (requirement: unknown) => typeof requirement === 'string',
      ),
  );
  return studentIsValid && assignmentsAreValid;
}

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(initialStudent);
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue === null) {
          return;
        }
        const parsed: unknown = JSON.parse(storedValue);
        if (!isPersistedAppState(parsed)) {
          throw new Error('Dữ liệu đã lưu không đúng định dạng.');
        }
        setStudent(parsed.student);
        setAssignments(parsed.assignments);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Alert.alert(
          'Không thể khôi phục dữ liệu',
          `Ứng dụng sẽ dùng dữ liệu mẫu. Chi tiết: ${reason}`,
        );
      } finally {
        setIsHydrated(true);
      }
    };

    restoreState();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const persistState = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ student, assignments }),
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Alert.alert(
          'Không thể lưu dữ liệu',
          `Thay đổi hiện tại chưa được lưu trên thiết bị. Chi tiết: ${reason}`,
        );
      }
    };
    persistState();
  }, [assignments, isHydrated, student]);

  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(current =>
      current.map(assignment =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment,
      ),
    );
  };

  return !isHydrated ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#5266D8" />
      <Text style={styles.loadingText}>Đang tải dữ liệu học tập...</Text>
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F7FB' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs">
          {() => (
            <LearningApp
              student={student}
              onUpdateStudent={setStudent}
              assignments={assignments}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CourseDetail">
          {({ route }) => (
            <CourseDetailScreen
              courseId={route.params.courseId}
              assignments={assignments}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="LessonDetail">
          {({ route }) => (
            <LessonDetailScreen lessonId={route.params.lessonId} />
          )}
        </Stack.Screen>
        <Stack.Screen name="AssignmentDetail">
          {({ route }) => (
            <AssignmentDetailScreen
              assignmentId={route.params.assignmentId}
              assignments={assignments}
              onUpdateAssignment={updateAssignment}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GradeDetail">
          {({ route }) => (
            <GradeDetailScreen courseId={route.params.courseId} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FB',
  },
  loadingText: { color: '#8490A5', fontSize: 13, marginTop: 12 },
});
