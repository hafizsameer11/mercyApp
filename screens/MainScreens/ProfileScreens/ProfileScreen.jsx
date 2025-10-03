import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAvatarKey = (user) => `avatar:${user?.id ?? user?.email ?? 'guest'}`;

const ProfileScreen = () => {
  const navigation = useNavigation();

  const LinkCard = ({ icon, text, bgColor, textColor = '#fff', onPress }) => (
    <TouchableOpacity style={[styles.linkCard, bgColor && { backgroundColor: bgColor }]} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <ThemedText style={[styles.linkText, { color: textColor }]}>{text}</ThemedText>
    </TouchableOpacity>
  );

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'agent' | 'user'
  const [about, setAbout] = useState(null); // null by default
  const [editingAbout, setEditingAbout] = useState(false);
  const [draftAbout, setDraftAbout] = useState('');

  const [localAvatar, setLocalAvatar] = useState(null); // <-- local-only avatar path

  const normalizeRole = (r) => {
    const v = String(r || '').toLowerCase();
    if (['support', 'agent', 'admin'].includes(v)) return 'agent';
    if (['user', 'customer', 'client'].includes(v)) return 'user';
    return 'user';
  };

  const ABOUT_KEY = useMemo(() => `about:${user?.id ?? user?.email ?? 'guest'}`, [user?.id, user?.email]);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(normalizeRole(parsed?.role));

        // Prefer locally saved avatar if exists
        const key = getAvatarKey(parsed);
        const local = await AsyncStorage.getItem(key);
        setLocalAvatar(local || null);
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
    }
  };

  const loadAbout = useCallback(async () => {
    try {
      if (!ABOUT_KEY) return;
      const val = await AsyncStorage.getItem(ABOUT_KEY);
      setAbout(val ?? null);
    } catch (e) {
      console.error('Failed to load about:', e);
    }
  }, [ABOUT_KEY]);

  useEffect(() => {
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // refresh user, local avatar and about when coming back (e.g., after EditProfile)
      loadUser();
      loadAbout();
    }, [loadAbout])
  );

  useEffect(() => {
    // When user changes, reload about
    loadAbout();
  }, [ABOUT_KEY, loadAbout]);

  const startEditAbout = () => {
    setDraftAbout(about ?? '');
    setEditingAbout(true);
  };

  const saveAbout = async () => {
    try {
      const trimmed = draftAbout.trim();
      // allow empty to mean "clear"
      if (trimmed.length === 0) {
        await AsyncStorage.removeItem(ABOUT_KEY);
        setAbout(null);
      } else {
        await AsyncStorage.setItem(ABOUT_KEY, trimmed);
        setAbout(trimmed);
      }
      setEditingAbout(false);
    } catch (e) {
      console.error('Failed to save about:', e);
      Alert.alert('Error', 'Could not save your About text. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      // also clear local avatar for safety (optional)
      if (user) {
        await AsyncStorage.removeItem(getAvatarKey(user));
      }
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      console.error('Error during logout:', err?.message);
    }
  };

  const isAgent = role === 'agent';
  const isUser = role === 'user';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Profile Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Profile</ThemedText>

        {localAvatar ? (
          <Image source={{ uri: localAvatar }} style={styles.avatar} onError={(e)=>console.log('Local avatar failed:', localAvatar, e?.nativeEvent)} />
        ) : user?.profile_picture ? (
          <Image source={{ uri: user.profile_picture }} style={styles.avatar} onError={(e)=>console.log('Remote avatar failed:', user?.profile_picture, e?.nativeEvent)} />
        ) : (
          <Image source={require('../../../assets/Ellipse 18.png')} style={styles.avatar} />
        )}

        <View style={{ width: 370, marginTop: 20 }}>
          <TextInputRow label="Username" value={user?.name || 'N/A'} />
          <TextInputRow label="Email" value={user?.email || 'N/A'} />
          <TextInputRow label="Phone Number" value={user?.phone || 'N/A'} />
        </View>
      </View>

      {/* Profile Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.aboutBox}>
          <View style={styles.aboutHeader}>
            <ThemedText style={styles.aboutLabel}>About Me</ThemedText>

            {editingAbout ? (
              <View style={styles.aboutActions}>
                <TouchableOpacity onPress={() => setEditingAbout(false)} style={styles.iconBtn} accessibilityLabel="Cancel">
                  <Feather name="x" size={18} color="#393b4b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={saveAbout} style={styles.iconBtn} accessibilityLabel="Save">
                  <Feather name="check" size={18} color="#393b4b" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={startEditAbout} style={styles.iconBtn} accessibilityLabel="Edit">
                <Feather name="edit-3" size={18} color="#393b4b" />
              </TouchableOpacity>
            )}
          </View>

          {editingAbout ? (
            <TextInput
              value={draftAbout}
              onChangeText={setDraftAbout}
              placeholder="Write something about yourself…"
              placeholderTextColor="#9aa0a6"
              style={styles.aboutInput}
              multiline
              maxLength={600}
            />
          ) : (
            <ThemedText style={[styles.aboutText, !about && { opacity: 0.6 }]}>
              {about ?? 'No about yet. Tap the edit icon to add one.'}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Quick Links */}
      <ThemedText style={styles.sectionTitle}>Quick links</ThemedText>
      <View style={styles.linksWrapper}>
        {isUser ? (
          <LinkCard
            icon={<Ionicons name="image" size={22} color="#393b4b" />}
            text="My Orders"
            textColor="#393b4b"
            bgColor="#BEC5FB"
            onPress={() => navigation.navigate('Orders')}
          />
        ) : (
          <LinkCard
            icon={<Ionicons name="chatbubbles-outline" size={22} color="#393b4b" />}
            text="Quick Replies"
            textColor="#393b4b"
            bgColor="#C2E7FF"
            onPress={() => navigation.navigate('QuickReply')}
          />
        )}

        <LinkCard
          icon={<Ionicons name="heart-outline" size={22} color="#393b4b" />}
          text="Liked Posts"
          textColor="#393b4b"
          bgColor="#BDE0C9"
          onPress={() => navigation.navigate('LikedFeed')}
        />

        <LinkCard
          onPress={() => navigation.navigate('EditProfile')}
          icon={<MaterialIcons name="person-outline" size={22} color="#393b4b" />}
          text="Edit Profile"
          textColor="#393b4b"
          bgColor="#EFC6C9"
        />
      </View>

      {/* Others */}
      <ThemedText style={styles.sectionTitle}>Others</ThemedText>
      <View style={styles.linksWrapper}>
        {isUser && (
          <LinkCard
            onPress={() => navigation.navigate('FAQ')}
            icon={<AntDesign name="questioncircleo" size={20} color="#000" />}
            text="FAQs"
            textColor="#393b4b"
            bgColor="#Eff6fa"
          />
        )}

        <LinkCard
          onPress={handleLogout}
          icon={<AntDesign name="logout" size={20} color="red" />}
          text="Logout"
          textColor="red"
          bgColor="#Eff6fa"
        />

        <LinkCard
          icon={<Ionicons name="person" size={20} color="red" />}
          text="Delete Account"
          textColor="red"
          bgColor="#Eff6fa"
          onPress={() => navigation.navigate('DeleteAccount')}
        />
      </View>
    </ScrollView>
  );
};

