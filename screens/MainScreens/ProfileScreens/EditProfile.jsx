import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ThemedText from '../../../components/ThemedText';
import ChangePassword from './ChangePassword';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://editbymercy.hmstech.xyz';
const EDIT_PROFILE_URL = `${API_BASE}/api/edit-profile`;

// build a per-user key
const getAvatarKey = (user) => `avatar:${user?.id ?? user?.email ?? 'guest'}`;

const ensureDir = async (dir) => {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

const saveImageLocally = async (srcUri, user) => {
  const dir = FileSystem.documentDirectory + 'avatars/';
  await ensureDir(dir);
  const fileName = `${(user?.id ?? user?.email ?? 'guest')}.jpg`;
  const dest = dir + fileName;
  // copy file to app storage so it persists
  await FileSystem.copyAsync({ from: srcUri, to: dest });
  const key = getAvatarKey(user);
  await AsyncStorage.setItem(key, dest);
  return dest;
};

const loadLocalAvatar = async (user) => {
  const key = getAvatarKey(user);
  return await AsyncStorage.getItem(key);
};

const EditProfile = ({ isTabletSplitView = false, onSave }) => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [user, setUser] = useState(null);
  const [photoUri, setPhotoUri] = useState(null); // preview in UI
  const [submitting, setSubmitting] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // Prefill from AsyncStorage & prefer local avatar if exists
  useEffect(() => {
    (async () => {
      try {
        const storedUserRaw = await AsyncStorage.getItem('user');
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
        setUser(storedUser);
        setUsername(storedUser?.name || '');
        setPhone(storedUser?.phone || '');

        const local = await loadLocalAvatar(storedUser);
        if (local) {
          setPhotoUri(local);
        } else if (storedUser?.profile_picture) {
          setPhotoUri(storedUser.profile_picture); // fallback to backend URL for preview
        }
      } catch (e) {
        console.log('Prefill error:', e);
      }
    })();
  }, []);

  const pickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      // Save locally right away
      setSavingPhoto(true);
      const savedPath = await saveImageLocally(asset.uri, user);
      setPhotoUri(savedPath);
      setSavingPhoto(false);
      Alert.alert('Saved', 'Profile photo saved locally.');
    } catch (e) {
      console.log('pickPhoto/save error:', e);
      setSavingPhoto(false);
      Alert.alert('Error', 'Could not save the selected image.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      // Save ONLY name/phone to backend (image is local-only now)
      await axios.post(
        EDIT_PROFILE_URL,
        { name: username, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      // Update stored user (keep existing fields)
      const storedUserRaw = await AsyncStorage.getItem('user');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
      const updatedUser = { ...storedUser, name: username, phone };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      Alert.alert('Success', 'Profile updated successfully');
      if (isTabletSplitView && onSave) {
        onSave();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.log('Edit Profile Error:', error?.response?.data || error?.message);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong while updating your profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // If showing Change Password in split view, render that instead
  if (showChangePassword && isTabletSplitView) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <StatusBar style="dark" />
        <ChangePassword 
          isTabletSplitView={true}
          onBack={() => setShowChangePassword(false)}
          onSuccess={() => setShowChangePassword(false)}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, isTabletSplitView && styles.tabletHeader]}>
        {!isTabletSplitView && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        )}
        <ThemedText style={[styles.title, isTabletSplitView && styles.tabletTitle]}>Edit Profile</ThemedText>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8} style={{ alignSelf: 'center' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={
                photoUri
                  ? { uri: photoUri }
                  : require('../../../assets/Ellipse 18.png')
              }
              style={styles.avatar}
              onError={(e) => console.log('Preview image load failed:', photoUri, e?.nativeEvent)}
            />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
            {savingPhoto && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.changePhotoText}>Tap image to change (saved locally)</ThemedText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Username</ThemedText>
        <TextInput
          style={[styles.input, isTabletSplitView && styles.tabletInput]}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />

        <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Phone number</ThemedText>
        <TextInput
          style={[styles.input, isTabletSplitView && styles.tabletInput]}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone"
        />

        <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Password</ThemedText>
        <TouchableOpacity
          style={[styles.passwordRow, isTabletSplitView && styles.tabletPasswordRow]}
          onPress={() => {
            if (isTabletSplitView) {
              setShowChangePassword(true);
            } else {
              navigation.navigate('ChangePass');
            }
          }}
        >
          <ThemedText style={[styles.passwordText, isTabletSplitView && styles.tabletPasswordText]}>Change Password</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, isTabletSplitView && styles.tabletSaveBtn, submitting && { opacity: 0.7 }]}
        onPress={handleSaveChanges}
        disabled={submitting}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <ThemedText style={[styles.saveText, isTabletSplitView && styles.tabletSaveText]}>Save Changes</ThemedText>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },

  avatarWrap: {
    marginTop: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#0009',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position:'absolute',
    top:0,left:0,right:0,bottom:0,
    backgroundColor:'#0003',
    borderRadius:60,
    alignItems:'center',
    justifyContent:'center',
  },
  changePhotoText: {
    color: '#6C727A',
    fontSize: 12,
    marginTop: 6,
  },

  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 20,
  },
  passwordRow: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordText: {
    fontSize: 15,
    color: '#222',
  },
  saveBtn: {
    backgroundColor: '#992C55',
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Tablet-specific styles with increased font sizes
  tabletHeader: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  tabletTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  tabletLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  tabletInput: {
    padding: 16,
    fontSize: 17,
    marginBottom: 24,
  },
  tabletPasswordRow: {
    padding: 16,
  },
  tabletPasswordText: {
    fontSize: 17,
  },
  tabletSaveBtn: {
    paddingVertical: 16,
    marginTop: 30,
  },
  tabletSaveText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
