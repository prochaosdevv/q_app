import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';
import { CalendarDays, Pencil, Settings } from 'lucide-react-native';
import { useProjectStore } from '../zustand/store/projectStore';
import { useAuthStore } from '../zustand/store/authStore';
export default function WeeklyGoal({ refreshing }) {
  const [weeklyGoal, setWeeklyGoal] = useState();
  const [activePopupId, setActivePopupId] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);
  

  const { user } = useAuthStore.getState();

  const createdById = useProjectStore(state => state.createdBy);
  const currentuser = user?._id || user?.id;

  const getWeeklyGoal = async () => {
    try {
      const response = await api.get(`/project/weekly/goal/by/${projectId}`);
      const data = response.data.weeklyGoals;
      setWeeklyGoal(data);
    } catch (error) {
      console.log('Error fetching to weekly report : ', error);
    }
  };
  const handleDelete = async id => {
    try {
      await api.delete(`/project/weekly-goal/${id}`);
      setShowDeleteConfirmModal(false);
      setActivePopupId(null);
      getWeeklyGoal();
    } catch (error) {
      console.log('Error deleting weekly goal:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      getWeeklyGoal(projectId);
    }
  }, [projectId, refreshing]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.dateContainer}>
        <View style={{ flexDirection: 'row' }}>
          <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
          <Text style={styles.dateText}>
            {' '}
            {moment(item.startDate).format('DD MMM YYYY')}
          </Text>
        </View>
        <Pressable
          style={[
            styles.edit,
            createdById !== currentuser && { opacity: 0.5 }, // fade if not owner
          ]}
          onPress={() => {
            if (createdById === currentuser) {
              setActivePopupId(activePopupId === item._id ? null : item._id);
            }
          }}
        >
          <Settings
            size={16}
            color={createdById !== currentuser ? 'gray' : 'black'}
          />
        </Pressable>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Pressable
        onPress={() => navigation.navigate('week-view', { id: item._id })}
      >
        <Text style={styles.viewText}>View</Text>
      </Pressable>

      {activePopupId === item._id && (
        <View style={styles.popupMenu}>
          <Pressable
            style={styles.popupItem}
            onPress={() => {
              navigation.navigate('update-weekly-report-by-id', {
                title: item.title,
                description: item.description,
                startDate: item.startDate,
                endDate: item.endDate,
                id: item._id,
              });
              setActivePopupId(null);
            }}
          >
            <Text style={styles.popupTextBold}>Edit</Text>
          </Pressable>

          <Pressable
            style={styles.popupItem}
            onPress={() => {
              setShowDeleteConfirmModal(true);
              setActivePopupId(item._id);
            }}
          >
            <Text style={styles.popupTextBold}>Delete</Text>
          </Pressable>

          <Pressable
            onPress={() => setActivePopupId(null)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={showDeleteConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowDeleteConfirmModal(false)}
          />
          <View style={styles.deleteModalBox}>
            <Text style={styles.deleteTitle}>
              Are you sure you want to delete?
            </Text>
            <Text style={styles.deleteMessage}>
              This week goal will be lost. You will not be able to undo.
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(activePopupId)}
            >
              <Text style={styles.deleteButtonText}>Okay</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton_}
              onPress={() => {
                setShowDeleteConfirmModal(false);
                setActivePopupId(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={weeklyGoal}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            No weekly goals found.
          </Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 3,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    fontWeight: '900',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    marginBottom: 12,
  },
  viewText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#141b41',
    fontWeight: '800',
  },
  edit: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
    display: 'flex',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Pop up modal

  popupMenu: {
    position: 'absolute',
    right: 10,
    top: 50,
    bottom: -4,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 1,
    paddingHorizontal: 8,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupIcon: {
    marginRight: 12,
  },
  popupTextBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cancelText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },

  // Delete Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  deleteModalBox: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  deleteTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1447',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cancelButton_: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1447',
    width: '80%',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1a1447',
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
});
