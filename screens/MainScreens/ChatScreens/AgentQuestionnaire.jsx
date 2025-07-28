import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, { BASE_URL } from '../../../config/api.config';

const questionnaireData = [
  {
    title: 'Face',
    icon: 'happy-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      {
        type: 'select',
        options: ['Little/natural Makeup', 'Excess Makeup', 'No Makeup'],
        stateKey: 'selectedFace',
      },
    ],
  },
  {
    title: 'Skin',
    icon: 'color-palette-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      {
        type: 'toggle',
        label: 'Maintain skin tone',
        stateKey: 'maintainSkinTone',
      },
      {
        type: 'radioGroup',
        label: 'Lighter',
        options: ['A little', 'Very light', 'Extremely light'],
        stateKey: 'selectedLighter',
      },
      {
        type: 'radioGroup',
        label: 'Darker',
        options: ['A little', 'Very Dark', 'Extremely Dark'],
        stateKey: 'selectedDarker',
      },
    ],
  },
  {
    title: 'Change in any body size',
    icon: 'body-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      { type: 'textarea', label: 'Eyes', stateKey: 'eyes' },
      { type: 'textarea', label: 'Lips', stateKey: 'lips' },
      {
        type: 'radioGroup',
        label: 'Hips',
        options: ['Wide', 'Very Wide', 'Extremely Wide'],
        stateKey: 'selectedHips',
      },
      {
        type: 'radioGroup',
        label: 'Butt',
        options: ['Big', 'Very Big', 'Extremely Wide'],
        stateKey: 'selectedButt',
      },
      { type: 'textarea', label: 'Height', stateKey: 'height' },
      { type: 'textarea', label: 'Nose', stateKey: 'nose' },
      {
        type: 'radioGroup',
        label: 'Tummy',
        options: ['Small', 'Very Small', 'Extremely Small'],
        stateKey: 'selectedTummy',
      },
      { type: 'textarea', label: 'Chin', stateKey: 'chin' },
      { type: 'textarea', label: 'Arm', stateKey: 'arm' },
      { type: 'textarea', label: 'Other Requirements', stateKey: 'other' },
    ],
  },
];

