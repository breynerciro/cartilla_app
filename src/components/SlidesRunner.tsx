import { DynamicImage } from './DynamicImage';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions,
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

const ContentSlideView = ({
  slide, groupTitle, onNext, onBack, isLast, onNavigate
}: { slide: ContentSlide; groupTitle: string; onNext: () => void; onBack: () => void; isLast: boolean; onNavigate?: (targetId: string) => void }) => {
  const { width } = useWindowDimensions();
  const toothSize = Math.min(width * 0.45, 220);
  const isLeft = slide.toothPosition === 'left';
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={groupTitle}
        decoration={isLeft ? 'left' : 'right'}
        showBack={true}
        onBack={onBack}
      />
      {slide.subtitle && (
        <Text style={styles.detailSubtitle}>{slide.subtitle}</Text>
      )}
      <View style={[styles.slideBody, slide.subtitle ? { paddingTop: 10 } : undefined]}>
        <View style={styles.navyCard}>
          <Text style={styles.navyCardText}>{slide.text}</Text>
          {slide.photo && (
            <DynamicImage 
              source={slide.photo} 
              style={{ width: '100%', height: 180, borderRadius: 15, marginTop: 15, borderWidth: 2, borderColor: '#000' }} 
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
                <Text style={styles.slideButtonText}>{btn.text}</Text>
              </View>
              {btn.imagePosition === 'right' && (
                <View style={styles.slideButtonImgWrap}>
                  <DynamicImage source={btn.image} style={styles.slideButtonImg} resizeMode="contain" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.charRow}>
          <View style={styles.charImageContainer}>
            <DynamicImage 
              source={slide.image} 
              style={{ width: toothSize, height: toothSize, alignSelf: isLeft ? 'flex-start' : 'center' }} 
              resizeMode="contain" 
            />
          </View>
          <NextButton onPress={onNext} isLast={isLast} />
        </View>
      </View>
      <FooterLogos />
    </SafeAreaView>
  );
};

const DetailSlideView = ({
  slide, groupTitle, onBack, onNext, onInfo, isLast,
}: { slide: DetailSlide; groupTitle: string; onBack: () => void; onNext: () => void; onInfo: () => void; isLast: boolean }) => {
  const { width } = useWindowDimensions();
  const fs = Math.min(Typography.sizes.card, width * 0.08);
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={groupTitle}
        decoration="right"
        showBack={true}
        onBack={onBack}
      />
      <Text style={styles.detailSubtitle}>{slide.subtitle}</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.navyCard}>
          <Text style={[styles.navyCardText, { fontSize: fs }]}>{slide.bodyText}</Text>
          {slide.showInfoIcon && (
            <TouchableOpacity style={styles.infoIconWrap} activeOpacity={0.8} onPress={onInfo}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="information" size={32} color={Colors.blue} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.footerDetail}>
        <BackButton onPress={onBack} />
        <NextButton onPress={onNext} isLast={isLast} />
      </View>
    </SafeAreaView>
  );
};

const InfoSlideView = ({
  slide, groupTitle, onBack, onNext, isLast,
}: { slide: InfoSlide; groupTitle: string; onBack: () => void; onNext: () => void; isLast: boolean }) => {
  const { width } = useWindowDimensions();
  const modalW = Math.min(width - 40, 500);
  const photoW = modalW - 32;
  const photoH = photoW * (9 / 16);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={groupTitle}
        decoration="none"
        showBack={true}
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.infoScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoModal, { width: modalW }]}>
          {slide.showExclamation && (
            <>
              <View style={[styles.excl, styles.exclL]}><Text style={styles.exclText}>!</Text></View>
              <View style={[styles.excl, styles.exclR]}><Text style={styles.exclText}>!</Text></View>
            </>
          )}
          <DynamicImage source={slide.photo} style={[styles.infoPhoto, { width: photoW, height: photoH }]} resizeMode="cover" />
          <Text style={styles.infoText}>{slide.alertText}</Text>
        </View>
      </ScrollView>
      <View style={styles.footerDetail}>
        <BackButton onPress={onBack} />
        <NextButton onPress={onNext} isLast={isLast} />
      </View>
    </SafeAreaView>
  );
};

const DiagramSlideView = ({
  groupTitle, onNext, onBack, isLast,
}: { groupTitle: string; onNext: () => void; onBack: () => void; isLast: boolean }) => (
  <SafeAreaView style={styles.container}>
    <Header 
      title={groupTitle}
      decoration="left"
      showBack={true}
      onBack={onBack}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <InteractiveDentalDiagram />
    </ScrollView>
    <View style={styles.footerDetail}>
      <BackButton onPress={onBack} />
      <NextButton onPress={onNext} isLast={isLast} />
    </View>
  </SafeAreaView>
);

