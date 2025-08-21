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

export const useEditDailyReportForm = () => {
  const [progressText, setProgressText] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [selectedDealy, setSelectedDealy] = useState('');

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [imageError, setImageError] = useState('');
  const [weatherError, setWeatherError] = useState('');

  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 5, // multiple images
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImages(prev => [...prev, ...response.assets]);
        setImageError('');
        setShowPhotoModal(false);
      }
    });
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      if (response?.assets?.length > 0) {
        setSelectedImages(prev => [...prev, ...response.assets]);
        setImageError('');
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
      setWeatherError('');
      setShowWeatherDropdown(false);
    },
    selectedDealy,
    setSelectedDealy,

    showPhotoModal,
    setShowPhotoModal,
    openGallery,
    openCamera,
    selectedImages,
    setSelectedImages,
    removeImage,

    imageError,
    setImageError,

    weatherError,
    setWeatherError,
  };
};
