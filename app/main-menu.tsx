import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { FooterLogos } from '../src/components/FooterLogos';

const MENU_OPTIONS = [
  {
    id: 'knowledge',
    title: 'Todo lo que debes saber',
    subtitle: 'Información por edades',
    icon: 'book-outline' as const,
    route: '/onboarding',
    color: Colors.blue,
  },
  {
    id: 'timer',
    title: 'Temporizador de Cepillado',
    subtitle: 'Guía de 2 minutos',
    icon: 'timer-outline' as const,
    route: '/timer',
    color: Colors.timer.quadrant1,
  },
  {
    id: 'calendar',
    title: 'Calendario de Citas',
    subtitle: 'Organiza tus controles',
    icon: 'calendar-outline' as const,
    route: '/calendar',
    color: Colors.lavender,
  },
  {
    id: 'emergency',
    title: 'Contactos de Emergencia',
    subtitle: 'Números de urgencia',
    icon: 'call-outline' as const,
    route: '/emergency',
    color: Colors.timer.warning,
  },
];

export default function MainMenuScreen() {
  const router = useRouter();
  
  // Animaciones para cada tarjeta
  const anims = useRef(MENU_OPTIONS.map(() => new Animated.Value(0))).current;

  const handleOptionPress = async (option: typeof MENU_OPTIONS[0]) => {
    if (option.id === 'knowledge') {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenKnowledgeIntro');
        if (hasSeen === 'true') {
          router.push('/age-selector');
        } else {
          router.push('/onboarding');
        }
      } catch (e) {
        router.push('/onboarding');
      }
    } else {
      router.push(option.route as any);
    }
  };

  useEffect(() => {
    Animated.stagger(150, anims.map(anim => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="HEMOFILIA Y ODONTOLOGÍA" 
        decoration="right" 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {MENU_OPTIONS.map((option, index) => {
          const translateY = anims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          });
          
          return (
            <Animated.View 
              key={option.id}
              style={{
                opacity: anims[index],
                transform: [{ translateY }]
              }}
            >
              <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => handleOptionPress(option)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${option.color}33` }]}>
                  <Ionicons name={option.icon} size={36} color={option.color} />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={[styles.cardSubtitle, { color: option.color }]}>{option.subtitle}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={24} color={Colors.lavender} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      <FooterLogos />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    flexGrow: 1,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    borderRadius: 24,
    padding: 16,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
    color: Colors.white,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
  },
});
