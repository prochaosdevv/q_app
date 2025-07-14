import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../utils/api';
import moment from 'moment';
import { ChevronLeft } from 'lucide-react-native';

export default function EditDailyReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params;

  const [progressReport, setProgressReport] = useState(report.progressReport);
  const [plant, setPlant] = useState(report.plant);
  const [delays, setDelays] = useState(report.delays?.toString());

  const handleUpdate = async () => {
    try {
      await api.put(`/project/daily-report/${report._id}`, {
        progressReport,
        plant,
        delays: Number(delays),
      });
      Alert.alert('Success', 'Report updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error updating report:', error);
      Alert.alert('Error', 'Failed to update report');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
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

        <Text style={styles.label}>Progress Report</Text>
        <TextInput
          style={styles.input}
          value={progressReport}
          onChangeText={setProgressReport}
          placeholder="Enter progress"
          multiline
        />

        <Text style={styles.label}>Plant</Text>
        <TextInput
          style={styles.input}
          value={plant}
          onChangeText={setPlant}
          placeholder="Enter plant name"
        />

        <Text style={styles.label}>Delays (in hours)</Text>
        <TextInput
          style={styles.input}
          value={delays}
          onChangeText={setDelays}
          keyboardType="numeric"
          placeholder="Enter delay"
        />

        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
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
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginLeft: -24,
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
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
    // marginHorizontal: 24,
    // marginTop: 24,
    // marginBottom: 24,
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
    paddingVertical: 20,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  disabledBox: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#14274A',
    paddingVertical: 20,
    marginTop: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
