import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

import { Spacing } from '../theme/spacing';
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
              style={[styles.actionButton, { backgroundColor: Colors.danger }]} 
              onPress={() => setShowInstructions(true)}
            >
              <Text style={styles.buttonText}>Sí</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.success }]} 
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
    backgroundColor: Colors.scrim,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xxl,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  titleAlert: {
    fontSize: 22,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.danger,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.text.primary,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.navy,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    marginHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: 12,
    marginTop: Spacing.xl,
  },
  buttonText: {
    color: Colors.onPrimary,
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
  },
});
