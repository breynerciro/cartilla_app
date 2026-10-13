import { DynamicImage } from './DynamicImage';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image as RNImage,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../theme/colors';
import { Spacing, screenPadding } from '../theme/spacing';
import { Typography } from '../theme/typography';
import {
  ContentSlide, InfoSlide, DetailSlide, DiagramSlide, Slide,
} from '../data/content';
import { Screen } from './Screen';
import { Header } from './Header';
import { NavyCard } from './NavyCard';
import { NextButton } from './NextButton';
import { BackButton } from './BackButton';
import { InteractiveDentalDiagram } from './InteractiveDentalDiagram';

// ─── ContentSlideView ─────────────────────────────────────────────────────────
const ContentSlideView = ({
  slide, groupTitle, onNext, onBack, isLast, onNavigate, hideNext,
}: {
  slide: ContentSlide;
  groupTitle: string;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
  onNavigate?: (targetId: string) => void;
  hideNext?: boolean;
}) => {
  const { width, height } = useWindowDimensions();
  const toothSize = Math.min(width * 0.36, 170);
  const isLeft = slide.toothPosition === 'left';
  
  const availableWidth = width - 2 * (screenPadding + Spacing.xl); // margen de pantalla + padding de NavyCard md
  const maxPhotoHeight = height * 0.45; // Reserve 45% of screen height max for photos

  let photoAspectRatio = 1.5;
  if (slide.photo) {
    const sourceInfo = RNImage.resolveAssetSource(slide.photo);
    if (sourceInfo && sourceInfo.width && sourceInfo.height) {
      photoAspectRatio = sourceInfo.width / sourceInfo.height;
    }
  }

  // Calculate exact bounds so the container tightly hugs the image
  const calculatedWidth = Math.min(availableWidth, maxPhotoHeight * photoAspectRatio);
  const calculatedHeight = calculatedWidth / photoAspectRatio;

  return (
    <Screen>
      {/* ZONE 1 */}
      <Header title={groupTitle} decoration={isLeft ? 'left' : 'right'} />
      {slide.subtitle && (
        <Text style={styles.subtitle} adjustsFontSizeToFit numberOfLines={2}>
          {slide.subtitle}
        </Text>
      )}

      {/* ZONE 2 */}
      <View style={styles.body}>
        <NavyCard size="md" style={styles.navyCard}>
          <Text style={styles.navyCardText} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={20}>
            {slide.text}
          </Text>
          {slide.photo && (
            <DynamicImage
              source={slide.photo}
              style={[styles.cardPhoto, { width: calculatedWidth, height: calculatedHeight }]}
              resizeMode="cover"
            />
          )}
          {slide.buttons && slide.buttons.map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={styles.slideButton}
              activeOpacity={0.8}
              onPress={() => onNavigate && onNavigate(btn.targetId)}
              accessibilityRole="button"
              accessibilityLabel={btn.text}
            >
              {btn.imagePosition === 'left' && (
                <View style={styles.slideButtonImgWrap}>
                  <DynamicImage source={btn.image} style={styles.slideButtonImg} resizeMode="contain" />
                </View>
              )}
              
              <View style={styles.slideButtonTextWrap}>
                <Text style={styles.slideButtonText} adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={2}>
                  {btn.text}
                </Text>
              </View>
              
              {btn.imagePosition === 'right' && (
                <View style={styles.slideButtonImgWrap}>
                  <DynamicImage source={btn.image} style={styles.slideButtonImg} resizeMode="contain" />
                </View>
              )}

              <Ionicons name="chevron-forward" size={24} color={Colors.blue} />
            </TouchableOpacity>
          ))}
        </NavyCard>

        <View style={[styles.mascotWrap, { alignItems: isLeft ? 'flex-start' : 'center', marginTop: Spacing.md }]}>
          <View style={[styles.mascotAndBubbleContainer, { flexDirection: 'row' }]}>
            {!isLeft && slide.speechBubble && (
              <TouchableOpacity 
                style={[styles.speechBubbleFlex, { marginRight: Spacing.lg }]}
                activeOpacity={0.8}
                onPress={() => onNavigate && onNavigate(slide.speechBubble!.targetId)}
                accessibilityRole="button"
                accessibilityLabel={slide.speechBubble.text}
              >
                <View style={[styles.speechBubblePointer, styles.pointerRightToothFlex]} />
                <Text style={styles.speechBubbleText}>{slide.speechBubble.text}</Text>
              </TouchableOpacity>
            )}
            
            <DynamicImage
              source={slide.image}
              style={{ width: toothSize, height: toothSize, zIndex: 2 }}
              resizeMode="contain"
              accessible={false}
              importantForAccessibility="no"
            />

            {isLeft && slide.speechBubble && (
              <TouchableOpacity 
                style={[styles.speechBubbleFlex, { marginLeft: Spacing.lg }]}
                activeOpacity={0.8}
                onPress={() => onNavigate && onNavigate(slide.speechBubble!.targetId)}
                accessibilityRole="button"
                accessibilityLabel={slide.speechBubble.text}
              >
                <View style={[styles.speechBubblePointer, styles.pointerLeftToothFlex]} />
                <Text style={styles.speechBubbleText}>{slide.speechBubble.text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ZONE 3 */}
      <View style={styles.footer}>
        <View style={[styles.footerRow, { justifyContent: 'space-between' }]}>
          <BackButton onPress={onBack} />
          {!hideNext ? (
            <NextButton onPress={onNext} isLast={isLast} />
          ) : (
            <View style={{ width: 82 }} /> 
          )}
        </View>
      </View>
    </Screen>
  );
};

