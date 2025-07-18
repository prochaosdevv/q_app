import { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const weatherOptions = [
  'Sunny',
  'Cloudy',
  'Rain',
  'Storm',
  'Snow',
  'Fog',
];

export const delayOptions = [
  '0 hours',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
];

export const plantOptions = ['BSP', 'SAIL', 'Vedanta', 'KEC'];

export const useEditDailyReportForm = () => {
  const [progressText, setProgressText] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [selectedDealy, setSelectedDealy] = useState('');
  const [showDealyDropdown, setShowDealyDropdown] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 5, // multiple images
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImages(prev => [...prev, ...response.assets]);
        setShowPhotoModal(false);
      }
    });
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImages(prev => [...prev, ...response.assets]);
        setShowPhotoModal(false);
      }
    });
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return {
    progressText,
    setProgressText,
    selectedWeather,
    showWeatherDropdown,
    setShowWeatherDropdown,
    setSelectedWeather,
    handleWeatherSelect: value => {
      setSelectedWeather(value);
      setShowWeatherDropdown(false);
    },
    selectedDealy,
    showDealyDropdown,
    setShowDealyDropdown,
    setSelectedDealy,
    handleDelaySelect: value => {
      setSelectedDealy(value);
      setShowDealyDropdown(false);
    },
    selectedPlant,
    showPlantDropdown,
    setShowPlantDropdown,
    setSelectedPlant,
    handlePlantSelect: value => {
      setSelectedPlant(value);
      setShowPlantDropdown(false);
    },
    showPhotoModal,
    setShowPhotoModal,
    openGallery,
    openCamera,
    selectedImages,
    setSelectedImages,
    removeImage,
  };
};
