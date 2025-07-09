import { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Dropdown options
export const weatherOptions = [
  'Sunny',
  'Partly Cloudy',
  'Cloudy',
  'Overcast',
  'Light Rain',
  'Rain',
  'Heavy Rain',
  'Drizzle',
  'Snow',
  'Fog',
  'Windy',
  'Storm',
];

export const delayOptions = [
  '0 hours',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  '6 hours',
  '7 hours',
  '8 hours',
  '9 hours',
];

export const plantOptions = [
  'BSP',
  'SAIL',
  'Vedanta',
  'KEC',
  'AA ENERGY LIMITED',
  'AADI PVT LTD',
];

export const useDailyReport = () => {
  const [progressText, setProgressText] = useState('');

  const [selectedWeather, setSelectedWeather] = useState('');
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);

  const [selectedDealy, setSelectedDealy] = useState('');
  const [showDealyDropdown, setShowDealyDropdown] = useState(false);

  const [selectedPlant, setSelectedPlant] = useState('');
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleWeatherSelect = (value: string) => {
    setSelectedWeather(value);
    setShowWeatherDropdown(false);
  };

  const handleDelaySelect = (value: string) => {
    setSelectedDealy(value);
    setShowDealyDropdown(false);
  };

  const handlePlantSelect = (value: string) => {
    setSelectedPlant(value);
    setShowPlantDropdown(false);
  };

  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: false,
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImage(response.assets[0]);
        setShowPhotoModal(false);
        console.log('Selected from gallery:', response.assets[0]);
      }
    });
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImage(response.assets[0]);
        setShowPhotoModal(false);
        console.log('Captured from camera:', response.assets[0]);
      }
    });
  };

  return {
    progressText,
    setProgressText,

    selectedWeather,
    showWeatherDropdown,
    setShowWeatherDropdown,
    handleWeatherSelect,

    selectedDealy,
    showDealyDropdown,
    setShowDealyDropdown,
    handleDelaySelect,

    selectedPlant,
    showPlantDropdown,
    setShowPlantDropdown,
    handlePlantSelect,

    selectedImage,
    showPhotoModal,
    setShowPhotoModal,
    openGallery,
    openCamera,
  };
};