// ─── DetailSlideView ──────────────────────────────────────────────────────────
const DetailSlideView = ({
  slide, groupTitle, onBack, onNext, onInfo, isLast, hideNext,
}: {
  slide: DetailSlide;
  groupTitle: string;
  onBack: () => void;
  onNext: () => void;
  onInfo: () => void;
  isLast: boolean;
  hideNext?: boolean;
}) => (
  <Screen>
    {/* ZONE 1 */}
    <Header title={groupTitle} decoration="right" />
    <Text style={styles.subtitle} adjustsFontSizeToFit numberOfLines={2}>
      {slide.subtitle}
    </Text>

    {/* ZONE 2 */}
    <View style={styles.body}>
      <NavyCard size="md" style={styles.navyCard}>
        <Text style={styles.navyCardText} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={20}>
          {slide.bodyText}
        </Text>
        {slide.showInfoIcon && (
          <TouchableOpacity
            style={styles.infoIconWrap}
            activeOpacity={0.8}
            onPress={onInfo}
            accessibilityRole="button"
            accessibilityLabel="Más información"
          >
            <View style={styles.infoIconCircle}>
              <Ionicons name="information" size={30} color={Colors.blue} />
            </View>
          </TouchableOpacity>
        )}
      </NavyCard>
    </View>

    {/* ZONE 3 */}
    <View style={styles.footer}>
      <View style={[styles.footerRow, { justifyContent: 'space-between' }]}>
        <BackButton onPress={onBack} />
        {!hideNext && <NextButton onPress={onNext} isLast={isLast} />}
      </View>
    </View>
  </Screen>
);

