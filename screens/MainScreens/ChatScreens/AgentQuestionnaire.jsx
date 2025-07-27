// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const AgentQuestionnaire = ({ navigation }) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Top bar */}
//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Questionnaire</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scroll}>
//         {/* Category 1: Face */}
//         <View style={styles.category}>
//           <View style={styles.categoryHeader}>
//             <Ionicons name="happy-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//             <Text style={styles.categoryTitle}>Face</Text>
//           </View>
//           <Text style={styles.subtext}>Select one or multiple options</Text>
//           <View style={styles.box}>
//             <Text style={styles.option}>• Little/natural Makeup</Text>
//             <Text style={styles.option}>• Excess Makeup</Text>
//             <Text style={styles.option}>• No Makeup</Text>
//           </View>
//         </View>

//         {/* Category 2: Skin */}
//         <View style={styles.category}>
//           <View style={styles.categoryHeader}>
//             <Ionicons name="color-palette-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//             <Text style={styles.categoryTitle}>Skin</Text>
//           </View>
//           <Text style={styles.subtext}>Select one or multiple options</Text>
//           <View style={styles.box}>
//             <Text style={styles.sectionTitle}>Maintain skin tone</Text>

//             <Text style={styles.sectionSubtitle}>Lighter</Text>
//             <Text style={styles.option}>◦ A little</Text>
//             <Text style={styles.option}>◦ Very light</Text>
//             <Text style={styles.option}>◦ Extremely light</Text>

//             <Text style={styles.sectionSubtitle}>Darker</Text>
//             <Text style={styles.option}>◦ A little</Text>
//             <Text style={styles.option}>◦ Very Dark</Text>
//             <Text style={styles.option}>◦ Extremely Dark</Text>
//           </View>
//         </View>

//         {/* Category 3: Body Changes */}
//         <View style={styles.category}>
//           <View style={[styles.categoryHeader, { backgroundColor: '#8B1E5C' }]}>
//             <Ionicons name="body-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//             <Text style={styles.categoryTitle}>Change in any body size</Text>
//           </View>
//           <Text style={styles.subtext}>Select one or multiple options</Text>
//           <View style={styles.box}>
//             <Text style={styles.sectionSubtitle}>Eyes</Text>
//             <TextInput
//               placeholder="Specify the details"
//               placeholderTextColor="#999"
//               style={styles.input}
//             />

//             <Text style={styles.sectionSubtitle}>Lips</Text>
//             <TextInput
//               placeholder="Specify the details"
//               placeholderTextColor="#999"
//               style={styles.input}
//             />

