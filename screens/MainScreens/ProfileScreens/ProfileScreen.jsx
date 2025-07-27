import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText'; // adjust the path accordingly
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ userRole = 'agent' }) => {
  const navigation = useNavigation();

  const LinkCard = ({ icon, text, bgColor, textColor = '#fff', onPress }) => (
    <TouchableOpacity
      style={[styles.linkCard, bgColor && { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <ThemedText style={[styles.linkText, { color: textColor }]}>{text}</ThemedText>
    </TouchableOpacity>
  );

  const profile = {
    name: 'Maleek',
    email: 'abcdeffh@gmail.com',
    phone: '0703123456789',
    about: 'I am a hairstylist, with a passion for photography and catering.',
    avatar: require('../../../assets/Ellipse 18.png'),
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err);
      }
    };

    loadUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Profile Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Profile</ThemedText>
        {user?.profile_picture ? (
          <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
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
          <ThemedText style={styles.aboutLabel}>About Me</ThemedText>
          <ThemedText style={styles.aboutText}>{profile.about}</ThemedText>
        </View>
      </View>

      {/* Quick Links */}
      <ThemedText style={styles.sectionTitle}>Quick links</ThemedText>
      <View style={styles.linksWrapper}>
        {userRole === 'customer' ? (
          <LinkCard
            icon={<Ionicons name="image" size={22} color="#393b4b" />}
            text="My Orders"
            textColor="#393b4b"
            bgColor="#BEC5FB"
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
        {userRole === 'customer' && (
          <LinkCard
            onPress={() => navigation.navigate('FAQ')}
            icon={<AntDesign name="questioncircleo" size={20} color="#000" />}
            text="FAQs"
            textColor="#393b4b"
            bgColor="#Eff6fa"
          />
        )}
        <LinkCard
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
  container: {
    paddingBottom: 40,
    backgroundColor: '#Eff6fa',
  },
  topSection: {
    backgroundColor: '#4A1227',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
  },
  inputRow: {
    backgroundColor: '#641C37',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,

  },
  inputLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  inputValue: {
    fontSize: 15,
    color: '#D1BBC3',
    fontWeight: 'bold',
  },
  aboutBox: {
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 15,
    top: -40,
    left: 20,
    padding: 16,
    elevation: 3,
    // marginTop: 10,
  },
  aboutLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#393b4b',
  },
  aboutText: {
    color: '#393b4b',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    color: '#222',
  },
  linksWrapper: {
    paddingHorizontal: 20,
    gap: 10,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  linkText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
