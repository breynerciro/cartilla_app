import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from 'react-native';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop, Image as SvgImage } from 'react-native-svg';
import { upperArchPaths, lowerArchPaths, upperPermanentArchPaths, lowerPermanentArchPaths, ToothData } from '../data/teethPaths';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

// ─── COLORES BASADOS EN LA LEYENDA DEL USUARIO ───
const TOOTH_COLORS: Record<string, string> = {
  ic: '#F48FB1', // Rosa (Incisivo central)
  il: '#FFD54F', // Amarillo (Incisivo lateral)
  ca: '#4DB6AC', // Cyan (Canino)
  pm: '#64B5F6', // Azul (Primer Molar Temporal / Primer Premolar)
  sm: '#BA68C8', // Morado (Segundo Molar Temporal / Segundo Premolar)
  pm1: '#64B5F6',
  pm2: '#BA68C8',
  m1: '#FF8A65', // Naranja
  m2: '#81C784', // Verde Claro
  m3: '#A1887F', // Marrón
};

const TOOTH_NAMES: Record<string, string> = {
  ic: 'Incisivo central',
  il: 'Incisivo lateral',
  ca: 'Canino',
  pm: 'Primer molar', // Temporal
  sm: 'Segundo molar', // Temporal
  pm1: 'Primer premolar',
  pm2: 'Segundo premolar',
  m1: 'Primer molar',
  m2: 'Segundo molar',
  m3: 'Tercer molar (Cordal)',
};

const DECIDUOUS_KEYS = ['ic', 'il', 'ca', 'pm', 'sm'];
const PERMANENT_KEYS = ['ic', 'il', 'ca', 'pm1', 'pm2', 'm1', 'm2', 'm3'];

// ─── COORDENADAS Y RUTAS VECTORIALES (Sincronizadas al pixel de 890x682) ───
// Extraídas matemáticamente de la imagen para asegurar hitbox perfecto.
const upperArch = upperArchPaths;
const lowerArch = lowerArchPaths;

