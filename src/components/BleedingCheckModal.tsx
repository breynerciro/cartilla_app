import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface BleedingCheckModalProps {
  visible: boolean;
  onClose: () => void;
  bleedingFollowUp: string[];
}

export const BleedingCheckModal: React.FC<BleedingCheckModalProps> = ({
  visible,
  onClose,
  bleedingFollowUp,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleClose = () => {
    setShowInstructions(false);
    onClose();
  };

  if (showInstructions) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.titleAlert}>Protocolo Clínico de Sangrado</Text>
            {bleedingFollowUp.map((instruction, index) => (
              <Text key={index} style={styles.instruction}>
                • {instruction}
              </Text>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Evaluación Post-Cepillado</Text>
          <Text style={styles.subtitle}>¿Se presentó algún evento de sangrado durante el cepillado?</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.timer.warning }]} 
              onPress={() => setShowInstructions(true)}
            >
              <Text style={styles.buttonText}>Sí</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.timer.success }]} 
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.navy,
    marginBottom: 16,
    textAlign: 'center',
  },
  titleAlert: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.timer.warning,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.navy,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.navy,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
  },
});
