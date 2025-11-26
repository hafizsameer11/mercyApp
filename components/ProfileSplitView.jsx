import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
import EditProfile from '../screens/MainScreens/ProfileScreens/EditProfile';

const ProfileSplitView = () => {
  const [showEditProfile, setShowEditProfile] = useState(true); // Show Edit Profile by default on tablet

  return (
    <View style={styles.container}>
      {/* Left Panel - Profile */}
      <View style={styles.leftPanel}>
        <ProfileScreen 
          onEditProfilePress={() => setShowEditProfile(true)}
          isTabletSplitView={true}
        />
      </View>

      {/* Right Panel - Edit Profile */}
      <View style={styles.rightPanel}>
        {showEditProfile ? (
          <EditProfile 
            isTabletSplitView={true}
            onSave={() => setShowEditProfile(false)}
          />
        ) : (
          <View style={styles.emptyState}>
            {/* Empty state - Edit Profile not shown */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F7', // Light gray background like Figma
    borderRadius: 20,
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    minWidth: 400,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  rightPanel: {
    flex: 1,
    minWidth: 500,
    backgroundColor: '#F5F5F7',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
});

export default ProfileSplitView;