const TextInputRow = ({ label, value }) => (
  <View style={styles.inputRow}>
    <ThemedText style={styles.inputLabel}>{label}</ThemedText>
    <ThemedText style={styles.inputValue}>{value}</ThemedText>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { paddingBottom: 40, backgroundColor: '#Eff6fa' },
  topSection: {
    backgroundColor: '#4A1227',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: { position: 'absolute', top: 50, left: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 10 },
  avatar: { width: 95, height: 95, borderRadius: 50, marginTop: 10 },
  infoContainer: { padding: 20 },
  inputRow: { backgroundColor: '#641C37', borderRadius: 10, padding: 12, marginBottom: 12 },
  inputLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },
  inputValue: { fontSize: 15, color: '#D1BBC3', fontWeight: 'bold' },

  aboutBox: {
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 15,
    top: -40,
    left: 20,
    right: 20,
    padding: 16,
    elevation: 3,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  aboutLabel: { fontWeight: 'bold', fontSize: 16, color: '#393b4b' },
  aboutText: { color: '#393b4b', fontSize: 13, lineHeight: 18 },
  aboutActions: { flexDirection: 'row', gap: 6 },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: '#F1F2F5' },
  aboutInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E9EBEF',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#393b4b',
    textAlignVertical: 'top',
  },

  sectionTitle: { fontWeight: 'bold', fontSize: 15, marginHorizontal: 20, marginTop: 30, marginBottom: 10, color: '#222' },
  linksWrapper: { paddingHorizontal: 20, gap: 10 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  linkText: { marginLeft: 12, fontSize: 15, fontWeight: 'bold' },
});
