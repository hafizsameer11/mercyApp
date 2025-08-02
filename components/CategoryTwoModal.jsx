import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import questionnaireData from '../screens/MainScreens/ChatScreens/questionnaireData';
import ThemedText from './ThemedText';
import submitAnswers from '../config/submitAnswers';

const { width } = Dimensions.get('window');

const CategoryTwoModal = ({ visible, onClose, onNext, onPrevious, chat_id, user_id, onSaved }) => {
  const category = questionnaireData[1]; // Skin category
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = category.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

      console.log("chat_id", chat_id, "user_id", user_id,"in cateogy model two")

  const handleSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const result = await submitAnswers(chat_id, user_id, answers);
      if (result.status === 'success') {
        onNext(); // Proceed to CategoryThreeModal
        onSaved(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onPrevious(); // Go back to CategoryOneModal
    }
  };

  const selected = answers[currentQuestion.stateKey];

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
            <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20, padding: 4 }} onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          {/* Question Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.circle}>2</ThemedText>
              <View>
                <ThemedText style={styles.cardTitle}>{category.title}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{category.description}</ThemedText>
              </View>
            </View>

            <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10, zIndex: 1, marginTop: -25, elevation: 1 }}>
              {/* Toggle */}
              {currentQuestion.type === 'toggle' && (
                <TouchableOpacity
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => handleSelect(currentQuestion.stateKey, !selected)}
                >
                  <ThemedText style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {currentQuestion.label}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {/* Radio Group */}
              {currentQuestion.type === 'radioGroup' &&
                currentQuestion.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.option, selected === option && styles.optionSelected]}
                    onPress={() => handleSelect(currentQuestion.stateKey, option)}
                  >
                    <ThemedText style={[styles.optionText, selected === option && styles.optionTextSelected]}>
                      {option}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handlePrevious} style={styles.footerBtnGray}>
              <ThemedText style={styles.footerBtnText}>Previous</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.footerBtnPink}>
              <ThemedText style={styles.footerBtnText}>
                {currentIndex === questions.length - 1 ? 'Done' : 'Next'}
              </ThemedText>
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