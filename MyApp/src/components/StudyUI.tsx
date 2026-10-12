import React, { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const palette = {
  background: '#F5F7FB',
  white: '#FFFFFF',
  ink: '#17233B',
  muted: '#8490A5',
  line: '#E9EDF4',
  primary: '#5266D8',
  paleBlue: '#EEF0FF',
  green: '#168A71',
  paleGreen: '#E6F5EF',
  orange: '#D98332',
  paleOrange: '#FFF3E5',
  red: '#CF5361',
  paleRed: '#FDEDEF',
};

export function Page({
  children,
  scroll = false,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: object;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {scroll ? (
        <ScrollView
          style={styles.page}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.page, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {subtitle ? <Text style={styles.kicker}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A1AABD"
        style={styles.searchInput}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Text style={styles.clear}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>✦</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  page: { flex: 1, backgroundColor: palette.background },
  scrollContent: { paddingBottom: 28 },
  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { flex: 1 },
  kicker: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  title: { color: palette.ink, fontSize: 27, fontWeight: '800' },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: '700' },
  sectionAction: { color: palette.primary, fontSize: 13, fontWeight: '700' },
  search: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchIcon: { fontSize: 25, color: palette.muted, marginRight: 10 },
  searchInput: {
    flex: 1,
    color: palette.ink,
    fontSize: 14,
    paddingVertical: 0,
  },
  clear: { fontSize: 22, color: palette.muted, paddingLeft: 8 },
  chip: {
    height: 38,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 20,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipSelected: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipText: { fontSize: 12, fontWeight: '600', color: '#6F7B91' },
  chipTextSelected: { color: palette.white },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 36,
    backgroundColor: palette.white,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: palette.paleBlue,
    color: palette.primary,
    fontSize: 24,
    marginBottom: 13,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: palette.ink },
  emptyMessage: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    color: palette.muted,
  },
});
