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
  Platform,
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
  try {
    if (!dir) {
      throw new Error('Directory path is required');
    }
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  } catch (error) {
    console.error('ensureDir error:', error);
    throw error;
  }
};

const saveImageLocally = async (srcUri, user) => {
  try {
    if (!srcUri || typeof srcUri !== 'string' || srcUri.trim().length === 0) {
      throw new Error('Invalid source URI');
    }
    
    if (!user || (typeof user !== 'object')) {
      throw new Error('Invalid user object');
    }

    // Validate document directory exists
    if (!FileSystem.documentDirectory) {
      throw new Error('File system not available');
    }

  const dir = FileSystem.documentDirectory + 'avatars/';
    
    // Ensure directory exists with error handling
    try {
  await ensureDir(dir);
    } catch (dirError) {
      console.error('Failed to create directory:', dirError);
      throw new Error('Could not create storage directory');
    }
    
  const fileName = `${(user?.id ?? user?.email ?? 'guest')}.jpg`;
  const dest = dir + fileName;
    
    // Verify source file exists before copying
    let sourceInfo;
    try {
      sourceInfo = await FileSystem.getInfoAsync(srcUri);
    } catch (infoError) {
      console.error('Failed to get source file info:', infoError);
      throw new Error('Could not access source image');
    }
    
    if (!sourceInfo || !sourceInfo.exists) {
      throw new Error('Source image file does not exist');
    }
    
    // Copy file to app storage with error handling
    try {
  await FileSystem.copyAsync({ from: srcUri, to: dest });
    } catch (copyError) {
      console.error('File copy error:', copyError);
      throw new Error('Failed to copy image file');
    }
    
    // Verify destination file was created
    let destInfo;
    try {
      destInfo = await FileSystem.getInfoAsync(dest);
    } catch (destInfoError) {
      console.error('Failed to verify destination file:', destInfoError);
      throw new Error('Could not verify saved image');
    }
    
    if (!destInfo || !destInfo.exists) {
      throw new Error('Failed to save image file');
    }
    
    // Save path to AsyncStorage
  const key = getAvatarKey(user);
    try {
  await AsyncStorage.setItem(key, dest);
    } catch (storageError) {
      console.error('Failed to save path to storage:', storageError);
      // Don't throw here - the file is saved, just the path storage failed
    }
    
  return dest;
  } catch (error) {
    console.error('saveImageLocally error:', error);
    throw error;
  }
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
        if (!storedUserRaw) {
          console.warn('No user data found in storage');
          return;
        }

        const storedUser = JSON.parse(storedUserRaw);
        if (!storedUser) {
          console.warn('Failed to parse user data');
          return;
        }

        setUser(storedUser);
        setUsername(storedUser?.name || '');
        setPhone(storedUser?.phone || '');

        try {
        const local = await loadLocalAvatar(storedUser);
        if (local) {
            // Verify local file exists before using it
            const localInfo = await FileSystem.getInfoAsync(local);
            if (localInfo.exists) {
          setPhotoUri(local);
            } else if (storedUser?.profile_picture) {
              setPhotoUri(storedUser.profile_picture);
            }
        } else if (storedUser?.profile_picture) {
          setPhotoUri(storedUser.profile_picture); // fallback to backend URL for preview
          }
        } catch (avatarError) {
          console.error('Error loading avatar:', avatarError);
          // Fallback to profile_picture if local load fails
          if (storedUser?.profile_picture) {
            setPhotoUri(storedUser.profile_picture);
          }
        }
      } catch (e) {
        console.error('Prefill error:', e);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      }
    })();
  }, []);

  const pickPhoto = async () => {
    // Prevent multiple simultaneous calls
    if (savingPhoto) {
      return;
    }

    try {
      // Check if user exists before proceeding
      if (!user) {
        Alert.alert('Error', 'User information not available. Please try again.');
        return;
      }

      // Request permissions with better error handling
      let permissionResult;
      try {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (permError) {
        console.error('Permission request error:', permError);
        Alert.alert('Error', 'Could not request photo library permission. Please check your device settings.');
        return;
      }

      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access in your device settings.');
        return;
      }

      // Configure image picker options
      const pickerOptions = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      };

      // Safely add mediaTypes if available (may not exist in all versions)
      if (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) {
        pickerOptions.mediaTypes = ImagePicker.MediaTypeOptions.Images;
      }

      // Note: Removed presentationStyle as it may not be available in all expo-image-picker versions
      // and can cause crashes on iPad. The default presentation should work fine.

      let result;
      try {
        result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
      } catch (pickerError) {
        console.error('Image picker launch error:', pickerError);
        Alert.alert('Error', 'Could not open photo library. Please try again.');
        return;
      }
      
      if (!result || result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      if (!asset || !asset.uri) {
        console.warn('No valid asset or URI in picker result');
        return;
      }

      // Validate URI before proceeding
      if (typeof asset.uri !== 'string' || asset.uri.trim().length === 0) {
        Alert.alert('Error', 'Invalid image selected. Please try again.');
        return;
      }

      // Save locally right away
      setSavingPhoto(true);
      try {
      const savedPath = await saveImageLocally(asset.uri, user);
        if (savedPath && typeof savedPath === 'string') {
      setPhotoUri(savedPath);
          // Don't show alert on success to avoid blocking UI
        } else {
          throw new Error('Failed to save image path');
        }
      } catch (saveError) {
        console.error('Error saving image locally:', saveError);
        const errorMessage = saveError?.message || 'Could not save the selected image. Please try again.';
        Alert.alert('Error', errorMessage);
      } finally {
      setSavingPhoto(false);
      }
    } catch (e) {
      console.error('pickPhoto error:', e);
      setSavingPhoto(false);
      const errorMessage = e?.message || 'Could not open image picker. Please try again.';
      Alert.alert('Error', errorMessage);
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
        <TouchableOpacity 
          onPress={() => {
            try {
              if (!user) {
                Alert.alert('Error', 'User information not loaded. Please wait a moment and try again.');
                return;
              }
              if (savingPhoto) {
                return; // Prevent multiple taps
              }
              pickPhoto();
            } catch (error) {
              console.error('Error in photo tap handler:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          }} 
          activeOpacity={0.8} 
          style={{ alignSelf: 'center' }}
          disabled={!user || savingPhoto}
        >
          <View style={{ position: 'relative' }}>
            <Image
              source={
                photoUri && typeof photoUri === 'string' && photoUri.trim().length > 0
                  ? { uri: photoUri }
                  : require('../../../assets/Ellipse 18.png')
              }
              style={styles.avatar}
              onError={(e) => {
                console.log('Preview image load failed:', photoUri, e?.nativeEvent);
                // Reset to default if image fails to load
                setPhotoUri(null);
              }}
              defaultSource={require('../../../assets/Ellipse 18.png')}
              resizeMode="cover"
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