// ─── InfoSlideView (modal) ────────────────────────────────────────────────────
const InfoSlideView = ({
  slide, groupTitle, onBack,
}: {
  slide: InfoSlide;
  groupTitle: string;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
}) => {
  const { width, height } = useWindowDimensions();
  const modalW = width - 2 * screenPadding;
  const maxPhotoHeight = height * 0.45;
  const availableWidth = modalW - 2 * Spacing.lg;
  
  let photoAspectRatio = 1.5;
  if (slide.photo) {
    const sourceInfo = RNImage.resolveAssetSource(slide.photo);
    if (sourceInfo && sourceInfo.width && sourceInfo.height) {
      photoAspectRatio = sourceInfo.width / sourceInfo.height;
    }
  }

  const calculatedWidth = Math.min(availableWidth, maxPhotoHeight * photoAspectRatio);
  const calculatedHeight = calculatedWidth / photoAspectRatio;

  return (
    <Screen>
      {/* ZONE 1 */}
      <Header title={groupTitle} decoration="none" />

      {/* ZONE 2 — modal card is content-sized, vertically centered */}
      <View style={styles.body}>
        <View style={[styles.infoModal, { width: modalW }]}>
          {slide.showExclamation && (
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={20} color={Colors.danger} />
              <Text style={styles.alertHeaderText}>¡IMPORTANTE!</Text>
              <Ionicons name="warning" size={20} color={Colors.danger} />
            </View>
          )}
          <View style={[styles.infoPhotoContainer, { width: calculatedWidth, height: calculatedHeight }]}>
            <DynamicImage source={slide.photo} style={styles.infoPhoto} resizeMode="cover" />
          </View>
          <Text style={styles.infoText} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={8}>
            {slide.alertText}
          </Text>
        </View>
      </View>

      {/* ZONE 3 */}
      <View style={styles.footer}>
        <View style={[styles.footerRow, { justifyContent: 'center' }]}>
          <BackButton onPress={onBack} />
        </View>
      </View>
    </Screen>
  );
};

// ─── DiagramSlideView ─────────────────────────────────────────────────────────
const DiagramSlideView = ({
  slide, groupTitle, onNext, onBack, isLast, hideNext,
}: {
  slide: DiagramSlide;
  groupTitle: string;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
  hideNext?: boolean;
}) => (
  <Screen>
    {/* ZONE 1 */}
    <Header title={groupTitle} decoration="left" />

    {/* ZONE 2 */}
    <View style={styles.body}>
      <InteractiveDentalDiagram ageGroup={slide.ageGroup} />
    </View>

    {/* ZONE 3 */}
    <View style={styles.footer}>
      <View style={[styles.footerRow, { justifyContent: 'space-between' }]}>
        <BackButton onPress={onBack} />
        {!hideNext && <NextButton onPress={onNext} isLast={isLast} />}
      </View>
    </View>
  </Screen>
);

