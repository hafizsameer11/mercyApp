// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   Switch,
//   StyleSheet,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import questionnaireData from '../screens/MainScreens/ChatScreens/questionnaireData';

// const CategoryTwoModal = ({ visible, onClose, onNext, onPrevious }) => {
//   const category = questionnaireData[1]; // Skin
//   const [maintainSkinTone, setMaintainSkinTone] = useState(false);
//   const [selectedLighter, setSelectedLighter] = useState(null);
//   const [selectedDarker, setSelectedDarker] = useState(null);

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Questions</Text>
//             <TouchableOpacity>
//               <Text style={styles.submitBtn}>Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="#000" />
//             </TouchableOpacity>
//           </View>

//           {/* Progress Bar */}
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '66%' }]} />
//           </View>

//           {/* Question Card */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.circle}>2</Text>
//               <View>
//                 <Text style={styles.cardTitle}>{category.title}</Text>
//                 <Text style={styles.cardSubtitle}>{category.description}</Text>
//               </View>
//             </View>

//             {/* Toggle */}
//             <View style={styles.toggleRow}>
//               <Text style={styles.toggleLabel}>{category.questions[0].label}</Text>
//               <Switch
//                 value={maintainSkinTone}
//                 onValueChange={setMaintainSkinTone}
//                 trackColor={{ true: '#992c55' }}
//                 thumbColor="#fff"
//               />
//             </View>

//             {/* Lighter */}
//             <Text style={styles.groupLabel}>Lighter</Text>
//             {category.questions[1].options.map((option, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={[
//                   styles.option,
//                   selectedLighter === option && styles.optionSelected,
//                 ]}
//                 onPress={() => setSelectedLighter(option)}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     selectedLighter === option && styles.optionTextSelected,
//                   ]}
//                 >
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}

//             {/* Darker */}
//             <Text style={styles.groupLabel}>Darker</Text>
//             {category.questions[2].options.map((option, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={[
//                   styles.option,
//                   selectedDarker === option && styles.optionSelected,
//                 ]}
//                 onPress={() => setSelectedDarker(option)}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     selectedDarker === option && styles.optionTextSelected,
//                   ]}
//                 >
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <TouchableOpacity onPress={onPrevious} style={styles.footerBtnGray}>
//               <Text style={styles.footerBtnText}>Previous</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onNext} style={styles.footerBtnPink}>
//               <Text style={styles.footerBtnText}>Next</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default CategoryTwoModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000088',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     height: '90%',
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   submitBtn: {
//     color: '#992c55',
//     fontWeight: '600',
//   },
//   progressBar: {
//     height: 5,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 4,
//     marginVertical: 15,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#992c55',
//     borderRadius: 4,
//   },
//   card: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 10,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   circle: {
//     backgroundColor: '#992c55',
//     color: '#fff',
//     borderRadius: 20,
//     width: 30,
//     height: 30,
//     textAlign: 'center',
//     lineHeight: 30,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cardSubtitle: {
//     fontSize: 13,
//     color: '#666',
//   },
//   toggleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   toggleLabel: {
//     fontSize: 15,
//     color: '#333',
//   },
//   groupLabel: {
//     fontSize: 15,
//     marginTop: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
//   option: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 10,
//   },
//   optionSelected: {
//     backgroundColor: '#992c55',
//     borderColor: '#992c55',
//   },
//   optionText: {
//     fontSize: 15,
//     color: '#333',
//   },
//   optionTextSelected: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   footer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   footerBtnGray: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: '#ddd',
//     borderRadius: 10,
//   },
//   footerBtnPink: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: '#992c55',
//     borderRadius: 10,
//   },
//   footerBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import questionnaireData from '../screens/MainScreens/ChatScreens/questionnaireData';
import ThemedText from './ThemedText';

const { width } = Dimensions.get('window');

const CategoryTwoModal = ({ visible, onClose, onNext, onPrevious }) => {
  const category = questionnaireData[1]; // Skin
  const [maintainSkinTone, setMaintainSkinTone] = useState(false);
  const [selectedLighter, setSelectedLighter] = useState(null);
  const [selectedDarker, setSelectedDarker] = useState(null);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Questions</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.submitBtn}>Submit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor:"#fff", borderRadius:20, padding:4 }} onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.circle}>2</ThemedText>
              <View>
                <ThemedText style={styles.cardTitle}>{category.title}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{category.description}</ThemedText>
              </View>
            </View>

            <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10, zIndex: 1 , marginTop: -25, elevation: 1 }}>
              {/* Maintain Skin Tone (toggle option) */}
              <TouchableOpacity
                style={[
                  styles.option,
                  maintainSkinTone && styles.optionSelected
                ]}
                onPress={() => setMaintainSkinTone(!maintainSkinTone)}
              >
                <ThemedText style={[
                  styles.optionText,
                  maintainSkinTone && styles.optionTextSelected
                ]}>
                  {category.questions[0].label}
                </ThemedText>
              </TouchableOpacity>

              {/* Lighter */}
              <ThemedText style={styles.groupLabel}>Lighter</ThemedText>
              {category.questions[1].options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.option,
                    selectedLighter === option && styles.optionSelected
                  ]}
                  onPress={() => setSelectedLighter(option)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    selectedLighter === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}

              {/* Darker */}
              <ThemedText style={styles.groupLabel}>Darker</ThemedText>
              {category.questions[2].options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.option,
                    selectedDarker === option && styles.optionSelected
                  ]}
                  onPress={() => setSelectedDarker(option)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    selectedDarker === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onPrevious} style={styles.footerBtnGray}>
              <ThemedText style={styles.footerBtnText}>Previous</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext} style={styles.footerBtnPink}>
              <ThemedText style={styles.footerBtnText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryTwoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitBtn: {
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 35,
    paddingVertical: 10,
    marginLeft: 130,
    borderRadius: 30,
    backgroundColor: '#992c55',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    marginVertical: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#992c55',
    borderRadius: 4,
  },
  card: {
    borderRadius: 16,
    width: width - 20,
    marginLeft: -10,
    padding: 16,
    marginTop: -10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#992C55',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  circle: {
    backgroundColor: '#fff',
    color: '#992c55',
    borderRadius: 20,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#fff',
    paddingTop: 5,
    paddingBottom: 10,
  },
  option: {
    backgroundColor:"#F5EAEE",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  optionSelected: {
    backgroundColor: '#992c55',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  groupLabel: {
    fontSize: 15,
    marginTop: 15,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerBtnGray: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    backgroundColor: '#ddd',
    borderRadius: 30,
    
  },
  footerBtnPink: {
    paddingVertical: 14,
    paddingHorizontal: 70,
    backgroundColor: '#992c55',
    borderRadius: 30,
    
  },
  footerBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
