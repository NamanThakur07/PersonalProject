import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
colors
import CustomeButton from '../../components/UI/CustomButton';
import colors from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Rukkor!',
    subtitle: 'Simple software, easy workplaces.',
    image: 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png',
  },
  {
    id: '2',
    title: 'Manage with Ease',
    subtitle: 'Track tasks, teams, and progress smoothly.',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    id: '3',
    title: 'Achieve More',
    subtitle: 'Stay productive and ahead with our tools.',
    image: 'https://cdn-icons-png.flaticon.com/512/4359/4359951.png',
  },
];

const OnboardingScreen = ({ navigation }:any) => {
 const insets = useSafeAreaInsets(); 
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event:any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login'); // Go to next screen
    }
  };

  const renderSlide = ({ item }:any) => (
    <View style={[styles.slide, { width }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderSlide}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Dots */}
      <View style={[styles.dotsContainer , {
          bottom:insets.bottom + 30
      }]}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Button */}
      <CustomeButton
        title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        onPress={handleNext}
        style={{
          backgroundColor: colors.buttonbgColor,
          paddingHorizontal: 30,
          marginVertical: 20,
          bottom:insets.bottom + 30
        }}
        textStyle={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.buttonColor,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.heading,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subheading,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.buttonbgColor,
    width: 16,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});

export default OnboardingScreen;