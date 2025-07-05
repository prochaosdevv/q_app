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

export const labourOptions = [
  'Ram',
  'Mohan',
  'Sohan',
  'Chintu',
  'Mintu',
  'Shyam',
  'Pinku',
  'Ramesh',
];

export const materialOptions = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
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
  // Progres Text
  const [progressText, setProgressText] = useState('');

  // Weather dropdown
  const [selectedWeather, setSelectedWeather] = useState('');
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);

  // Delay dropdown
  const [selectedDealy, setSelectedDealy] = useState('');
  const [showDealyDropdown, setShowDealyDropdown] = useState(false);

  // Labour dropdown
  const [selectedLabour, setSelectedLabour] = useState('');
  const [showLabourDropdown, setShowLabourDropdown] = useState(false);

  // Material dropdown
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

  // Plant dropdown
  const [selectedPlant, setSelectedPlant] = useState('');
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);

  // Modal to show camera/gallery options
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Image preview state
  const [selectedImage, setSelectedImage] = useState(null);

  // ========== Dropdown Handlers ==========
  const handleWeatherSelect = (weather: string) => {
    setSelectedWeather(weather);
    setShowWeatherDropdown(false); // close modal
  };

  const handleDelaySelect = (delay: string) => {
    setSelectedDealy(delay);
    setShowDealyDropdown(false); // close modal
  };

  const handleLabourSelect = (labour: string) => {
    setSelectedLabour(labour);
    setShowLabourDropdown(false); // close modal
  };

  const handleMaterialSelect = (material: string) => {
    setSelectedMaterial(material);
    setShowMaterialDropdown(false); // close modal
  };

  const handlePlantSelect = (plant: string) => {
    setSelectedPlant(plant);
    setShowPlantDropdown(false); // close modal
  };

  // ========== Image Picker Options ==========
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: false,
  };

  // ========== Open Gallery ==========
  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]); // Set image for preview
        setShowPhotoModal(false); // Close modal after selection
        console.log('Gallery image:', response.assets[0]);
      }
    });
  };

  // ========== Open Camera ==========
  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]); // Set image for preview
        setShowPhotoModal(false); // Close modal after capture
        console.log('Camera image:', response.assets[0]);
      }
    });
  };

  // ========== Expose to Screen ==========
  return {
    // Progress Text
    progressText,
    setProgressText,

    // Weather
    selectedWeather,
    setShowWeatherDropdown,
    showWeatherDropdown,
    handleWeatherSelect,

    // Delay
    selectedDealy,
    setShowDealyDropdown,
    showDealyDropdown,
    handleDelaySelect,

    // Labour
    selectedLabour,
    setShowLabourDropdown,
    showLabourDropdown,
    handleLabourSelect,

    // Material
    selectedMaterial,
    setShowMaterialDropdown,
    showMaterialDropdown,
    handleMaterialSelect,

    // Plant
    selectedPlant,
    setShowPlantDropdown,
    showPlantDropdown,
    handlePlantSelect,

    // Image Modal
    showPhotoModal,
    setShowPhotoModal,

    // Image Handling
    selectedImage, // for preview
    openGallery, // open gallery
    openCamera, // open camera
  };
};
