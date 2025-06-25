import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  StatusBar,
} from 'react-native';
import { OnboardingSlide } from '../../../components/OnboardingSlide';
import onboard_1 from '../../../assets/images/onboard_1.png';
import onboard_2 from '../../../assets/images/onboard_2.png';
import onboard_3 from '../../../assets/images/onboard_3.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const slides = [
  {
    id: '1',
    title: 'Optimize Costs',
    description:
      'We offer effective solutions tailored to your needs, helping you optimize costs and maximize value.',
    imageUrl: onboard_1,
  },
  {
    id: '2',
    title: 'Build Smarter',
    description:
      'We are committed to exceeding your expectations and building lasting partnerships.',
    imageUrl: onboard_2,
  },
  {
    id: '3',
    title: 'Maximize Value',
    description:
      'Achieve efficiency and innovation with our services. We offer effective solutions tailored to your needs.',
    imageUrl: onboard_3,
  },
];
const OnBoardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation();
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      // DO NOT setCurrentIndex here — wait for onMomentumScrollEnd to update currentIndex
    } else {
      navigation.navigate('login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="black" />
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OnboardingSlide {...item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width,
          );
          setCurrentIndex(newIndex);
        }}
      />

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get started' : 'Continue'}
          </Text>
        </Pressable>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('6%'),
    paddingTop: hp('3%'),
    backgroundColor: '#fff',
    marginTop: hp('2%'),
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp('3%'),
    paddingTop: hp('3%'),
  },

  paginationDot: {
    width: wp('2.2%'),
    height: wp('2.2%'),
    borderRadius: wp('1.1%'),
    backgroundColor: '#e0e0e0',
    marginHorizontal: wp('1%'),
  },

  paginationDotActive: {
    backgroundColor: '#141b41',
    width: wp('5.5%'),
  },

  button: {
    backgroundColor: '#141b41',
    paddingVertical: hp('2%'),
    borderRadius: wp('50%'),
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: wp('4.5%'),
  },
});
