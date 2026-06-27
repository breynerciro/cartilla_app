import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

export const BottomNavigationActions = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        <Text style={styles.text}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => router.replace('/age-selector')}
      >
        <Ionicons name="home" size={20} color={Colors.white} />
        <Text style={styles.textWhite}>Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: Colors.background.secondary,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.blue,
  },
  text: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: Typography.sizes.base,
    color: Colors.navy,
  },
  textWhite: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: Typography.sizes.base,
    color: Colors.white,
  },
});
