import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { Check, ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useEditDailyReportForm } from '../../../hooks/useEditDailyReportForm';

const MAX_IMAGES = 5;

export default function EditDailyReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params;

  const [progressReport, setProgressReport] = useState(report.progressReport);
  const [plant, setPlant] = useState(report.plant);
  const [delays, setDelays] = useState(String(report.delays));
  const [weather, setWeather] = useState(report.weather?.condition);
  const [labour, setLabour] = useState(report.labour);
  const [material, setMaterial] = useState(report.material);
  const [photos, setPhotos] = useState(report.photos);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { submitForm, loading, error, success, setSuccess } =
    useEditDailyReportForm();

  const handleImageSelect = launchFunc => {
    if (photos.length >= MAX_IMAGES) return;
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: MAX_IMAGES - photos.length,
    };

    launchFunc(options, res => {
      if (res?.assets) {
        const newImages = res.assets.map(img => img.uri);
        setPhotos(prev => [...prev, ...newImages].slice(0, MAX_IMAGES));
        setShowPhotoModal(false);
      }
    });
  };

  const updateArrayValue = (array, index, key, value, setArray) => {
    const updated = [...array];
    updated[index][key] = key === 'qty' ? Number(value) : value;
    setArray(updated);
  };

  const handleSubmit = () => {
    const formValues = {
      progressReport,
      plant,
      delays,
      weather,
      labour,
      material,
      photos,
    };
    submitForm(report._id, formValues);
  };

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
      setSuccess(false);
    }
  }, [success]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Daily Report</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.date}>
          {moment(report.createdAt).format('dddd DD MMMM')}
        </Text>

        {/* Progress Report */}
        <Text style={styles.label}>Progress Report</Text>
        <TextInput
          style={styles.input}
          value={progressReport}
          onChangeText={setProgressReport}
          placeholder="Enter progress"
          multiline
          placeholderTextColor={'black'}
        />

        {/* Plant */}
        <Text style={styles.label}>Plant</Text>
        <TextInput
          style={styles.input}
          value={plant}
          onChangeText={setPlant}
          placeholder="Enter plant name"
          placeholderTextColor={'black'}
        />

        {/* Delays */}
        <Text style={styles.label}>Delays (in hours)</Text>
        <TextInput
          style={styles.input}
          value={delays}
          onChangeText={setDelays}
          keyboardType="numeric"
          placeholder="Enter delay"
          placeholderTextColor={'black'}
        />

        {/* Weather */}
        <Text style={styles.label}>Weather Condition</Text>
        <TextInput
          style={styles.input}
          value={weather}
          onChangeText={setWeather}
          placeholder="Enter weather condition"
          placeholderTextColor={'black'}
        />

        {/* Labour */}
        <Text style={styles.label}>Labour Details</Text>
        <Text style={styles.label}>Labour</Text>
        {labour.map((item, index) => (
          <View key={index} style={styles.cardBox}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={'black'}
              value={item.name}
              onChangeText={text =>
                updateArrayValue(labour, index, 'name', text, setLabour)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Role"
              placeholderTextColor={'black'}
              value={item.role}
              onChangeText={text =>
                updateArrayValue(labour, index, 'role', text, setLabour)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Qty"
              placeholderTextColor={'black'}
              keyboardType="numeric"
              value={String(item.qty)}
              onChangeText={text =>
                updateArrayValue(labour, index, 'qty', text, setLabour)
              }
            />
          </View>
        ))}

        {/* Material */}
        <Text style={styles.label}>Material Details</Text>
        {material.map((item, index) => (
          <View key={index} style={styles.cardBox}>
            <TextInput
              style={styles.input}
              placeholder="Type"
              placeholderTextColor={'black'}
              value={item.type}
              onChangeText={text =>
                updateArrayValue(material, index, 'type', text, setMaterial)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Qty"
              placeholderTextColor={'black'}
              keyboardType="numeric"
              value={String(item.qty)}
              onChangeText={text =>
                updateArrayValue(material, index, 'qty', text, setMaterial)
              }
            />
          </View>
        ))}

        {/* Photos */}
        <Text style={styles.label}>Photos</Text>
        <Pressable
          style={styles.photoButton}
          onPress={() => setShowPhotoModal(true)}
        >
          <Text style={styles.photoButtonText}>Add new photos</Text>
          <Plus size={18} />
        </Pressable>
        <View style={styles.imageContainer}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable
                style={styles.removeIcon}
                onPress={() => {
                  const updated = photos.filter((_, i) => i !== index);
                  setPhotos(updated);
                }}
              >
                <Trash2 size={16} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>

        {error ? (
          <Text
            style={{
              color: 'red',
              marginTop: 30,
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            {error}
          </Text>
        ) : null}
        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* Photo Modal */}
      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowPhotoModal(false)}
          />
          <View style={styles.photoModalBox}>
            <Text style={styles.photoModalTitle}>Add photos</Text>
            <Pressable
              style={styles.photoOptionButton}
              onPress={() => handleImageSelect(launchImageLibrary)}
            >
              <Text style={styles.photoOptionText}>From device</Text>
            </Pressable>
            <Pressable
              style={styles.photoOptionButton}
              onPress={() => handleImageSelect(launchCamera)}
            >
              <Text style={styles.photoOptionText}>Take photo</Text>
            </Pressable>
            <Pressable
              style={styles.continueButton}
              onPress={() => setShowPhotoModal(false)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalBox}>
            <View style={styles.iconCircle}>
              <Check size={40} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>
              Your daily report has been updated succesfully.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() =>
                navigation.navigate('bottom', { screen: 'dashboard' })
              }
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#14274A',
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginLeft: -24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  date: {
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    color: 'black',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
    marginBottom: 20,
  },
  photoButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },
  roundedOutlineButton: {
    width: 20,
    height: 20,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(46, 46, 46, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4d4d',
    padding: 4,
    borderRadius: 12,
  },
  addImageBtn: {
    backgroundColor: '#14274A',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#14274A',
    paddingVertical: 18,
    marginTop: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardBox: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#1D7903',
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#141b41',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 25,
  },
  modalButton: {
    backgroundColor: '#181446',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Photo Modal
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  photoModalBox: {
    width: 280,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  photoModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 16,
  },

  photoOptionButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(225, 225, 225, 1)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },

  photoOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },

  continueButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    width: '100%',
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  continueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
  },
});
