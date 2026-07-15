import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDates: string[]; // array of ISO dates e.g., '2026-07-15'
  onMonthChange: (date: Date) => void;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const MiniCalendar = ({ selectedDate, onSelectDate, markedDates, onMonthChange }: MiniCalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(prev);
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(next);
    onMonthChange(next);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  // getDay returns 0 for Sunday, 1 for Monday. We want 0 for Monday.
  let firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() - 1;
  if (firstDay === -1) firstDay = 6;

  const today = new Date();
  
  const generateDays = () => {
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  };

  const toISODate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.dayHeaderText}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {generateDays().map((day, index) => {
          if (!day) return <View key={`blank-${index}`} style={styles.dayCell} />;
          
          const isoDate = toISODate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
          const isToday = today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
          const hasMark = markedDates.includes(isoDate);

          return (
            <TouchableOpacity 
              key={`day-${day}`} 
              style={[
                styles.dayCell, 
                isSelected && styles.selectedCell,
                isToday && !isSelected && styles.todayCell
              ]}
              onPress={() => onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedText,
                isToday && !isSelected && styles.todayText
              ]}>{day}</Text>
              {hasMark && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
    color: Colors.navy,
  },
  navButton: {
    padding: 4,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.lavender,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100/7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingBottom: 8, // Empuja el texto ligeramente hacia arriba
  },
  selectedCell: {
    backgroundColor: Colors.calendar.selected,
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: Colors.calendar.today,
  },
  dayText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.navy,
  },
  selectedText: {
    color: Colors.white,
    fontFamily: Typography.fonts.ubuntuBold,
  },
  todayText: {
    color: Colors.calendar.today,
    fontFamily: Typography.fonts.ubuntuBold,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.calendar.dot,
    position: 'absolute',
    bottom: 6,
  },
  dotSelected: {
    backgroundColor: Colors.white,
  },
});