// ─── SlidesRunner orchestrator ────────────────────────────────────────────────
export function SlidesRunner({
  slides, groupTitle, onFinish, onBackOut, onNavigate, hideNextOnLast,
}: {
  slides: Slide[];
  groupTitle: string;
  onFinish: () => void;
  onBackOut?: () => void;
  onNavigate?: (targetId: string) => void;
  hideNextOnLast?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const current = slides[idx];

  const getNextNormalIdx = (i: number) => {
    let j = i + 1;
    while (j < slides.length && 'type' in slides[j] && (slides[j] as any).type === 'modal') j++;
    return j;
  };
  const getPrevNormalIdx = (i: number) => {
    let j = i - 1;
    while (j >= 0 && 'type' in slides[j] && (slides[j] as any).type === 'modal') j--;
    return j;
  };

  const isLast = getNextNormalIdx(idx) >= slides.length;
  const normalSlidesCount = slides.filter(s => !('type' in s) || (s as any).type !== 'modal').length;

  const goNext = () => {
    const isModal = 'type' in current && (current as any).type === 'modal';
    const next = isModal ? idx + 1 : getNextNormalIdx(idx);
    if (next < slides.length) setIdx(next);
    else onFinish();
  };

  const goPrev = () => {
    const isModal = 'type' in current && (current as any).type === 'modal';
    const prev = isModal ? getPrevNormalIdx(idx) : (idx > 0 ? getPrevNormalIdx(idx) : -1);
    if (prev >= 0) {
      setIdx(prev);
    } else {
      if (onBackOut) onBackOut();
      else onFinish(); // Fallback
    }
  };

  const openModal = () => {
    if (idx + 1 < slides.length && 'type' in slides[idx + 1] && (slides[idx + 1] as any).type === 'modal') {
      setIdx(idx + 1);
    }
  };

  if (!current) return null;

  const type = 'type' in current ? (current as any).type : null;
  
  // Hide the Next button if it's explicitly terminal AND it's a 1-slide flow 
  // (because in a 1-slide flow, Back and Next both go to the same place: the menu)
  const shouldHideNext = isLast && hideNextOnLast && normalSlidesCount === 1;

  if (type === 'detail')
    return <DetailSlideView slide={current as DetailSlide} groupTitle={groupTitle} onBack={goPrev} onNext={goNext} onInfo={openModal} isLast={isLast} hideNext={shouldHideNext} />;
  if (type === 'modal')
    return <InfoSlideView slide={current as InfoSlide} groupTitle={groupTitle} onBack={goPrev} onNext={goNext} isLast={isLast} />;
  if (type === 'diagram')
    return <DiagramSlideView slide={current as DiagramSlide} groupTitle={groupTitle} onNext={goNext} onBack={goPrev} isLast={isLast} hideNext={shouldHideNext} />;

  return <ContentSlideView slide={current as ContentSlide} groupTitle={groupTitle} onNext={goNext} onBack={goPrev} isLast={isLast} onNavigate={onNavigate} hideNext={shouldHideNext} />;
}

// ─── STYLES — shared across all slide types ───────────────────────────────────
const styles = StyleSheet.create({
  // ZONE 2 — flex:1 fills all space between header and footer
  body: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center', // vertically centers the card when content is short
  },

  // ─── Navy card ──────────────────────────────────────────────────────────────
  // KEY DESIGN DECISION:
  //   flexGrow:1  → expands to fill body if there's extra space
  //   flexShrink:1 → shrinks if content is smaller than available space
  //   This prevents the "giant empty card" problem while still using space well
  navyCard: {
    width: '100%',
    flexShrink: 1,
    justifyContent: 'center',
  },
  navyCardText: {
    ...Typography.scale.bodyLarge,
    color: Colors.white,
    textAlign: 'center',
  },

  // ZONE 3 — footer always at bottom, justo sobre la barra de pestañas (sin logos).
  footer: {
    paddingHorizontal: screenPadding,
    paddingBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  mascotWrap: {
    alignItems: 'center',
    width: '100%',
  },
  mascotAndBubbleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubbleFlex: {
    backgroundColor: '#FFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    maxWidth: 160,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  speechBubbleText: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    textAlign: 'center',
  },
  speechBubblePointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    top: '50%',
    marginTop: -8, // mitad del alto del triangulo (2 x borderWidth 8): centra el puntero; no es espaciado
  },
  pointerRightToothFlex: {
    right: -10,
    borderLeftWidth: 10,
    borderLeftColor: '#FFF',
  },
  pointerLeftToothFlex: {
    left: -10,
    borderRightWidth: 10,
    borderRightColor: '#FFF',
  },

  // Subtitle below header
  subtitle: {
    ...Typography.scale.subtitle,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: Spacing.sm,
  },

  // Info icon inside detail card
  infoIconWrap: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Photo inside content card
  cardPhoto: {
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: Spacing.lg,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    flexShrink: 1,
  },

  // Inline subtopic buttons
  slideButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    gap: Spacing.md,
  },
  slideButtonTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  slideButtonText: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
  },
  slideButtonImgWrap: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F4F8',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideButtonImg: {
    width: 36,
    height: 36,
  },

  // Info/Modal slide
  infoModal: {
    backgroundColor: Colors.textSecondary,
    borderRadius: 32,
    padding: Spacing.xxl,
    alignItems: 'center',
    shadowColor: Colors.textSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  alertHeaderText: {
    ...Typography.scale.bodyLarge,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.danger,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  infoPhotoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  infoPhoto: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    ...Typography.scale.bodyLarge,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
});
