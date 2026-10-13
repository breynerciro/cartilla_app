import React from 'react';
import { View, ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import { Spacing, screenPadding } from '../theme/spacing';
import { Screen } from './Screen';
import { Header } from './Header';
import { TopicCard } from './TopicCard';

export interface TopicMenuItem {
  id: string;
  title: string;
  menuImage?: ImageSourcePropType;
}

interface TopicMenuListProps {
  title: string;
  items: TopicMenuItem[];
  onSelect: (id: string) => void;
  // Lado de la imagen de la primera tarjeta; las demas alternan.
  firstImagePosition?: 'left' | 'right';
  // Accion principal del pie (volver, finalizar...).
  action: React.ReactNode;
}

// Menu de temas: Header + lista de TopicCard con scroll + pie. Lo usan topics,
// el menu de subtemas y el de subtemas anidados, que eran la misma pantalla
// copiada. La lista hace scroll para que ningun tema quede tapado por el pie
// cuando hay 4 o mas tarjetas en telefonos de ~640 pt de alto.
export const TopicMenuList = ({
  title,
  items,
  onSelect,
  firstImagePosition = 'left',
  action,
}: TopicMenuListProps) => {
  const other = firstImagePosition === 'left' ? 'right' : 'left';

  return (
    <Screen>
      <Header title={title} decoration="left" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <TopicCard
            key={item.id}
            title={item.title}
            image={item.menuImage}
            imagePosition={index % 2 === 0 ? firstImagePosition : other}
            onPress={() => onSelect(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {action}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  // El margen lateral va en el contenido para que el ScrollView llegue al borde
  // y no recorte la sombra de las tarjetas. TopicCard ya trae su marginBottom (lg).
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
});