//             <Text style={styles.sectionSubtitle}>Hips</Text>
//             <Text style={styles.option}>• Wide</Text>
//             <Text style={styles.option}>• Very Wide</Text>
//             <Text style={styles.option}>• Extremely Wide</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AgentQuestionnaire;
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   title: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
//   scroll: {
//     padding: 16,
//   },
//   category: {
//     marginBottom: 24,
//   },
//   categoryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#992C55',
//     padding: 12,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   categoryTitle: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   subtext: {
//     color: '#992C55',
//     marginTop: 4,
//     fontSize: 12,
//     marginLeft: 10,
//   },
//   box: {
//     backgroundColor: '#FBEFF3',
//     padding: 16,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f3c9d8',
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#555',
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   option: {
//     fontSize: 13,
//     color: '#333',
//     marginVertical: 2,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 12,
//     fontSize: 13,
//     color: '#333',
//   },
// });
// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     SafeAreaView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

// const AgentQuestionnaire = ({ navigation }) => {
//     const [selectedFace, setSelectedFace] = useState(null);
//     const [selectedLighter, setSelectedLighter] = useState(null);
//     const [selectedDarker, setSelectedDarker] = useState(null);
//     const [focusedInput, setFocusedInput] = useState('');
//     const [maintainSkinTone, setMaintainSkinTone] = useState(false);
//     const [selectedHips, setSelectedHips] = useState(null);
//     const [selectedButt, setSelectedButt] = useState(null);
//     const [selectedTummy, setSelectedTummy] = useState(null);



//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar style='dark' />
//             {/* Top bar */}
//             <View style={styles.topBar}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="chevron-back" size={28} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.title}>Questionnaire</Text>
//             </View>

//             <ScrollView contentContainerStyle={styles.scroll}>
//                 {/* Category 1: Face */}
//                 <View style={styles.category}>
//                     <View style={styles.categoryHeader}>
//                         <Ionicons name="happy-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//                         <Text style={styles.categoryTitle}>Face</Text>
//                     </View>
//                     <Text style={styles.subtext}>Select one or multiple options</Text>
//                     <View style={styles.box}>
//                         {["Little/natural Makeup", "Excess Makeup", "No Makeup"].map((option, index) => (
//                             <TouchableOpacity
//                                 key={index}
//                                 style={[
//                                     styles.selectableOption,
//                                     selectedFace === option && styles.selectedOption,
//                                 ]}
//                                 onPress={() => setSelectedFace(option)}
//                             >
//                                 <Text style={[
//                                     styles.optionText,
//                                     selectedFace === option && { color: '#fff' }
//                                 ]}>{option}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* Category 2: Skin */}
//                 <View style={styles.category}>
//                     <View style={styles.categoryHeader}>
//                         <Ionicons name="color-palette-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//                         <Text style={styles.categoryTitle}>Skin</Text>
//                     </View>
//                     <Text style={styles.subtext}>Select one or multiple options</Text>
//                     <View style={styles.box}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.selectableOption,
//                                 maintainSkinTone && styles.selectedOption,
//                             ]}
//                             onPress={() => setMaintainSkinTone(prev => !prev)}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 maintainSkinTone && { color: '#fff' }
//                             ]}>Maintain skin tone</Text>
//                         </TouchableOpacity>


//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Lighter</Text>
//                             {["A little", "Very light", "Extremely light"].map((option, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={styles.radioRow}
//                                     onPress={() => setSelectedLighter(option)}
//                                 >
//                                     <View style={styles.radioCircle}>
//                                         {selectedLighter === option && <View style={styles.radioDot} />}
//                                     </View>
//                                     <Text style={styles.optionText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Darker</Text>
//                             {["A little", "Very Dark", "Extremely Dark"].map((option, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={styles.radioRow}
//                                     onPress={() => setSelectedDarker(option)}
//                                 >
//                                     <View style={styles.radioCircle}>
//                                         {selectedDarker === option && <View style={styles.radioDot} />}
//                                     </View>
//                                     <Text style={styles.optionText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     </View>
//                 </View>

//                 {/* Category 3: Body Changes */}
//                 {/* Category 3: Body Changes */}
//                 <View style={styles.category}>
//                     <View style={[styles.categoryHeader, { backgroundColor: '#992C55' }]}>
//                         <Ionicons name="body-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
//                         <Text style={styles.categoryTitle}>Change in any body size</Text>
//                     </View>
//                     <Text style={styles.subtext}>Select one or multiple options</Text>
//                     <View style={styles.box}>

//                         {/* Eyes */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Eyes</Text>
//                              <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('eyes')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'eyes' && styles.focusedInput,
//                                 ]}
//                             />
//                         </View>

//                         {/* Lips */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Lips</Text>
//                              <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('lips')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'lips' && styles.focusedInput,
//                                 ]}
//                             />
//                         </View>

//                         {/* Hips (Radio) */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Hips</Text>
//                             {["Wide", "Very Wide", "Extremely Wide"].map((option, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={styles.radioRow}
//                                     onPress={() => setSelectedHips(option)}
//                                 >
//                                     <View style={styles.radioCircle}>
//                                         {selectedHips === option && <View style={styles.radioDot} />}
//                                     </View>
//                                     <Text style={styles.optionText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         {/* Butt (Radio) */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Butt</Text>
//                             {["Big", "Very Big", "Extremely Wide"].map((option, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={styles.radioRow}
//                                     onPress={() => setSelectedButt(option)}
//                                 >
//                                     <View style={styles.radioCircle}>
//                                         {selectedButt === option && <View style={styles.radioDot} />}
//                                     </View>
//                                     <Text style={styles.optionText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         {/* Height */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Height</Text>
//                              <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('height')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'height' && styles.focusedInput,
//                                 ]}
//                             />
//                         </View>

//                         {/* Nose */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Nose</Text>
//                             <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('nose')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'nose' && styles.focusedInput,
//                                 ]}
//                             />
//                         </View>

//                         {/* Tummy (Radio) */}
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Tummy</Text>
//                             {["Small", "Very Small", "Extremely Small"].map((option, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={styles.radioRow}
//                                     onPress={() => setSelectedTummy(option)}
//                                 >
//                                     <View style={styles.radioCircle}>
//                                         {selectedTummy === option && <View style={styles.radioDot} />}
//                                     </View>
//                                     <Text style={styles.optionText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Chin</Text>
//                             <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('chin')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'chin' && styles.focusedInput,
//                                 ]}
//                             />
//                         </View>
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Arm</Text>
//                             <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('eyes')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'eyes' && styles.focusedInput,
//                                 ]}
//                             />

//                         </View>
//                         <View style={styles.groupBox}>
//                             <Text style={styles.sectionSubtitle}>Other Requirements</Text>
//                             <TextInput
//                                 placeholder="Specify the details"
//                                 placeholderTextColor="#999"
//                                 multiline
//                                 numberOfLines={3}
//                                 textAlignVertical="top"
//                                 onFocus={() => setFocusedInput('other')}
//                                 onBlur={() => setFocusedInput('')}
//                                 style={[
//                                     styles.textarea,
//                                     focusedInput === 'other' && styles.focusedInput,
//                                 ]}
//                             />

//                         </View>

//                     </View>
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default AgentQuestionnaire;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F5F5F7' },
//     topBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         marginTop: 20,
//         paddingVertical: 20,
//         borderBottomWidth: 1,
//         gap: 100,
//         borderColor: '#eee',
//     },
//     title: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
//     scroll: { padding: 16 },
//     category: { marginBottom: 20 },
//     categoryHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#992C55',
//         padding: 12,
//         paddingBottom: 0,
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         zIndex: 0,
//     },
//     categoryTitle: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 14,

//     },
//     subtext: {
//         color: '#fff',
//         backgroundColor: "#992c55",
//         // marginTop: 4,
//         fontSize: 12,
//         padding: 15,
//         paddingTop: 5,
//         paddingLeft: 25,
//         // marginLeft: 10,
//         // zIndex: 1,
//     },
//     box: {
//         backgroundColor: '#fff',
//         padding: 16,
//         borderRadius: 12,
//         width: '100%',
//         marginTop: -10,
//         // marginHorizontal: 4,
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 4,
//         elevation: 2,
//         zIndex: 0,
//     },
//     groupBox: {
//         backgroundColor: '#F5EAEE',
//         borderRadius: 12,
//         padding: 12,
//         marginTop: 8,
//     },
//     sectionTitle: {
//         fontWeight: 'bold',
//         fontSize: 14,
//         marginBottom: 10,
//     },
//     sectionSubtitle: {
//         fontSize: 13,
//         color: '#555',
//         marginTop: 12,
//         marginBottom: 4,
//     },
//     selectableOption: {
//         backgroundColor: '#FBEFF3',
//         paddingVertical: 12,
//         paddingHorizontal: 14,
//         borderRadius: 8,
//         marginBottom: 8,
//     },
//     selectedOption: {
//         backgroundColor: '#992C55',
//     },
//     optionText: {
//         fontSize: 13,
//         color: '#333',
//     },
//     radioRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 4,
//     },
//     radioCircle: {
//         height: 16,
//         width: 16,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#555',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 8,
//     },
//     radioDot: {
//         height: 8,
//         width: 8,
//         borderRadius: 4,
//         backgroundColor: '#992C55',
//     },
//     textarea: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         marginBottom: 12,
//         fontSize: 13,
//         color: '#fff',
//         minHeight: 80, // adjust as needed
//     },

//     input: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         marginBottom: 12,

//         fontSize: 13,
//         color: '#333',
//     },
//     focusedInput: {
//         backgroundColor: '#992C5520',
//         borderColor: '#992C55',
//     },
// });
// This is the final updated and dynamic version of your questionnaire screen
// that uses a data-driven approach to render each category and its questions.
// All previous static content (Face, Skin, Body Changes) is now dynamic.

import React, { useState } from 'react';
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
import ThemedText from '../../../components/ThemedText'; // adjust path accordingly

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

const AgentQuestionnaire = ({ navigation }) => {
  const [state, setState] = useState({});
  const [focusedInput, setFocusedInput] = useState('');

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
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.sendBtn}>
            <ThemedText style={styles.sendText}>Send</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <ThemedText style={styles.closeText}>Close</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default AgentQuestionnaire;

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
