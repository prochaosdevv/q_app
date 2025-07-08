import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function DailyReportModal({ visible, onCancel, onConfirm }) {
  const [labour, setLabour] = useState('');
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('');

  const handleOk = () => {
    onConfirm({ labour, description, qty });
    setLabour('');
    setDescription('');
    setQty('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onCancel} />
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Labour</Text>
            <Pressable onPress={onCancel}>
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Labour</Text>
            <TextInput
              placeholder="Enter Labour"
              style={styles.input}
              value={labour}
              onChangeText={setLabour}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Enter Description"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qty</Text>
            <TextInput
              placeholder="Enter Quantity"
              style={styles.input}
              keyboardType="numeric"
              value={qty}
              onChangeText={setQty}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.okButton} onPress={handleOk}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
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
    marginBottom: hp('0.8%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: hp('1.2%'),
  },
  modalTitle: {
    fontSize: wp('4.7%'),
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: hp('1%'),
  },
  label: {
    fontSize: wp('3.7%'),
    fontWeight: '500',
    marginBottom: hp('0.8%'),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.8'),
    fontSize: wp('3.8%'),
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp('1%'),
  },
  okButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('4%'),
  },
});