export function SlidesRunner({
  slides, groupTitle, onFinish, onNavigate
}: { slides: Slide[]; groupTitle: string; onFinish: () => void; onNavigate?: (targetId: string) => void }) {
  const [idx, setIdx] = useState(0);
  const current = slides[idx];
  
  const getNextNormalIdx = (currentIndex: number) => {
    let i = currentIndex + 1;
    while (i < slides.length && 'type' in slides[i] && (slides[i] as any).type === 'modal') i++;
    return i;
  };

  const getPrevNormalIdx = (currentIndex: number) => {
    let i = currentIndex - 1;
    while (i >= 0 && 'type' in slides[i] && (slides[i] as any).type === 'modal') i--;
    return i;
  };

  const isLast = getNextNormalIdx(idx) >= slides.length;

  const goNext = () => {
    const isModal = 'type' in current && current.type === 'modal';
    const nextIdx = isModal ? idx + 1 : getNextNormalIdx(idx);
    if (nextIdx < slides.length) setIdx(nextIdx);
    else onFinish();
  };

  const goPrev = () => {
    const isModal = 'type' in current && current.type === 'modal';
    const prevIdx = isModal ? getPrevNormalIdx(idx) : (idx > 0 ? getPrevNormalIdx(idx) : -1);
    if (prevIdx >= 0) setIdx(prevIdx);
    else onFinish();
  };

  const openModal = () => {
    if (idx + 1 < slides.length && 'type' in slides[idx + 1] && (slides[idx + 1] as any).type === 'modal') {
      setIdx(idx + 1);
    }
  };

  if (!current) return null;

  if ('type' in current) {
    if (current.type === 'detail') {
      return <DetailSlideView slide={current as DetailSlide} groupTitle={groupTitle} onBack={goPrev} onNext={goNext} onInfo={openModal} isLast={isLast} />;
    }
    if (current.type === 'modal') {
      return <InfoSlideView slide={current as InfoSlide} groupTitle={groupTitle} onBack={goPrev} onNext={goNext} isLast={isLast} />;
    }
    if (current.type === 'diagram') {
      return <DiagramSlideView groupTitle={groupTitle} onNext={goNext} onBack={goPrev} isLast={isLast} />;
    }
  }
  return <ContentSlideView slide={current as ContentSlide} groupTitle={groupTitle} onNext={goNext} onBack={goPrev} isLast={isLast} onNavigate={onNavigate} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  slideBody: { flex: 1, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  navyCard: {
    backgroundColor: Colors.navy, borderRadius: 27, padding: 28,
    width: '100%', marginBottom: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 6, elevation: 5,
  },
  navyCardText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.card, color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.card * Typography.lineHeight.normal,
  },
  charRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', width: '100%', paddingHorizontal: 8,
  },
  charImageContainer: { flex: 1 },
  detailSubtitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: Typography.sizes.subtitle, color: Colors.text.primary,
    textAlign: 'center', paddingHorizontal: 20, paddingVertical: 10,
    lineHeight: Typography.sizes.subtitle * 1.2,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 20, flexGrow: 1 },
  infoScroll: { paddingHorizontal: 12, paddingBottom: 20, flexGrow: 1, justifyContent: 'center' },
  infoModal: {
    backgroundColor: Colors.lavender, borderWidth: 2,
    borderColor: Colors.white, borderRadius: 30,
    padding: 16, alignItems: 'center', overflow: 'hidden',
    width: '100%',
  },
  excl: { position: 'absolute', top: 60, zIndex: 2, width: 30, height: 90, alignItems: 'center', justifyContent: 'center' },
  exclL: { left: 8 },
  exclR: { right: 8, transform: [{ scaleY: -1 }] },
  exclText: { fontFamily: Typography.fonts.ubuntuBold, fontSize: 48, color: '#FC5939', lineHeight: 52 },
  infoPhoto: { width: '100%', aspectRatio: 16 / 9, borderRadius: 20, borderWidth: 2, borderColor: '#000', marginBottom: 16 },
  infoText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.body, color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.body * Typography.lineHeight.tight,
    paddingHorizontal: 20,
  },
  infoIconWrap: { marginTop: 20, alignItems: 'center' },
  infoIconCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: Colors.blue, alignItems: 'center', justifyContent: 'center' },
  infoIconText: { fontFamily: Typography.fonts.ubuntuBold, fontSize: 24, color: Colors.blue },
  footerDetail: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  slideButton: {
    flexDirection: 'row',
    backgroundColor: '#C8C8C8',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    padding: 8,
    marginTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  slideButtonInnerBlue: {
    flex: 1,
    backgroundColor: Colors.navy,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideButtonText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.body,
    color: Colors.white,
    textAlign: 'center',
  },
  slideButtonImgWrap: {
    width: 60,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  slideButtonImg: {
    width: 50,
    height: 50,
  }
});
