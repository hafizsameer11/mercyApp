// components/QuestionnaireWizard.js
import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import questionnaireData from '../screens/MainScreens/ChatScreens/questionnaireData';


const ModalWizard = ({ visible, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentCategory = questionnaireData[currentIndex];

    const handleNext = () => {
        if (currentIndex < questionnaireData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
            setCurrentIndex(0); // Reset for next time
        }
    };

    return (
        
       <Modal  transparent animationType="slide">
                                  <View style={styles.modalOverlay}>
                                      <View style={[styles.agentOptionsModal, { maxHeight: '80%' }]}>
                                          <Text style={styles.modalTitle}>
                                              {questionnaireData[currentCategoryIndex]?.title}
                                          </Text>
      
                                          {questionnaireData[currentCategoryIndex]?.questions?.map((q, index) => (
                                              <View key={index} style={{ marginTop: 10 }}>
                                                  <Text style={{ marginBottom: 4 }}>
                                                      {typeof q === 'string' ? q : q.label || 'Question ' + (index + 1)}
                                                  </Text>
                                                  <TextInput
                                                      placeholder="Your answer"
                                                      style={{
                                                          backgroundColor: '#fff',
                                                          borderWidth: 1,
                                                          borderColor: '#ccc',
                                                          borderRadius: 8,
                                                          padding: 10,
                                                      }}
                                                  />
                                              </View>
                                          ))}
      
                                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                              {currentCategoryIndex < questionnaireData.length - 1 ? (
                                                  <TouchableOpacity
                                                      onPress={() => setCurrentCategoryIndex(prev => prev + 1)}
                                                      style={styles.qStartBtn}
                                                  >
                                                      <Text style={styles.qStartBtnText}>Next</Text>
                                                  </TouchableOpacity>
                                              ) : (
                                                  <TouchableOpacity
                                                      onPress={() => setQuestionnaireVisible(false)}
                                                      style={styles.qStartBtn}
                                                  >
                                                      <Text style={styles.qStartBtnText}>Finish</Text>
                                                  </TouchableOpacity>
                                              )}
      
                                              <TouchableOpacity
                                                  onPress={() => setQuestionnaireVisible(false)}
                                                  style={styles.qCloseBtn}
                                              >
                                                  <Text style={styles.qCloseBtnText}>Close</Text>
                                              </TouchableOpacity>
                                          </View>
                                      </View>
                                  </View>
                              </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: '#F5F5F7',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    nextBtn: {
        backgroundColor: '#992C55',
        paddingVertical: 13,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    nextText: {
        color: '#fff',
        fontWeight: '600',
    },
    closeBtn: {
        backgroundColor: '#ccc',
        paddingVertical: 13,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    closeText: {
        color: '#000',
        fontWeight: '600',
    },
});

export default ModalWizard;