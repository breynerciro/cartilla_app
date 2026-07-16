import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { timerPreset, AVAILABLE_SONGS, Song } from '../data/timerPresets';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { CircularProgress } from './CircularProgress';
import { QuadrantIndicator } from './QuadrantIndicator';
import { BleedingCheckModal } from './BleedingCheckModal';
import { Ionicons } from '@expo/vector-icons';

interface BrushingTimerProps {
  onFinish: () => void;
  onOpenAlarmSettings?: () => void;
  alarmSummary?: string;
}

const TOTAL_TIME = 120;
const QUADRANT_TIME = 30;

export const BrushingTimer: React.FC<BrushingTimerProps> = ({ onFinish, onOpenAlarmSettings, alarmSummary }) => {
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song>(AVAILABLE_SONGS[0]);
  const [showSongSelector, setShowSongSelector] = useState(false);
  const { height } = useWindowDimensions();
  
  const player = useAudioPlayer(selectedSong.uri);

  // Scale circle to available height — smaller now to leave room for all elements
  const circleSize = Math.min(height * 0.26, 250);

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
      {/* Top row: Song selector + Alarm settings — pinned at top */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => setShowSongSelector(true)} style={styles.songSelectorBtn}>
          <Ionicons name="musical-notes" size={18} color={Colors.lavender} />
          <Text style={styles.songTitle} numberOfLines={1}>{selectedSong.title}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.lavender} />
        </TouchableOpacity>

        {onOpenAlarmSettings && (
          <TouchableOpacity onPress={onOpenAlarmSettings} style={styles.alarmBtn}>
            <Ionicons name="alarm" size={18} color={Colors.white} />
            {alarmSummary ? (
              <Text style={styles.alarmBtnText} numberOfLines={1}>{alarmSummary}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      </View>

      {/* Central content group — fills remaining space, centered */}
      <View style={styles.centerGroup}>
        {/* Timer circle + play button */}
        <View style={styles.timerWrapper}>
          <CircularProgress
            progress={progress}
            size={circleSize}
            strokeWidth={14}
            color={quadrantColors[activeQuadrant]}
            timeRemaining={timeRemaining}
          />
          
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => setIsActive(!isActive)}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={28} color={Colors.white} style={{ marginLeft: isActive ? 0 : 3 }} />
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Instrucción */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <QuadrantIndicator activeQuadrant={activeQuadrant} />
            <Text style={styles.instructionTitle}>{timerPreset.quadrantLabels[activeQuadrant]}</Text>
          </View>
          <Text style={styles.instructionText}>{timerPreset.instructions[activeQuadrant]}</Text>
        </View>

        {/* Pressure warning — conditional opacity */}
        <View style={[styles.pressureContainer, { opacity: (timeRemaining % 15 < 5 && timeRemaining < TOTAL_TIME && isActive) ? 1 : 0 }]}>
          <Ionicons name="alert-circle" size={18} color={Colors.timer.warning} />
          <Text style={styles.pressureWarning}>{timerPreset.pressureReminder}</Text>
        </View>
      </View>

      <BleedingCheckModal
        visible={showModal}
        onClose={() => { setShowModal(false); onFinish(); }}
        bleedingFollowUp={timerPreset.bleedingFollowUp}
      />

      {/* Selector de Canciones */}
      <Modal visible={showSongSelector} animationType="fade" transparent={true} onRequestClose={() => setShowSongSelector(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.songModalContainer}>
            <Text style={styles.songModalTitle}>Selecciona una melodía</Text>
            {AVAILABLE_SONGS.map(song => (
              <TouchableOpacity 
                key={song.id} 
                style={[styles.songOption, selectedSong.id === song.id && styles.songOptionSelected]}
                onPress={() => {
                  setSelectedSong(song);
                  setShowSongSelector(false);
                  if (isActive && player) {
                    player.play();
                  }
                }}
              >
                <Ionicons name="musical-note" size={24} color={selectedSong.id === song.id ? Colors.white : Colors.navy} />
                <Text style={[styles.songOptionText, selectedSong.id === song.id && styles.songOptionTextSelected]}>{song.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.songModalCloseBtn} onPress={() => setShowSongSelector(false)}>
              <Text style={styles.songModalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centerGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },

  // ── Top row: song + alarm side by side ──
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  songSelectorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(121, 140, 235, 0.3)',
  },
  songTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.lavender,
    textTransform: 'uppercase',
  },
  alarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lavender,
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  alarmBtnText: {
    fontSize: 11,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.white,
    maxWidth: 100,
  },

  // ── Timer ──
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 20,
    marginBottom: 8,
  },
  playButton: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: Colors.navy,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  // ── Instruction card ──
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.navy,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.timer.quadrant2,
    flexShrink: 1,
  },
  instructionText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Pressure warning ──
  pressureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 16,
  },
  pressureWarning: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: Colors.timer.warning,
  },

  // ── Song selector modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,14,85,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  songModalContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  songModalTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 20,
    textAlign: 'center',
  },
  songOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: Colors.offWhite,
  },
  songOptionSelected: {
    backgroundColor: Colors.blue,
  },
  songOptionText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.navy,
    marginLeft: 12,
  },
  songOptionTextSelected: {
    color: Colors.white,
  },
  songModalCloseBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.navy,
    borderRadius: 16,
  },
  songModalCloseText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.navy,
  },
});
