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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Header } from '../../src/components/Header';
import { BackButton } from '../../src/components/BackButton';
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

  const anims = useRef<Animated.Value[]>([]).current;

  const allContacts = [...DEFAULT_EMERGENCY_CONTACTS, ...customContacts];

  useEffect(() => {
    loadCustomContacts();
  }, []);

  const loadCustomContacts = async () => {
    const contacts = await getCustomContacts();
    setCustomContacts(contacts);
  };

  useEffect(() => {
    // Refresh animations for contacts
    anims.length = 0;
    allContacts.forEach(() => {
      anims.push(new Animated.Value(0));
    });

    Animated.stagger(
      100,
      anims.map((anim) =>
        Animated.spring(anim, {
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
    <SafeAreaView style={styles.container}>
      <Header title="CONTACTOS DE EMERGENCIA" decoration="right" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          {allContacts.map((contact, index) => {
            const anim = anims[index] || new Animated.Value(1);
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

        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={styles.floatingBack}>
        <BackButton onPress={() => router.back()} />
      </View>

      <FooterLogos />

      <EmergencyContactFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddContact}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  floatingBack: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  bannerText: {
    flex: 1,
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 14,
    color: Colors.white,
    lineHeight: 18,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 17,
    color: Colors.navy,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.lavender,
    marginBottom: 6,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  phoneText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
  },
  deleteBtn: {
    padding: 6,
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
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.navy,
    borderStyle: 'dashed',
    gap: 8,
  },
  addBtnText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.navy,
  },
});