export const InteractiveDentalDiagram = ({ ageGroup = '0-3' }: { ageGroup?: string }) => {
  const { width } = useWindowDimensions();
  const [activeArch, setActiveArch] = useState<'upper' | 'lower'>('upper');
  const [activeSpot, setActiveSpot] = useState<ToothData | null>(null);

  const infoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeSpot) {
      infoAnim.setValue(0);
      Animated.spring(infoAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }).start();
    }
  }, [activeSpot]);

  // width - 32 (paddingHorizontal de SlidesRunner) - 8 de margen de seguridad
  const diagramSize = width - 40;
  const isPermanent = ageGroup === '6-13';
  const teethData = isPermanent 
    ? (activeArch === 'upper' ? upperPermanentArchPaths : lowerPermanentArchPaths)
    : (activeArch === 'upper' ? upperArchPaths : lowerArchPaths);

  const handleToothPress = (tooth: ToothData) => {
    setActiveSpot(prev => (prev?.id === tooth.id ? null : tooth));
  };

  // Cargamos las imágenes locales
  const upperImage = isPermanent ? require("../../assets/images/png's/arch_upper_permanentes.png") : require("../../assets/images/png's/arch_upper.png");
  const lowerImage = isPermanent ? require("../../assets/images/png's/arch_lower_permanentes.png") : require("../../assets/images/png's/arch_lower.png");

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Modelo Dental Anatómico</Text>
        <Text style={styles.subtitle}>Toca un diente en la ilustración para explorarlo.</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeArch === 'upper' && styles.tabActive]}
          onPress={() => { setActiveArch('upper'); setActiveSpot(null); }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeArch === 'upper' && styles.tabTextActive]}>
            Maxilar Superior
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeArch === 'lower' && styles.tabActive]}
          onPress={() => { setActiveArch('lower'); setActiveSpot(null); }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeArch === 'lower' && styles.tabTextActive]}>
            Maxilar Inferior
          </Text>
        </TouchableOpacity>
      </View>

      {/*SVG + Image integrados en el mismo ViewBox */}
      <View style={[styles.diagramContainer, { width: diagramSize, height: diagramSize * (isPermanent ? 896 / 1169 : 0.85) }]}>
        <Svg viewBox={isPermanent ? "0 0 1169 896" : "0 0 890 682"} width="100%" height="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* La imagen rasterizada se renderiza nativamente dentro del SVG, anclada al viewBox exacto de cada resolución */}
          <SvgImage
            href={activeArch === 'upper' ? upperImage : lowerImage}
            width={isPermanent ? "1169" : "890"}
            height={isPermanent ? "896" : "682"}
            x="0"
            y="0"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Los hitboxes y contornos vectoriales se renderizan en el mismo sistema de coordenadas */}
          {teethData.map((tooth) => {
            const isActive = activeSpot?.id === tooth.id;
            const color = TOOTH_COLORS[tooth.type];
            
            return (
              <G key={tooth.id} onPress={() => handleToothPress(tooth)}>
                {/* Hitbox transparente usando LA FORMA EXACTA DEL DIENTE para evitar superposiciones */}
                <Path d={tooth.path} fill="transparent" />
                
                {/* Indicador de Selección Vectorial Premium (Círculos perfectos para estética impecable) */}
                {isActive && (
                  <G>
                    {/* Anillo exterior animado (dash array) centrado exactamente en el diente */}
                    <Circle 
                      cx={tooth.cx} 
                      cy={tooth.cy} 
                      r={tooth.type === 'sm' || tooth.type === 'pm' ? 45 : 38} 
                      fill="none" 
                      stroke={color} 
                      strokeWidth={6}
                      strokeDasharray="12, 8"
                      pointerEvents="none"
                    />
                    {/* Borde interno blanco */}
                    <Circle 
                      cx={tooth.cx} 
                      cy={tooth.cy} 
                      r={tooth.type === 'sm' || tooth.type === 'pm' ? 41 : 34} 
                      fill="none" 
                      stroke="#FFFFFF" 
                      strokeWidth={3}
                      pointerEvents="none"
                    />
                    {/* Brillo */}
                    <Circle 
                      cx={tooth.cx} 
                      cy={tooth.cy} 
                      r={tooth.type === 'sm' || tooth.type === 'pm' ? 38 : 31} 
                      fill="url(#glow)" 
                      pointerEvents="none"
                    />
                  </G>
                )}
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Tarjeta de información animada */}
      {activeSpot ? (
        <Animated.View 
          style={[
            styles.infoBox, 
            { borderLeftColor: TOOTH_COLORS[activeSpot.type] },
            {
              opacity: infoAnim,
              transform: [
                { translateY: infoAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) },
                { scale: infoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
              ]
            }
          ]}
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoName}>{TOOTH_NAMES[activeSpot.type]}</Text>
            <Text style={styles.infoArch}>
              {activeArch === 'upper' ? 'Maxilar Superior' : 'Maxilar Inferior'}
            </Text>
            <View style={styles.ageRow}>
              <View style={[styles.clockIconContainer, { backgroundColor: TOOTH_COLORS[activeSpot.type] + '22' }]}>
                <Text style={styles.clockIcon}>🕐</Text>
              </View>
              <Text style={styles.infoAge}>{activeSpot.age}</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setActiveSpot(null)} style={styles.closeBadge}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.hintBox}>
          <Text style={styles.hintIcon}>✨</Text>
          <Text style={styles.hintText}>Toca cualquier diente en la imagen</Text>
        </View>
      )}
      
      {/* Solo mostramos la leyenda si no hay un diente seleccionado para ahorrar espacio vertical */}
      {!activeSpot && (
        <View style={styles.legend}>
          {(isPermanent ? PERMANENT_KEYS : DECIDUOUS_KEYS).map(key => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: TOOTH_COLORS[key] }]} />
              <Text style={styles.legendText}>{TOOTH_NAMES[key]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 20,
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: '90%',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F8',
    borderRadius: 30,
    padding: 4,
    marginBottom: 12,
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 26,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.navy,
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderLeftWidth: 6,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoContent: { flex: 1 },
  infoName: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
    color: Colors.navy,
    marginBottom: 2,
  },
  infoArch: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  ageRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clockIconContainer: {
    width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center'
  },
  clockIcon: { fontSize: 14 },
  infoAge: { fontFamily: Typography.fonts.ubuntuBold, fontSize: 16, color: Colors.text.primary },
  closeBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F2F8',
    alignItems: 'center', justifyContent: 'center', marginLeft: 12
  },
  closeText: { fontSize: 14, color: Colors.navy, fontFamily: Typography.fonts.ubuntuBold },
  hintBox: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingVertical: 10,
    paddingHorizontal: 20, backgroundColor: '#F0F2F8', borderRadius: 14, gap: 10
  },
  hintIcon: { fontSize: 18 },
  hintText: { fontFamily: Typography.fonts.ubuntuBold, fontSize: 13, color: Colors.navy, flex: 1 },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12,
    paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: '#EAECEF', paddingTop: 10, width: '100%'
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#1A1A1A' },
  legendText: { fontFamily: Typography.fonts.ubuntuBold, fontSize: 12, color: Colors.navy },
});
