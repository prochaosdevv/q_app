import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, ChevronDown, Plus, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useDailyReport,
  weatherOptions,
  delayOptions,
  plantOptions,
} from '../../../hooks/useDailyReport';
import api from '../../../utils/api';

const DailyReportScreen = () => {
  const {
    progressText,
    setProgressText,

    selectedWeather,
    setShowWeatherDropdown,
    showWeatherDropdown,
    handleWeatherSelect,

    selectedDealy,
    showDealyDropdown,
    setShowDealyDropdown,
    handleDelaySelect,

    selectedPlant,
    showPlantDropdown,
    setShowPlantDropdown,
    handlePlantSelect,

    showPhotoModal,
    setShowPhotoModal,
    openGallery,
    openCamera,
    selectedImage,
  } = useDailyReport();

  const navigation = useNavigation();
  const { id } = useRoute().params;

  const [showLabourModal, setShowLabourModal] = useState(false);
  const [labourEntries, setLabourEntries] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialEntries, setMaterialEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [labour, setLabour] = useState('');
  const [labourRole, setLabourRole] = useState('');
  const [labourQty, setLabourQty] = useState('');

  const [materialType, setMaterialType] = useState('');
  const [materialQty, setMaterialQty] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (
      !progressText ||
      !selectedWeather ||
      !selectedDealy ||
      !selectedPlant ||
      !selectedImage ||
      labourEntries.length === 0 ||
      materialEntries.length === 0
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('projectId', id);
    formData.append('progressReport', progressText);
    formData.append('weather', JSON.stringify({ condition: selectedWeather }));
    formData.append('delays', parseInt(selectedDealy));
    formData.append('plant', selectedPlant);

    formData.append(
      'labour',
      JSON.stringify(
        labourEntries.map(item => ({
          name: item.name,
          role: item.role,
          qty: parseInt(item.qty),
        })),
      ),
    );

    formData.append(
      'material',
      JSON.stringify(
        materialEntries.map(item => ({
          type: item.type,
          quantity: item.quantity, // keep as string (e.g., "20 bags")
        })),
      ),
    );

    formData.append('photos', {
      uri: selectedImage.uri,
      name: 'report.jpg',
      type: 'image/jpeg',
    });

    console.log('Data ', formData);

    try {
      const res = await api.post('/project/daily-report/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      navigation.navigate('bottom', {
        screen: 'dashboard',
        params: { id },
      });
    } catch (err) {
      console.log('Error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  };

  const renderDropdownModal = (
    visible,
    setVisible,
    options,
    selected,
    onSelect,
    title,
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setVisible(false)}
        />
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>{title}</Text>
          </View>
          <ScrollView style={styles.dropdownList}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dropdownItem,
                  selected === option && styles.dropdownItemSelected,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => onSelect(option)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selected === option && styles.dropdownItemTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const LabourModal = () => (
    <Modal
      visible={showLabourModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLabourModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowLabourModal(false)}
        />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Labour</Text>
            <Pressable onPress={() => setShowLabourModal(false)}>
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <TextInput
            placeholder="Labour Name"
            value={labour}
            onChangeText={setLabour}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Role"
            value={labourRole}
            onChangeText={setLabourRole}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Qty"
            value={labourQty}
            onChangeText={setLabourQty}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="black"
          />
          <Pressable
            style={styles.okButton}
            onPress={() => {
              setLabourEntries(prev => [
                ...prev,
                { name: labour, role: labourRole, qty: labourQty },
              ]);
              setLabour('');
              setLabourRole('');
              setLabourQty('');
              setShowLabourModal(false);
            }}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const MaterialModal = () => (
    <Modal
      visible={showMaterialModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMaterialModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowMaterialModal(false)}
        />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Material</Text>
            <Pressable onPress={() => setShowMaterialModal(false)}>
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <TextInput
            placeholder="Material Type"
            value={materialType}
            onChangeText={setMaterialType}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Qty"
            value={materialQty}
            onChangeText={setMaterialQty}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="black"
          />
          <Pressable
            style={styles.okButton}
            onPress={() => {
              setMaterialEntries(prev => [
                ...prev,
                { type: materialType, quantity: materialQty },
              ]);
              setMaterialType('');
              setMaterialQty('');
              setShowMaterialModal(false);
            }}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Complete Daily Report</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {moment().format('dddd DD MMMM')} Report
        </Text>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress report</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter Progress for the day..."
            placeholderTextColor="rgba(0, 0, 0, 1)"
            value={progressText}
            onChangeText={setProgressText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Weather Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather</Text>
          <Pressable
            style={styles.select}
            onPress={() => setShowWeatherDropdown(true)}
          >
            <Text
              style={[
                styles.selectText,
                selectedWeather && styles.selectTextSelected,
              ]}
            >
              {selectedWeather || 'Select weather'}
            </Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

        {/* Delay Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delays</Text>
          <Pressable
            style={styles.select}
            onPress={() => setShowDealyDropdown(true)}
          >
            <Text
              style={[
                styles.selectText,
                selectedDealy && styles.selectTextSelected,
              ]}
            >
              {selectedDealy || '0 hours'}
            </Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

        {/* Labour Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labour</Text>
          <Pressable style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Add Labour</Text>
            <Pressable
              style={styles.roundedOutlineButton}
              onPress={() => setShowLabourModal(true)}
            >
              <Plus color="rgba(0, 0, 0, 1)" size={18} />
            </Pressable>
          </Pressable>
        </View>
        {labourEntries.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.itemCartText}>
              {item.name} | {item.role}
            </Text>
            <Text style={styles.itemCartText}>{item.qty}</Text>
          </View>
        ))}

        {/* Material Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material</Text>
          <Pressable style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Add Material</Text>
            <Pressable
              style={styles.roundedOutlineButton}
              onPress={() => setShowMaterialModal(true)}
            >
              <Plus color="rgba(0, 0, 0, 1)" size={18} />
            </Pressable>
          </Pressable>
        </View>

        {materialEntries.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.itemCartText}>{item.type}</Text>
            <Text style={styles.itemCartText}>{item.quantity}</Text>
          </View>
        ))}

        {/* Plant Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant</Text>
          <Pressable
            style={styles.select}
            onPress={() => setShowPlantDropdown(true)}
          >
            <Text
              style={[
                styles.selectText,
                selectedPlant && styles.selectTextSelected,
              ]}
            >
              {selectedPlant || 'Select Plant'}
            </Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable style={styles.photoButton}>
              <Text style={styles.photoButtonText}>Add photos</Text>
              <Pressable
                style={styles.roundedOutlineButton}
                onPress={() => setShowPhotoModal(true)}
              >
                <Plus color="rgba(0, 0, 0, 1)" size={18} />
              </Pressable>
            </Pressable>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'rgb(217, 217, 217)',
                }}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

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
            <Pressable style={styles.photoOptionButton} onPress={openGallery}>
              <Text style={styles.photoOptionText}>From device</Text>
            </Pressable>
            <Pressable style={styles.photoOptionButton} onPress={openCamera}>
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

      {/* Modals */}
      {LabourModal()}
      {MaterialModal()}

      {/* Render Dropdown Modals */}
      {[
        {
          visible: showWeatherDropdown,
          setVisible: setShowWeatherDropdown,
          options: weatherOptions,
          selected: selectedWeather,
          onSelect: handleWeatherSelect,
          title: 'Select Weather',
        },
        {
          visible: showDealyDropdown,
          setVisible: setShowDealyDropdown,
          options: delayOptions,
          selected: selectedDealy,
          onSelect: handleDelaySelect,
          title: 'Select Delay',
        },
        {
          visible: showPlantDropdown,
          setVisible: setShowPlantDropdown,
          options: plantOptions,
          selected: selectedPlant,
          onSelect: handlePlantSelect,
          title: 'Select Plant',
        },
      ].map((item, index) =>
        renderDropdownModal(
          item.visible,
          item.setVisible,
          item.options,
          item.selected,
          item.onSelect,
          item.title,
        ),
      )}
    </View>
  );
};

export default DailyReportScreen;

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
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    // width: 40,
    // height: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginRight: 8,
    // borderRadius: 20,
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
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

  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(37, 36, 36, 1)',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(132, 132, 132, 1)',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: 28,
    padding: 16,
    minHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 28,
    padding: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  selectText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },
  selectTextSelected: {
    color: 'rgba(0, 11, 35, 1)',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 28,
    padding: 16,
    height: 56,
    width: wp('70%'),
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  photoButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },
  submitContainer: {
    marginTop: 8,
    marginBottom: 100,
  },
  submitButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerContent: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerTab: {
    alignItems: 'center',
  },
  footerTabActive: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(0, 11, 35, 1)',
    paddingTop: 10,
  },
  footerTabText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 1)',
    marginTop: 4,
  },
  footerTabTextActive: {
    color: 'rgba(0, 11, 35, 1)',
    fontFamily: 'Inter-Medium',
  },
  // Modal and Dropdown Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 24,
    maxHeight: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'rgba(0, 11, 35, 1)',
    textAlign: 'center',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  dropdownItemSelected: {
    backgroundColor: '#f7f9fc',
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    fontFamily: 'Inter-Medium',
    color: 'rgba(0, 11, 35, 1)',
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

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 28,
    padding: 16,
    height: 56,
    width: wp('87%'),
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  cardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: wp('3.8%'),
    color: '#444',
  },
  cardQty: {
    fontSize: wp('3.7%'),
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBox: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('6%'),
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp('1.8%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.8'),
    fontSize: wp('3.8%'),
    color: 'black',
    marginBottom: hp('2%'),
  },
  okButton: {
    paddingVertical: hp('1.9%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 28,
    padding: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
    marginBottom: hp('2%'),
  },
  itemCartText: {
    color: 'black',
  },
});
