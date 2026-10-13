import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Radius } from '../../src/theme/radius';
import { Spacing, screenPadding } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { Screen } from '../../src/components/Screen';
import { Header } from '../../src/components/Header';
import { BackButton, BACK_BUTTON_SIZE } from '../../src/components/BackButton';
import { FooterLogos } from '../../src/components/FooterLogos';
import {
  EmergencyContact,
  DEFAULT_EMERGENCY_CONTACTS,
  getCustomContacts,
  saveCustomContact,
  deleteCustomContact,
} from '../../src/data/emergencyContacts';
import { EmergencyContactFormModal } from '../../src/components/EmergencyContactFormModal';

export default function EmergencyScreen() {
  const router = useRouter();
  const [customContacts, setCustomContacts] = useState<EmergencyContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Un Animated.Value por contacto, estable entre renders y creado en 0 antes del primer
  // render: cada item nace invisible y entra animado. Antes los items sin valor asignado
  // recibian new Animated.Value(1) en cada render (se veian completos) y el efecto los
  // reiniciaba a 0 despues, con un parpadeo.
  const anims = useRef(new Map<string, Animated.Value>()).current;
  const animatedIds = useRef(new Set<string>()).current;
  const animFor = (id: string) => {
    let value = anims.get(id);
    if (!value) {
      value = new Animated.Value(0);
      anims.set(id, value);
    }
    return value;
  };

  const allContacts = [...DEFAULT_EMERGENCY_CONTACTS, ...customContacts];

  useEffect(() => {
    loadCustomContacts();
  }, []);

  const loadCustomContacts = async () => {
    const contacts = await getCustomContacts();
    setCustomContacts(contacts);
  };

  useEffect(() => {
    // Anima solo los contactos que aun no entraron: los de fabrica al montar y los
    // personalizados cuando cargan o se agregan. Los que ya se ven no se reinician.
    const entering = allContacts.filter((contact) => !animatedIds.has(contact.id));
    entering.forEach((contact) => animatedIds.add(contact.id));

    Animated.stagger(
      100,
      entering.map((contact) =>
        Animated.spring(animFor(contact.id), {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [customContacts.length]);

  const handleMakeCall = async (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const url = `tel:${cleanPhone}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'No se puede realizar la llamada',
          `El dispositivo no soporta llamadas directas. Número: ${phone}`
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `No fue posible realizar la llamada a ${name} (${phone}).`
      );
    }
  };

  const handleAddContact = async (
    contactData: Omit<EmergencyContact, 'id' | 'isCustom'>
  ) => {
    const updated = await saveCustomContact(contactData);
    setCustomContacts(updated);
  };

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Contacto',
      `¿Deseas eliminar a "${name}" de tus contactos de emergencia?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteCustomContact(id);
            setCustomContacts(updated);
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <Header title="CONTACTOS DE EMERGENCIA" decoration="right" />

      {/* `main` termina donde empieza el pie (y el pie ya esta dentro del area segura de
          Screen): el Back flotante nunca pisa los logos ni el inset inferior. */}
      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Informativo */}
          <View style={styles.banner}>
            <Ionicons name="information-circle" size={24} color={Colors.white} />
            <Text style={styles.bannerText}>
              Toca sobre cualquier contacto para marcar directamente al número en
              caso de urgencia.
            </Text>
          </View>

          {/* Lista de contactos */}
          <View style={styles.listContainer}>
            {allContacts.map((contact) => {
              const anim = animFor(contact.id);
              const translateY = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              });

              return (
                <Animated.View
                  key={contact.id}
                  style={{
                    opacity: anim,
                    transform: [{ translateY }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() => handleMakeCall(contact.phone, contact.name)}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${contact.color}25` },
                      ]}
                    >
                      <Ionicons
                        name={contact.icon as any}
                        size={32}
                        color={contact.color}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      {contact.subtitle ? (
                        <Text style={styles.contactSubtitle}>
                          {contact.subtitle}
                        </Text>
                      ) : null}
                      <View style={styles.phoneChip}>
                        <Ionicons
                          name="call-outline"
                          size={14}
                          color={contact.color}
                        />
                        <Text
                          style={[styles.phoneText, { color: contact.color }]}
                        >
                          {contact.phone}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionsContainer}>
                      {contact.isCustom && (
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() =>
                            handleDeleteContact(contact.id, contact.name)
                          }
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#E74C3C"
                          />
                        </TouchableOpacity>
                      )}
                      <View
                        style={[
                          styles.callBtn,
                          { backgroundColor: contact.color },
                        ]}
                      >
                        <Ionicons name="call" size={20} color={Colors.white} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Botón para agregar contacto personalizado */}
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color={Colors.navy} />
            <Text style={styles.addBtnText}>Agregar contacto personalizado</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.floatingBack}>
          <BackButton onPress={() => router.back()} />
        </View>
      </View>

      <FooterLogos />

      <EmergencyContactFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddContact}
      />
    </Screen>
  );
}

// Distancia del Back flotante al borde inferior de `main` (justo sobre el pie).
const FLOATING_BOTTOM = Spacing.sm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  floatingBack: {
    position: 'absolute',
    left: 0,
    bottom: FLOATING_BOTTOM,
    paddingHorizontal: screenPadding,
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  // El margen lateral va en el contenido para que el ScrollView llegue al borde
  // y no recorte las sombras de las tarjetas.
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: Spacing.lg,
    // Reserva el alto real del Back flotante (82) para que el ultimo item no quede tapado.
    paddingBottom: BACK_BUTTON_SIZE + FLOATING_BOTTOM + Spacing.lg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  bannerText: {
    flex: 1,
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 14,
    color: Colors.white,
    lineHeight: 18,
  },
  listContainer: {
    gap: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.lgPlus,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    // Tile de icono: mismo 56 / Radius.lg / separacion 16 que main-menu.
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 17,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  contactSubtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  phoneText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginLeft: Spacing.sm,
  },
  deleteBtn: {
    padding: Spacing.sm,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.lgPlus,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.navy,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  addBtnText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.navy,
  },
});
