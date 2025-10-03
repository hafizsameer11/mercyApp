import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';

const faqData = [
  {
    id: 1,
    title: 'Introductory Video',
    videoUrl: 'https://www.youtube.com/watch?v=RO3lLV9SXzg',
    description:
      'Watch this video to learn how to use the mobile app to order for all your photo services.',
  },
  {
    id: 2,
    title: 'How to start a chat ?',
    description: 'Tap on the agent name in the order details and start typing your message.',
  },
  {
    id: 3,
    title: 'How to make payment',
    description: 'Navigate to the “Payment” tab and follow the steps to confirm your order.',
  },
];

/** ---------- helpers (no UI/style change) ---------- */
// Convert normal watch URL to embed URL
const toYouTubeEmbed = (url) => {
  const m = url?.match(/[?&]v=([^&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

// Full-bleed responsive iframe (fills the 200px container you already have)
const embedHtml = (src) => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>
  html, body { margin:0; padding:0; background:#000; height:100%; }
  .wrap { position:relative; width:100%; height:100%; }
  .inner { position:absolute; inset:0; }
  iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="inner">
      <iframe
        src="${src}"
        title="YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</body>
</html>`;

/** --------------------------------------------------- */

const FaqScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const renderItem = ({ item, index }) => {
    const isExpanded = index === expandedIndex;

    return (
      <View style={styles.card}>
        <StatusBar style="dark" />
        <View style={styles.row}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <TouchableOpacity style={{ borderWidth: 1 }} onPress={() => toggleExpand(index)}>
            <Ionicons name={isExpanded ? 'remove' : 'add'} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <>
            {item.videoUrl ? (
              <View style={styles.videoContainer}>
                <WebView
                  originWhitelist={['*']}
                  javaScriptEnabled
                  domStorageEnabled
                  allowsFullscreenVideo
                  automaticallyAdjustContentInsets={false}
                  scrollEnabled={false}
                  source={{ html: embedHtml(toYouTubeEmbed(item.videoUrl)) }}
                />
              </View>
            ) : null}
            <ThemedText style={styles.description}>{item.description}</ThemedText>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>FAQs</ThemedText>
      </View>

      <FlatList
        data={faqData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F7',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 135,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  videoContainer: {
    height: 200,
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
  },
});
