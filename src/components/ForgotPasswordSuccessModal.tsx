import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

export default function ForgotPasswordSuccessModal({
  visible,
  onClose,
  onContinue,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalBox}>
          <View style={styles.iconCircle}>
            <Check size={40} color="#fff" />
          </View>
          <Text style={styles.modalTitle}>Success</Text>
          <Text style={styles.modalMessage}>
            New password has been updated.
          </Text>
          <Pressable style={styles.modalButton} onPress={onContinue}>
            <Text style={styles.modalButtonText}>Continue</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
