import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Typography } from '../theme/typography';
import {
  EmergencyContact,
  EmergencyContactType,
  CONTACT_TYPES,
} from '../data/emergencyContacts';
import { Button } from './Button';

import { Spacing } from '../theme/spacing';
interface EmergencyContactFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: Omit<EmergencyContact, 'id' | 'isCustom'>) => void;
}

export const EmergencyContactFormModal = ({
  visible,
  onClose,
  onSave,
}: EmergencyContactFormModalProps) => {
  const [type, setType] = useState<EmergencyContactType>('hematologia');
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setType('hematologia');
      setName('');
      setSubtitle('');
      setPhone('');
    }
  }, [visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del contacto');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el número telefónico');
      return;
    }

    const typeMeta = CONTACT_TYPES[type] || CONTACT_TYPES.otro;

    onSave({
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      phone: phone.trim().replace(/\s+/g, ''),
      type,
      icon: typeMeta.icon,
      color: typeMeta.color,
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nuevo Contacto</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color={Colors.navy} />
            </TouchableOpacity>
          </View>

          {/* handled: el primer toque en Guardar/chips actua en vez de solo cerrar el teclado */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Tipo de Contacto</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.typeScroll}
            >
              {Object.entries(CONTACT_TYPES).map(([key, config]) => {
                const isSelected = type === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.typeChip,
                      isSelected && {
                        backgroundColor: config.color,
                        borderColor: config.color,
                      },
                    ]}
                    onPress={() => setType(key as EmergencyContactType)}
                  >
                    <Ionicons
                      name={config.icon as any}
                      size={20}
                      color={isSelected ? Colors.white : config.color}
                    />
                    <Text
                      style={[
                        styles.typeText,
                        isSelected && { color: Colors.white },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Nombre o Entidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Dr. Pérez — Hematólogo"
              value={name}
              onChangeText={setName}
              maxLength={40}
            />

            <Text style={styles.label}>Descripción o Nota (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Odontólogo pediatra / Turno noche"
              value={subtitle}
              onChangeText={setSubtitle}
              maxLength={60}
            />

            <Text style={styles.label}>Número Telefónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 3001234567 o +57 601 2345678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.footer}>
              <View style={styles.footerCell}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={onClose}
                  style={styles.footerButton}
                />
              </View>
              <View style={styles.footerCell}>
                <Button
                  title="Guardar"
                  variant="primary"
                  onPress={handleSave}
                  style={styles.footerButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,14,85,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    height: '75%',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 24,
    color: Colors.navy,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.navy,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  typeScroll: {
    marginBottom: Spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.lavender,
    marginRight: Spacing.md,
  },
  typeText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.lavender,
    marginLeft: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.navy,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  footerCell: {
    flex: 1,
  },
  footerButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
});
