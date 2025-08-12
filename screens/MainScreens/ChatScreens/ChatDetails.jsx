import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API, { BASE_URL } from '../../../config/api.config';
import ThemedText from '../../../components/ThemedText';

export default function ChatDetails({ route, navigation }) {
  // Params expected:
  // chat_id (required), service_type (required by backend), show ('agent' | 'user') optional
  // myRole/service are optional fallbacks
  const { chat_id, service_type, show, myRole, service } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [counterparty, setCounterparty] = useState(null);

  // e.g. https://editbymercy.hmstech.xyz
  const APP_BASE = BASE_URL.replace(/\/api\/?$/i, '');

  // Resolve "service_type" required by the API
  const resolveServiceType = () => {
    if (typeof service_type === 'string' && service_type.trim()) return service_type.trim();
    if (typeof service === 'string' && service.trim()) return service.trim();
    if (service && typeof service === 'object') {
      if (typeof service.service_type === 'string' && service.service_type.trim()) return service.service_type.trim();
      if (typeof service.type === 'string' && service.type.trim()) return service.type.trim();
      if (typeof service.name === 'string' && service.name.trim()) return service.name.trim();
      if (typeof service.slug === 'string' && service.slug.trim()) return service.slug.trim();
      if (typeof service.title === 'string' && service.title.trim()) return service.title.trim();
    }
    return 'Photo Editing';
  };

  // Decide which party to show
  const resolveShowTarget = async () => {
    if (show === 'agent' || show === 'user') return show;
    const storedUserStr = await AsyncStorage.getItem('user');
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
    const role = (myRole || storedUser?.role || 'user').toString().toLowerCase();
    return role === 'user' ? 'agent' : 'user';
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }

        const target = await resolveShowTarget();
        const serviceTypeValue = resolveServiceType();

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

        // API requires POST and "service_type"
        const res = await axios.post(
          API.ASSIGN_AGENT,
          { chat_id, service_type: serviceTypeValue },
          { headers, timeout: 15000 }
        );

        const raw = res?.data ?? {};
        const data = raw?.data ?? raw;

        // payload contains: agent, user, order, ...
        const agent = data?.agent ?? null;
        const user = data?.user ?? null;

        // Pick based on target
        const showObj = (target === 'agent' ? agent : user) || {};

        // Normalize profile picture to absolute URL
        const pic = showObj?.profile_picture;
        const normalizedPic =
          pic && /^https?:\/\//i.test(pic)
            ? pic
            : pic
            ? `${APP_BASE}/${String(pic).replace(/^\/+/, '')}`
            : null;

        const mapped = {
          id: showObj?.id ?? null,
          name: showObj?.name || (target === 'agent' ? 'Agent' : 'Customer'),
          roleLabel: target === 'agent' ? 'Customer representative' : 'Customer',
          profile_picture: normalizedPic,
        };

        if (!mounted) return;
        setCounterparty(mapped);
      } catch (e) {
        // Silent fail into placeholders; you can add a toast if you like
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [chat_id, service_type, show, myRole, service]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#992C55" />
      </View>
    );
  }

  const avatarSrc = counterparty?.profile_picture
    ? { uri: counterparty.profile_picture }
    : require('../../../assets/Ellipse 18.png');

  // Dummy media placeholders (replace with real image URLs when your API provides them)
  const mediaItems = new Array(4).fill(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 26 }}>
      {/* Curved header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Image source={avatarSrc} style={styles.avatar} />
          <ThemedText style={styles.nameText}>
            {counterparty?.name || '—'}
          </ThemedText>
          <ThemedText style={styles.roleText}>
            {counterparty?.roleLabel || ''}
          </ThemedText>
        </View>

        {/* white curve tabs effect */}
        <View style={styles.curveTabs} />
      </View>

      {/* About Us card */}
      <View style={styles.cardWrap}>
        <ThemedText style={styles.cardTitle}>About Us</ThemedText>
        <ThemedText style={styles.cardBody}>
          Edits by Mercy is a leading photo editing agency for all your photo edits , ranging from Editing,
          manipulation , body reshaping and many more
        </ThemedText>
      </View>

      {/* Social Links card */}
      <View style={styles.cardWrap}>
        <ThemedText style={styles.cardTitle}>Social Links</ThemedText>

        <View style={styles.socialRow}>
          <View style={styles.socialPill}><Ionicons name="logo-instagram" size={20} color="#C13584" /></View>
          <View style={styles.socialPill}><Ionicons name="logo-whatsapp" size={20} color="#25D366" /></View>
          <View style={styles.socialPill}><Ionicons name="logo-youtube" size={20} color="#FF0000" /></View>
          <View style={styles.socialPill}><Ionicons name="logo-facebook" size={20} color="#1877F2" /></View>
          <View style={styles.socialPill}><Ionicons name="logo-twitter" size={20} color="#000" /></View>
        </View>
      </View>

      {/* Media label row */}
      <View style={styles.mediaHeaderRow}>
        <ThemedText style={styles.mediaTitle}>Media</ThemedText>
        <ThemedText style={styles.mediaCount}>10</ThemedText>
      </View>

      {/* Media grid (placeholders) */}
      <FlatList
        data={mediaItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={() => (
          <View style={styles.mediaThumb} />
        )}
      />

      {/* Danger actions */}
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <TouchableOpacity style={styles.dangerRow}>
          <Ionicons name="warning-outline" size={18} color="#D62C2C" />
          <ThemedText style={styles.dangerText}>Report</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerRow}>
          <Ionicons name="trash-outline" size={18} color="#D62C2C" />
          <ThemedText style={styles.dangerText}>Delete Chat</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  headerWrap: {
    backgroundColor: '#992C55',
    paddingTop: 56,
    paddingBottom: 100,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center' },
  headerCenter: { alignItems: 'center', marginTop: 10 },
  avatar: { width: 95, height: 95, borderRadius: 55 },
  nameText: { color: '#fff', fontSize: 20, fontWeight: '400', marginTop: 10 },
  roleText: { color: '#f3dbe6', fontSize: 12, marginTop: 4 },

  curveTabs: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 10,
  },

  cardWrap: {
    marginHorizontal: 12,
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
    marginTop:-40,
    marginBottom:60
  },
  cardTitle: { fontWeight: '700', marginBottom: 8, color: '#000000B2' },
  cardBody: { color: '#555', lineHeight: 20},

  socialRow: { flexDirection: 'row', gap: 12, marginTop: 10},
  socialPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },

  mediaHeaderRow: {
    marginTop: -25,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mediaTitle: { fontWeight: '700', color: '#000000B2', marginLeft:10, marginBottom:10 },
  mediaCount: { color: '#555', marginRight:4, marginBottom:10 },

  mediaThumb: {
    width: 84,
    height: 84,
    borderRadius: 8,
    backgroundColor: '#E8E8ED',
    marginRight: 10,
  },

  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  dangerText: { color: '#D62C2C', fontWeight: '600', fontSize:15 },
});
