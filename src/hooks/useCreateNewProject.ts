import { useState, useEffect } from 'react';
import { Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

import defaultLogo from '../assets/images/jsw_icon.png';
import api from '../utils/api';

export const useCreateNewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [contributors, setContributors] = useState([
    { email: '', permission: 'view only' },
  ]);
  const [members, setMembers] = useState([]);
  const [activeRoleMenu, setActiveRoleMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Open image picker and set selected image
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image.');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      },
    );
  };

  // Handle role change from dropdown
  const handleRoleChange = (index, role) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = role;
    setMembers(updatedMembers);
    setActiveRoleMenu(null);
  };

  // Remove member from list
  const handleRemoveMember = index => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
    setActiveRoleMenu(null);
  };

  // Update contributor email by index
  const handleContributorChange = (text, index) => {
    const newContributors = [...contributors];
    newContributors[index] = {
      ...newContributors[index],
      email: text,
    };
    setContributors(newContributors);
  };

  // Basic email format validation
  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Submit project creation to backend
  const handleCreateProject = async () => {
    setError('');
    setLoading(true);
    const invalidContributor = contributors.some(c => !c.email.trim());
    if (!projectName || !description) {
      setError('Please fill all required fields before creating the project.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', projectName);
      formData.append('description', description);
      formData.append('image', {
        uri: selectedImage
          ? selectedImage.uri
          : Image.resolveAssetSource(defaultLogo).uri,
        name: selectedImage?.fileName || 'default-logo.jpg',
        type: selectedImage?.type || 'image/jpeg',
      });

      const response = await api.post('/project/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        const projectId = response.data.project._id;
        console.log('Data has been saved...!!');
        navigation.navigate('bottom', {
          id: projectId,
        });
      } else {
        setError('Failed to create project. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
    setLoading(false);
  };

  // Clear error on typing
  useEffect(() => {
    if ((projectName || description) && error) {
      setError('');
    }
  }, [projectName, description]);

  return {
    projectName,
    setProjectName,
    description,
    setDescription,
    selectedImage,
    handleImagePicker,
    contributors,
    setContributors,
    members,
    setMembers,
    handleRoleChange,
    handleRemoveMember,
    handleContributorChange,
    handleCreateProject,
    error,
    activeRoleMenu,
    setActiveRoleMenu,
    isValidEmail,
    loading,
    setLoading,
  };
};
