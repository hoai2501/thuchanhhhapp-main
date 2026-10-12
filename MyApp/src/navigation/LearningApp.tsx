import React, { createContext, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Assignment,
  MainTabParamList,
  StudentProfile,
} from '../types/learning';
import {
  AssignmentsScreen,
  AssignmentDetailScreen,
  CourseDetailScreen,
  CoursesScreen,
  DashboardScreen,
  GradeDetailScreen,
  LessonDetailScreen,
  ProfileScreen,
  ScheduleScreen,
} from '../screens/LearningScreens';
import { palette } from '../components/StudyUI';

const Tabs = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, string> = {
  Overview: '⌂',
  Courses: '▤',
  Schedule: '▦',
  Assignments: '✓',
  Profile: '◉',
};

const tabLabels: Record<keyof MainTabParamList, string> = {
  Overview: 'Tổng quan',
  Courses: 'Môn học',
  Schedule: 'Lịch học',
  Assignments: 'Bài tập',
  Profile: 'Cá nhân',
};

type LearningContextValue = {
  student: StudentProfile;
  onUpdateStudent: (student: StudentProfile) => void;
  assignments: Assignment[];
};

const LearningContext = createContext<LearningContextValue | null>(null);

function useLearningContext() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('Learning screens must be rendered inside LearningApp.');
  }
  return context;
}

function DashboardTabScreen() {
  const { student, assignments } = useLearningContext();
  return <DashboardScreen student={student} assignments={assignments} />;
}

function AssignmentsTabScreen() {
  const { assignments } = useLearningContext();
  return <AssignmentsScreen assignments={assignments} />;
}

function ProfileTabScreen() {
  const { student, onUpdateStudent } = useLearningContext();
  return <ProfileScreen student={student} onUpdateStudent={onUpdateStudent} />;
}

function TabIcon({
  routeName,
  focused,
  color,
}: {
  routeName: keyof MainTabParamList;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <Text style={[styles.tabIcon, { color }]}>{tabIcons[routeName]}</Text>
    </View>
  );
}

function renderTabIcon(
  routeName: keyof MainTabParamList,
  focused: boolean,
  color: string,
) {
  return <TabIcon routeName={routeName} focused={focused} color={color} />;
}

export default function LearningApp({
  student,
  onUpdateStudent,
  assignments,
}: {
  student: StudentProfile;
  onUpdateStudent: (student: StudentProfile) => void;
  assignments: Assignment[];
}) {
  return (
    <LearningContext.Provider value={{ student, onUpdateStudent, assignments }}>
      <Tabs.Navigator
        initialRouteName="Overview"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: '#9AA4B5',
          tabBarLabel: tabLabels[route.name],
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color }) =>
            renderTabIcon(route.name, focused, color),
        })}
      >
        <Tabs.Screen name="Overview" component={DashboardTabScreen} />
        <Tabs.Screen name="Courses" component={CoursesScreen} />
        <Tabs.Screen name="Schedule" component={ScheduleScreen} />
        <Tabs.Screen name="Assignments" component={AssignmentsTabScreen} />
        <Tabs.Screen name="Profile" component={ProfileTabScreen} />
      </Tabs.Navigator>
    </LearningContext.Provider>
  );
}

export {
  AssignmentDetailScreen,
  CourseDetailScreen,
  GradeDetailScreen,
  LessonDetailScreen,
};

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E9EDF4',
    borderTopWidth: 1,
    elevation: 12,
  },
  tabLabel: { fontSize: 9, fontWeight: '700', marginBottom: 2 },
  iconBox: {
    minWidth: 34,
    height: 27,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: { backgroundColor: '#EEF0FF' },
  tabIcon: { fontSize: 19, fontWeight: '700' },
});
