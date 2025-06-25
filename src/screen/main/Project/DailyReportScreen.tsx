import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  ChevronDown,
  ClipboardList,
  FileText,
  Settings,
  Plus,
  Check,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const weatherOptions = [
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

const DailyReportScreen = () => {
  const [selectedWeather, setSelectedWeather] = useState('');
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [selectedDealy, setSelectedDealy] = useState('');
  const [showDealyDropdown, setShowDealyDropdown] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const navigation = useNavigation();
  const handleFooterPress = (route: any) => {
    // router.push(route);
  };

  const handleWeatherSelect = (weather: string) => {
    setSelectedWeather(weather);
    setShowWeatherDropdown(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Complete Daily Report</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Wednesday 14 Jan Report</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress report</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter Progress for the day..."
            placeholderTextColor="rgba(0, 0, 0, 1)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labour</Text>
          <Pressable style={styles.select}>
            <Text style={styles.selectText}>Select Labour</Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material</Text>
          <Pressable style={styles.select}>
            <Text style={styles.selectText}>Select Material</Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant</Text>
          <Pressable style={styles.select}>
            <Text style={styles.selectText}>Select Plant</Text>
            <ChevronDown color="rgba(0, 0, 0, 1)" size={20} />
          </Pressable>
        </View>

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

        <View style={styles.submitContainer}>
          <Pressable style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Weather Dropdown Modal */}
      <Modal
        visible={showWeatherDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWeatherDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowWeatherDropdown(false)}
          />
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Weather</Text>
            </View>
            <ScrollView
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            >
              {weatherOptions.map((weather, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.dropdownItem,
                    selectedWeather === weather && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleWeatherSelect(weather)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedWeather === weather &&
                        styles.dropdownItemTextSelected,
                    ]}
                  >
                    {weather}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Pressable
            style={[styles.footerTab, styles.footerTabActive]}
            onPress={() => handleFooterPress('/dashboard')}
          >
            <ClipboardList size={20} color="rgba(0, 11, 35, 1)" />
            <Text style={[styles.footerTabText, styles.footerTabTextActive]}>
              Tasks
            </Text>
          </Pressable>

          <Pressable
            style={styles.footerTab}
            onPress={() => handleFooterPress('/past-reports')}
          >
            <FileText size={20} color="rgba(0, 0, 0, 1)" />
            <Text style={styles.footerTabText}>Past Reports</Text>
          </Pressable>

          <Pressable
            style={styles.footerTab}
            onPress={() => handleFooterPress('/settings')}
          >
            <Settings size={20} color="rgba(0, 0, 0, 1)" />
            <Text style={styles.footerTabText}>Settings</Text>
          </Pressable>
        </View>
      </View> */}
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

            <Pressable style={styles.photoOptionButton}>
              <Text style={styles.photoOptionText}>From device</Text>
            </Pressable>

            <Pressable style={styles.photoOptionButton}>
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
    width: 150,
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
});
