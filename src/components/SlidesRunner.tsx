import { DynamicImage } from './DynamicImage';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import {
  ContentSlide, InfoSlide, DetailSlide, DiagramSlide, Slide,
} from '../data/content';
import { Header } from './Header';
import { FooterLogos } from './FooterLogos';
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
  
  const availableWidth = width - 72; // Screen width minus padding
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
    <SafeAreaView style={styles.container}>
      {/* ZONE 1 */}
      <Header title={groupTitle} decoration={isLeft ? 'left' : 'right'} />
      {slide.subtitle && (
        <Text style={styles.subtitle} adjustsFontSizeToFit numberOfLines={2}>
          {slide.subtitle}
        </Text>
      )}

      {/* ZONE 2 */}
      <View style={styles.body}>
        <View style={styles.navyCard}>
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
            >
              {btn.imagePosition === 'left' && (
                <View style={styles.slideButtonImgWrap}>
                  <DynamicImage source={btn.image} style={styles.slideButtonImg} resizeMode="contain" />
                </View>
              )}
              <View style={styles.slideButtonInnerBlue}>
                <Text style={styles.slideButtonText} adjustsFontSizeToFit minimumFontScale={0.6} numberOfLines={2}>
                  {btn.text}
                </Text>
              </View>
              {btn.imagePosition === 'right' && (
                <View style={styles.slideButtonImgWrap}>
                  <DynamicImage source={btn.image} style={styles.slideButtonImg} resizeMode="contain" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.mascotWrap, { alignItems: isLeft ? 'flex-start' : 'center', marginTop: 10 }]}>
          <DynamicImage
            source={slide.image}
            style={{ width: toothSize, height: toothSize }}
            resizeMode="contain"
          />
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
        <FooterLogos />
      </View>
    </SafeAreaView>
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
  <SafeAreaView style={styles.container}>
    {/* ZONE 1 */}
    <Header title={groupTitle} decoration="right" />
    <Text style={styles.subtitle} adjustsFontSizeToFit numberOfLines={2}>
      {slide.subtitle}
    </Text>

    {/* ZONE 2 */}
    <View style={styles.body}>
      <View style={styles.navyCard}>
        <Text style={styles.navyCardText} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={20}>
          {slide.bodyText}
        </Text>
        {slide.showInfoIcon && (
          <TouchableOpacity style={styles.infoIconWrap} activeOpacity={0.8} onPress={onInfo}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="information" size={30} color={Colors.blue} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>

    {/* ZONE 3 */}
    <View style={styles.footer}>
      <View style={[styles.footerRow, { justifyContent: 'space-between' }]}>
        <BackButton onPress={onBack} />
        {!hideNext && <NextButton onPress={onNext} isLast={isLast} />}
      </View>
      <FooterLogos />
    </View>
  </SafeAreaView>
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
  const modalW = width - 32;
  const maxPhotoHeight = height * 0.45;
  const availableWidth = modalW - 32;
  
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
    <SafeAreaView style={styles.container}>
      {/* ZONE 1 */}
      <Header title={groupTitle} decoration="none" />

      {/* ZONE 2 — modal card is content-sized, vertically centered */}
      <View style={styles.body}>
        <View style={[styles.infoModal, { width: modalW }]}>
          {slide.showExclamation && (
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={20} color="#FC5939" />
              <Text style={styles.alertHeaderText}>¡IMPORTANTE!</Text>
              <Ionicons name="warning" size={20} color="#FC5939" />
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
    </SafeAreaView>
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
  <SafeAreaView style={styles.container}>
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
  </SafeAreaView>
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ZONE 2 — flex:1 fills all space between header and footer
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center', // vertically centers the card when content is short
  },

  // ─── Navy card ──────────────────────────────────────────────────────────────
  // KEY DESIGN DECISION:
  //   flexGrow:1  → expands to fill body if there's extra space
  //   flexShrink:1 → shrinks if content is smaller than available space
  //   This prevents the "giant empty card" problem while still using space well
  navyCard: {
    backgroundColor: Colors.navy,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    flexShrink: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
  },
  navyCardText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.card,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.card * 1.25,
    // REMOVED flexShrink: 1 to ensure text always demands the space it needs to be readable
  },

  // ZONE 3 — footer always at bottom
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  mascotWrap: {
    alignItems: 'center',
  },

  // Subtitle below header
  subtitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: Typography.sizes.subtitle,
    color: Colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    lineHeight: Typography.sizes.subtitle * 1.2,
  },

  // Info icon inside detail card
  infoIconWrap: {
    marginTop: 14,
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
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    flexShrink: 1, // Image yields space to the text if the screen is cramped
  },

  // Inline subtopic buttons
  slideButton: {
    flexDirection: 'row',
    backgroundColor: '#C8C8C8',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000',
    padding: 6,
    marginTop: 8,
    alignItems: 'center',
    gap: 6,
  },
  slideButtonInnerBlue: {
    flex: 1,
    backgroundColor: Colors.navy,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  slideButtonText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.body,
    color: Colors.white,
    textAlign: 'center',
  },
  slideButtonImgWrap: {
    width: 54,
    height: 54,
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  slideButtonImg: {
    width: 44,
    height: 44,
  },

  // Info/Modal slide
  infoModal: {
    backgroundColor: Colors.lavender,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%',
  },
  alertHeaderText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 17,
    color: '#FC5939',
    letterSpacing: 1,
  },
  infoPhotoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1, // Image yields space to the text if the screen is cramped
  },
  infoPhoto: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.body,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.body * 1.2,
    paddingHorizontal: 8,
  },
});
