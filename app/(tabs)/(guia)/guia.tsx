import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../src/theme/colors';
import { Radius } from '../../../src/theme/radius';
import { Spacing, screenPadding } from '../../../src/theme/spacing';
import { Screen } from '../../../src/components/Screen';
import { Button } from '../../../src/components/Button';
import { FooterLogos } from '../../../src/components/FooterLogos';
import { Header } from '../../../src/components/Header';
import { MenuCard } from '../../../src/components/MenuCard';

const AGE_GROUPS = [
  { label: '0 A 3 años', route: '0-3' },
  { label: '3 A 5 años', route: '3-5' },
  { label: '6 A 13 años', route: '6-13' },
  { label: '14 A 18 años', route: '14-18' },
] as const;

export default function GuiaScreen() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  // La intro de conocimiento es opcional: solo se ofrece la primera vez que no se
  // ha visto. Ya no bloquea el acceso a la guía (antes era un paso obligatorio).
  // Se revisa en cada foco para ocultar el aviso tras verla.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        try {
          const hasSeen = await AsyncStorage.getItem('hasSeenKnowledgeIntro');
          if (active) setShowIntro(hasSeen !== 'true');
        } catch (e) {
          // Sin almacenamiento: se ofrece igualmente.
          if (active) setShowIntro(true);
        }
      })();

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header title="¿QUÉ EDAD TIENE TU NIÑO(A)?" decoration="right" />

      {/* Con scroll: con fuente grande o en pantallas pequeñas los botones no caben
          entre el Header y la barra de pestañas. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonsContainer}>
          {showIntro && (
            <Button
              title="Ver introducción"
              variant="outline"
              onPress={() => router.push('/onboarding')}
              style={styles.button}
            />
          )}
          {AGE_GROUPS.map((group) => (
            <Button
              key={group.route}
              title={group.label}
              variant="dark"
              onPress={() => router.push(`/age/${group.route}`)}
              style={styles.button}
            />
          ))}

          {/* El glosario se abre dentro de la pila de la Guía: la barra sigue visible. */}
          <MenuCard
            title="Glosario"
            subtitle="Términos odontológicos y hematológicos"
            icon="library-outline"
            color={Colors.blue}
            onPress={() => router.push('/glossary')}
          />
        </View>

        {/* Logos institucionales al final del contenido, no fijos sobre la barra. */}
        <FooterLogos />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  // flexGrow + space-between: con espacio de sobra los logos quedan al fondo del
  // contenido; si no cabe, todo hace scroll.
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xxl,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: Spacing.xxl,
    gap: Spacing.xl,
  },
  button: {
    paddingVertical: Spacing.xl,
    borderRadius: Radius.lgPlus,
  },
});
