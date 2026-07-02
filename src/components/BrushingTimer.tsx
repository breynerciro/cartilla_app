import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { timerPreset } from '../data/timerPresets';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { CircularProgress } from './CircularProgress';
import { QuadrantIndicator } from './QuadrantIndicator';
import { BleedingCheckModal } from './BleedingCheckModal';
import { Ionicons } from '@expo/vector-icons';

interface BrushingTimerProps {
  onFinish: () => void;
}

const TOTAL_TIME = 120;
const QUADRANT_TIME = 30;

export const BrushingTimer: React.FC<BrushingTimerProps> = ({ onFinish }) => {
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { height } = useWindowDimensions();
  
  const player = useAudioPlayer(timerPreset.songUri);

  const circleSize = Math.min(height * 0.28, 260);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      player.play();
    } else if (!isActive && player) {
      player.pause();
    }

    if (timeRemaining === 0) {
      setIsActive(false);
      if (player) player.pause();
      setShowModal(true);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, player]);

  const activeQuadrant = Math.min(3, Math.floor((TOTAL_TIME - timeRemaining) / QUADRANT_TIME));
  const progress = (TOTAL_TIME - timeRemaining) / TOTAL_TIME;

  const quadrantColors = [
    Colors.timer.quadrant1,
    Colors.timer.quadrant2,
    Colors.timer.quadrant3,
    Colors.timer.quadrant4,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{timerPreset.songTitle}</Text>
      
      <View style={styles.timerWrapper}>
        <CircularProgress
          progress={progress}
          size={circleSize}
          strokeWidth={16}
          color={quadrantColors[activeQuadrant]}
          timeRemaining={timeRemaining}
        />
        
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => setIsActive(!isActive)}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={32} color={Colors.white} style={{ marginLeft: isActive ? 0 : 4 }} />
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Instrucción: Vuelve a ser Navy para mantener la consistencia con el diseño de la app */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <QuadrantIndicator activeQuadrant={activeQuadrant} />
          <Text style={styles.instructionTitle}>{timerPreset.quadrantLabels[activeQuadrant]}</Text>
        </View>
        <Text style={styles.instructionText}>{timerPreset.instructions[activeQuadrant]}</Text>
      </View>

      <View style={[styles.pressureContainer, { opacity: (timeRemaining % 15 < 5 && timeRemaining < TOTAL_TIME && isActive) ? 1 : 0 }]}>
        <Ionicons name="alert-circle" size={20} color={Colors.timer.warning} />
        <Text style={styles.pressureWarning}>{timerPreset.pressureReminder}</Text>
      </View>

      <BleedingCheckModal
        visible={showModal}
        onClose={() => { setShowModal(false); onFinish(); }}
        bleedingFollowUp={timerPreset.bleedingFollowUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly', // Mantiene los elementos bien espaciados
  },
  songTitle: {
    fontSize: 16,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.lavender,
    textTransform: 'uppercase',
  },
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  playButton: {
    position: 'absolute',
    bottom: -24,
    backgroundColor: Colors.navy,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.navy,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.timer.quadrant2,
    flexShrink: 1,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 26,
  },
  pressureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 20,
  },
  pressureWarning: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: Colors.timer.warning,
  },
});
