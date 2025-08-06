import React, { useEffect, useState } from 'react';
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
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  X,
  Edit,
  Trash2,
  Check,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  weatherOptions,
  useEditDailyReportForm,
} from '../../../hooks/useEditDailyReportForm';
import api from '../../../utils/api';

export default function EditDailyReportScreen() {
  const {
    progressText,
    setProgressText,

    selectedWeather,
    setShowWeatherDropdown,
    showWeatherDropdown,
    handleWeatherSelect,
    setSelectedWeather,

    selectedDealy,
    setSelectedDealy,

    showPhotoModal,
    setShowPhotoModal,
    openGallery,
    openCamera,
    selectedImages,
    setSelectedImages,
    removeImage,
  } = useEditDailyReportForm();

  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params;

  const reportId = report._id;

  useEffect(() => {
    if (report) {
      // Progress text set
      setProgressText(report.progressReport || '');

      if (Array.isArray(report.labour)) {
        setLabourEntries(report.labour);
      }

      if (Array.isArray(report.material)) {
        setMaterialEntries(report.material);
      }

      if (Array.isArray(report.plant)) {
        setPlantEntries(report.plant);
      }
      if (
        report?.weather?.condition &&
        weatherOptions.includes(report.weather.condition)
      ) {
        setSelectedWeather(report.weather.condition);
      }

      setSelectedDealy(`${report.delays}`);

      if (report?.photos?.length) {
        const formatted = report.photos.map(url => ({ uri: url }));
        setSelectedImages(formatted);
      }
    }
  }, [report]);
  console.log('report.delays:', report.delays);

  const [showLabourModal, setShowLabourModal] = useState(false);
  const [labourEntries, setLabourEntries] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialEntries, setMaterialEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [labour, setLabour] = useState('');
  const [labourRole, setLabourRole] = useState('');
  const [labourHours, setLabourHours] = useState('');
  const [labourQty, setLabourQty] = useState('');
  const [editingLabourIndex, setEditingLabourIndex] = useState(null);

  const [materialType, setMaterialType] = useState('');
  const [materialUnit, setMaterialUnit] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const unitOptions = ['Nr', 'Item', 'm', 'm2', 'm3', 't', 'kg'];

  const handleSelect = unit => {
    setMaterialUnit(unit);
    setShowDropdown(false);
  };
  const [materialQty, setMaterialQty] = useState('');
  const [editingMaterialIndex, setEditingMaterialIndex] = useState(null);

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [plantEntries, setPlantEntries] = useState([]);
  const [plantDescription, setPlantDescription] = useState('');
  const [plantQty, setPlantQty] = useState('');
  const [editingPlantIndex, setEditingPlantIndex] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Delay Option
  const [delayOption, setDelayOption] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    api
      .get('/project/get/all/delay-suggestions')
      .then(res => setSuggestions(res.data.delays))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedDealy) {
      setDelayOption(true); // Yes selected
    } else {
      setDelayOption(false); // No selected
    }
  }, [selectedDealy]);

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
          onPress={() => {
            setShowLabourModal(false);
            setEditingLabourIndex(null);
            setLabour('');
            setLabourRole('');
            setLabourHours('');
            setLabourQty('');
          }}
        />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {' '}
              {editingLabourIndex !== null ? 'Edit Labour' : 'Add Labour'}
            </Text>
            <Pressable
              onPress={() => {
                setShowLabourModal(false);
                setEditingLabourIndex(null);
                setLabour('');
                setLabourRole('');
                setLabourHours('');
                setLabourQty('');
              }}
            >
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
            placeholder="Hours"
            value={labourHours}
            onChangeText={setLabourHours}
            style={styles.input}
            placeholderTextColor="black"
            keyboardType="numeric"
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
              if (!labour || !labourRole || !labourHours || !labourQty) {
                setError('All labour fields are required.');
                return;
              }

              if (editingLabourIndex !== null) {
                const updated = [...labourEntries];
                updated[editingLabourIndex] = {
                  name: labour,
                  role: labourRole,
                  hours: labourHours,
                  qty: labourQty,
                };
                setLabourEntries(updated);
              } else {
                setLabourEntries(prev => [
                  ...prev,
                  {
                    name: labour,
                    role: labourRole,
                    hours: labourHours,
                    qty: labourQty,
                  },
                ]);
              }

              setLabour('');
              setLabourRole('');
              setLabourHours('');
              setLabourQty('');
              setEditingLabourIndex(null);
              setShowLabourModal(false);
            }}
          >
            <Text style={styles.buttonText}>
              {' '}
              {editingLabourIndex !== null ? 'Update' : 'Add'}
            </Text>
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
          onPress={() => {
            setShowMaterialModal(false);
            setEditingMaterialIndex(null);
            setMaterialType('');
            setMaterialQty('');
          }}
        />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {' '}
              {editingMaterialIndex !== null ? 'Edit Material' : 'Add Material'}
            </Text>
            <Pressable
              onPress={() => {
                setShowMaterialModal(false);
                setEditingMaterialIndex(null);
                setMaterialType('');
                setMaterialQty('');
              }}
            >
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
            style={[
              styles.input,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
              },
            ]}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={{ color: 'black' }}>
              {materialUnit || 'Select Unit'}
            </Text>
            <ChevronDown color="black" size={20} />
          </Pressable>
          {showDropdown && (
            <View
              style={{
                backgroundColor: '#fff',
                marginLeft: 'auto',
                marginRight: 1,
                borderRadius: 16,
                marginHorizontal: 24,
                maxHeight: 150,
                width: '50%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
                marginBottom: 20,
                marginTop: -10,
              }}
            >
              <ScrollView nestedScrollEnabled>
                {unitOptions.map((unit, index) => (
                  <Pressable
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(unit)}
                  >
                    <Text style={{ color: 'black' }}>{unit}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          <Pressable
            style={styles.okButton}
            onPress={() => {
              if (!materialType || !materialQty || !materialUnit) {
                setError('All material fields are required.');
                return;
              }

              if (editingMaterialIndex !== null) {
                const updated = [...materialEntries];
                updated[editingMaterialIndex] = {
                  type: materialType,
                  qty: materialQty,
                  unit: materialUnit,
                };
                setMaterialEntries(updated);
              } else {
                setMaterialEntries(prev => [
                  ...prev,
                  { type: materialType, qty: materialQty, unit: materialUnit },
                ]);
              }

              setMaterialType('');
              setMaterialQty('');
              setMaterialUnit('');
              setEditingMaterialIndex(null);
              setShowMaterialModal(false);
            }}
          >
            <Text style={styles.buttonText}>
              {' '}
              {editingMaterialIndex !== null ? 'Update' : 'Add'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const PlantModal = () => (
    <Modal
      visible={showPlantModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPlantModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setShowPlantModal(false);
            setEditingPlantIndex(null);
            setPlantDescription('');
            setPlantQty('');
          }}
        />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingPlantIndex !== null ? 'Edit Plant' : 'Add Plant'}
            </Text>
            <Pressable
              onPress={() => {
                setShowPlantModal(false);
                setEditingPlantIndex(null);
                setPlantDescription('');
                setPlantQty('');
              }}
            >
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <TextInput
            placeholder="Description"
            value={plantDescription}
            onChangeText={setPlantDescription}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Qty"
            value={plantQty}
            onChangeText={setPlantQty}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="black"
          />

          <Pressable
            style={styles.okButton}
            onPress={() => {
              if (!plantDescription || !plantQty) {
                setError('All plant fields are required.');
                return;
              }

              if (editingPlantIndex !== null) {
                const updated = [...plantEntries];
                updated[editingPlantIndex] = {
                  desc: plantDescription,
                  qty: plantQty,
                };
                setPlantEntries(updated);
              } else {
                setPlantEntries(prev => [
                  ...prev,
                  {
                    desc: plantDescription,
                    qty: plantQty,
                  },
                ]);
              }

              setPlantDescription('');
              setPlantQty('');
              setEditingPlantIndex(null);
              setShowPlantModal(false);
            }}
          >
            <Text style={styles.buttonText}>
              {editingPlantIndex !== null ? 'Update' : 'Add'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  // Handle Submit

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // ✅ Validations remain same
    if (!progressText.trim()) {
      setError('Progress report is required.');
      setLoading(false);
      return;
    }
    if (!selectedWeather) {
      setError('Weather selection is required.');
      setLoading(false);
      return;
    }

    if (labourEntries.length === 0) {
      setError('Please add at least one labour entry.');
      setLoading(false);
      return;
    }
    if (materialEntries.length === 0) {
      setError('Please add at least one material entry.');
      setLoading(false);
      return;
    }
    if (selectedImages.length === 0) {
      setError('Please select at least one photo.');
      setLoading(false);
      return;
    }

    // ✅ Construct FormData properly with all fields
    const formData = new FormData();

    formData.append('progressReport', progressText);
    formData.append('weather', JSON.stringify({ condition: selectedWeather }));
    formData.append('delays', selectedDealy);

    formData.append(
      'labour',
      JSON.stringify(
        labourEntries.map(item => ({
          name: item.name,
          role: item.role,
          hours: item.hours,
          qty: parseInt(item.qty),
        })),
      ),
    );

    formData.append(
      'material',
      JSON.stringify(
        materialEntries.map(item => ({
          type: item.type,
          unit: item.unit,
          qty: parseInt(item.qty),
        })),
      ),
    );

    formData.append(
      'plant',
      JSON.stringify(
        plantEntries.map(item => ({
          desc: item.desc,
          qty: parseInt(item.qty),
        })),
      ),
    );

    // ✅ Always attach images correctly
    selectedImages.forEach((img, index) => {
      formData.append('photos', {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.fileName || `photo_${index}.jpg`,
      });
    });

    try {
      const res = await api.put(
        `/project/daily-report/update/${reportId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      // ✅ On success, show success modal
      setShowSuccessModal(true);
    } catch (err) {
      console.log(
        'Submission Error:',
        err.response?.data || err.message || err,
      );
      setError(
        err?.response?.data?.message ||
          'Failed to submit. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Edit Daily Report</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{moment().format('dddd DD MMMM YYYY')}</Text>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress report</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter Progress for the day..."
            placeholderTextColor="rgba(0, 0, 0, 1)"
            value={progressText}
            onChangeText={text => {
              setProgressText(text);
              setError('');
            }}
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

          <TextInput
            style={{
              backgroundColor: 'rgba(247, 248, 254, 1)',
              borderRadius: 28,
              padding: 16,
              minHeight: 90,
              fontFamily: 'Inter-Regular',
              fontSize: 14,
              color: 'rgba(0, 0, 0, 1)',
              borderWidth: 1,
              borderColor: 'rgba(232, 233, 234, 1)',
            }}
            placeholder="Enter delay..."
            placeholderTextColor="rgba(0, 0, 0, 1)"
            value={selectedDealy}
            onChangeText={text => {
              setSelectedDealy(text);
            }}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        
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
          <View
            key={index}
            style={[
              styles.itemCard,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <View>
              <Text style={styles.itemCartText}>
                {item.name} | {item.role} | {item.hours} | {item.qty}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => {
                  setLabour(item.name);
                  setLabourRole(item.role);
                  setLabourHours(item.hours?.toString() || '');
                  setLabourQty(item.qty.toString());
                  setEditingLabourIndex(index);
                  setShowLabourModal(true);
                }}
              >
                <Edit color="black" size={20} />
              </Pressable>
              <Pressable
                onPress={() => {
                  const updated = labourEntries.filter((_, i) => i !== index);
                  setLabourEntries(updated);
                }}
              >
                <Trash2 color="red" size={20} />
              </Pressable>
            </View>
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
          <View
            key={index}
            style={[
              styles.itemCard,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <View>
              <Text style={styles.itemCartText}>
                {item.type} | {item.qty} | {item.unit}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={() => {
                  setMaterialType(item.type);
                  setMaterialQty(item.qty.toString());
                  setMaterialUnit(item.unit);
                  setEditingMaterialIndex(index);
                  setShowMaterialModal(true);
                }}
              >
                <Edit color="black" size={22} />
              </Pressable>
              <Pressable
                onPress={() => {
                  const updated = materialEntries.filter((_, i) => i !== index);
                  setMaterialEntries(updated);
                }}
              >
                <Trash2 color="red" size={22} />
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant</Text>
          <Pressable style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Add Plant</Text>
            <Pressable
              style={styles.roundedOutlineButton}
              onPress={() => setShowPlantModal(true)}
            >
              <Plus color="rgba(0, 0, 0, 1)" size={18} />
            </Pressable>
          </Pressable>
        </View>

        {plantEntries.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemCard,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <View>
              <Text style={styles.itemCartText}>
                {item.desc} | {item.qty}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => {
                  setPlantDescription(item.desc);
                  setPlantQty(item.qty.toString());
                  setEditingPlantIndex(index);
                  setShowPlantModal(true);
                }}
              >
                <Edit color="black" size={20} />
              </Pressable>
              <Pressable
                onPress={() => {
                  const updated = plantEntries.filter((_, i) => i !== index);
                  setPlantEntries(updated);
                }}
              >
                <Trash2 color="red" size={20} />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Pressable style={styles.photoButton}>
            <Text style={styles.photoButtonText}>Add photos</Text>
            <Pressable
              style={styles.roundedOutlineButton}
              onPress={() => setShowPhotoModal(true)}
            >
              <Plus color="rgba(0, 0, 0, 1)" size={18} />
            </Pressable>
          </Pressable>
        </View>
        {/* Photo Upload Preview */}
        {selectedImages.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12,
            }}
          >
            {selectedImages.map((img, index) => (
              <View key={index} style={{ position: 'relative' }}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: 60, height: 60, borderRadius: 10 }}
                />
                <Pressable
                  onPress={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    backgroundColor: 'red',
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <X size={14} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

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
            <View
              style={{
                backgroundColor: '#1D7903',
                borderRadius: 50,
                padding: 12,
                marginBottom: 16,
                width: '20%',
                alignSelf: 'center',
              }}
            >
              <Check size={40} color="#fff" />
            </View>
            <Text
              style={{
                fontSize: wp('4.5%'),
                fontWeight: '800',
                textAlign: 'center',
              }}
            >
              Success
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 20,
                color: '#000',
                textAlign: 'center',
                fontWeight: '400',
                lineHeight: 25,
              }}
            >
              Your daily report has been updated {'\n'} succesfully.
            </Text>
            <Pressable
              style={{
                backgroundColor: '#181446',
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 35,
                width: '80%',
                alignSelf: 'center',
              }}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('bottom', { screen: 'dashboard' });
              }}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modals */}
      {LabourModal()}
      {MaterialModal()}
      {PlantModal()}

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
    fontWeight: '700',
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

  // Radio Section
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(24, 20, 70, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selected: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
  },
  radioText: {
    fontSize: 12,
    color: 'rgba(132, 132, 132, 1)',
  },
});