const AgentQuestionnaire = ({ navigation, route }) => {
  const { chat_id, user_id } = route.params;
  const [state, setState] = useState({});
  const [alredyAssigned, setAlreadyAssigned] = useState(false);
  const [user, setUser] = useState({});
  const [focusedInput, setFocusedInput] = useState('');

  // ✅ Fetch user role and pre-filled answers
  useEffect(() => {
    const fetchDetails = async () => {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      console.log("user role", JSON.parse(userData).role, "chat id", chat_id);
      try {
        const res = await axios.get(`${BASE_URL}/questionnaire/answers/${chat_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        console.log("questionnaire response", res.data)
        if (res.data.status === 'success') {
          setAlreadyAssigned(true);
          setState(res.data.data || {});
        }
      } catch (error) {
        console.log('No questionnaire answers found.', error);
      }
    };

    fetchDetails();
  }, []);

  const handleAssignQuestionnaire = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        API.ASSIGN_QUESTIONNAIRE,
        { chat_id, user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        alert('✅ Questionnaire assigned successfully!');
        navigation.goBack();
      } else {
        alert('Failed to assign questionnaire.');
      }
    } catch (error) {
      console.error('Assign error:', error.message);
      alert('🚫 Failed to assign questionnaire.');
    }
  };

  const handleInputChange = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Questionnaire</ThemedText>
      </View>

      {user?.role === 'agent' && (
        <ThemedText style={{ textAlign: 'center', color: 'red', marginVertical: 10 }}>
          Viewing User's Filled Questionnaire
        </ThemedText>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {questionnaireData.map((category, catIdx) => (
          <View key={catIdx} style={styles.category}>
            <View style={[styles.categoryHeader, { backgroundColor: category.color }]}>
              <View style={styles.circleNumber}>
                <ThemedText style={styles.circleNumberText}>{catIdx + 1}</ThemedText>
              </View>
              <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
            </View>
            <ThemedText style={styles.subtext}>{category.description}</ThemedText>
            <View style={styles.box}>
              {category.questions.map((q, index) => (
                <View key={index} style={q.type !== 'select' ? styles.groupBox : null}>
                  {q.label && <ThemedText style={styles.sectionSubtitle}>{q.label}</ThemedText>}

                  {q.type === 'select' &&
                    q.options.map((option, i) => (
                      <TouchableOpacity
                        key={i}
                        disabled={user?.role === 'agent'}
                        style={[
                          styles.selectableOption,
                          state[q.stateKey] === option && styles.selectedOption,
                        ]}
                        onPress={() => handleInputChange(q.stateKey, option)}
                      >
                        <ThemedText
                          style={[
                            styles.optionText,
                            state[q.stateKey] === option && { color: '#fff' },
                          ]}
                        >
                          {option}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}

                  {q.type === 'toggle' && (
                    <TouchableOpacity
                      disabled={user?.role === 'agent'}
                      style={[
                        styles.selectableOption,
                        state[q.stateKey] && styles.selectedOption,
                      ]}
                      onPress={() => handleInputChange(q.stateKey, !state[q.stateKey])}
                    >
                      <ThemedText
                        style={[styles.optionText, state[q.stateKey] && { color: '#fff' }]}
                      >
                        {q.label}
                      </ThemedText>
                    </TouchableOpacity>
                  )}

                  {q.type === 'radioGroup' &&
                    q.options.map((option, i) => (
                      <TouchableOpacity
                        key={i}
                        disabled={user?.role === 'agent'}
                        style={styles.radioRow}
                        onPress={() => handleInputChange(q.stateKey, option)}
                      >
                        <View style={styles.radioCircle}>
                          {state[q.stateKey] === option && <View style={styles.radioDot} />}
                        </View>
                        <ThemedText style={styles.optionText}>{option}</ThemedText>
                      </TouchableOpacity>
                    ))}

                  {q.type === 'textarea' && (
                    <TextInput
                      editable={user?.role !== 'agent'}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      placeholder="Specify the details"
                      placeholderTextColor="#999"
                      onFocus={() => setFocusedInput(q.stateKey)}
                      onBlur={() => setFocusedInput('')}
                      value={state[q.stateKey] || ''}
                      onChangeText={(text) => handleInputChange(q.stateKey, text)}
                      style={[
                        styles.textarea,
                        focusedInput === q.stateKey && styles.focusedInput,
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {user?.role == 'support' && (
          <View style={styles.footerButtons}>
            {
              !alredyAssigned && (
                <TouchableOpacity style={styles.sendBtn} onPress={handleAssignQuestionnaire}>
                  <ThemedText style={styles.sendText}>Send</ThemedText>
                </TouchableOpacity>
 
              )
            }

            <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
              <ThemedText style={styles.closeText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentQuestionnaire;

// styles remain unchanged from your code


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    gap: 100,
    borderColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
  scroll: { padding: 16 },
  category: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 0,
  },
  categoryTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtext: {
    color: '#fff',
    backgroundColor: '#992C55',
    fontSize: 12,
    padding: 15,
    paddingTop: 5,
    paddingLeft: 25,
  },
  box: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: -10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 0,
  },
  groupBox: {
    backgroundColor: '#F5EAEE',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  selectableOption: {
    backgroundColor: '#FBEFF3',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#992C55',
  },
  optionText: {
    fontSize: 13,
    color: '#333',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#992C55',
  },
  textarea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 13,
    color: '#333',
    minHeight: 80,
  },
  focusedInput: {
    backgroundColor: '#992C5520',
    borderColor: '#992C55',
  },
  circleNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  circleNumberText: {
    color: '#992C55',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F5F5F7',
  },

  sendBtn: {
    flex: 1,
    backgroundColor: '#992C55',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  sendText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 15,
  },
  closeText: {
    color: '#000',
    // fontWeight: 'bold',
    fontSize: 15,
  },


});
