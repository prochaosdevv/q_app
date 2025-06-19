import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface OnboardingSlideProps {
  title: string;
  description: string;
  imageUrl: number | string;
}

export function OnboardingSlide({
  title,
  description,
  imageUrl,
}: OnboardingSlideProps) {
  const { width, height } = useWindowDimensions();
  const IMAGE_HEIGHT = height * 0.6;

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={[styles.imageWrap, { height: IMAGE_HEIGHT }]}>
        <Image
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
          style={styles.image}
          resizeMode="stretch"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },

  imageWrap: {
    height: hp('45%'),
    width: '100%',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    backgroundColor: '#fff',
  },

  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('7.5%'),
    color: '#141b41',
    textAlign: 'center',
    marginBottom: hp('1%'),
    fontWeight: '800',
  },

  description: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4.2%'),
    color: '#666',
    textAlign: 'center',
    lineHeight: hp('3%'),
  },
});
