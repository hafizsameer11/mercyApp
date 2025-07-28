import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
// import ThemedText from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';

const DynamicCategoryModal = ({ section, sectionIndex, totalSections, onPrevious, onNext, onDone, onClose }) => {
  const [answers, setAnswers] = useState({});

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitSection = () => {
    console.log(`📤 Submitting section ${sectionIndex + 1}`, answers);

    // TODO: Send section data to backend using axios
    // await axios.post(API.SUBMIT_FORM_SECTION, answers)

    if (sectionIndex === totalSections - 1) {
      onDone(answers);
    } else {
      onNext();
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{section.title}</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {section.questions.map((q) => (
          <View key={q.id} style={{ marginBottom: 16 }}>
            <ThemedText style={{ marginBottom: 4 }}>{q.text}</ThemedText>
            {q.type === 'text' || q.type === 'textarea' ? (
              <TextInput
                style={styles.input}
                placeholder="Your answer"
                multiline={q.type === 'textarea'}
                onChangeText={(val) => handleInputChange(q.id, val)}
              />
            ) : q.type === 'dropdown' || q.type === 'radio' ? (
              q.options.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.optionRow}
                  onPress={() => handleInputChange(q.id, opt.option_text)}
                >
                  <View style={styles.radioDot(answers[q.id] === opt.option_text)} />
                  <Text>{opt.option_text}</Text>
                </TouchableOpacity>
              ))
            ) : q.type === 'checkbox' ? (
              q.options.map((opt) => {
                const selected = Array.isArray(answers[q.id]) ? answers[q.id].includes(opt.option_text) : false;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={styles.optionRow}
                    onPress={() => {
                      let newValues = Array.isArray(answers[q.id]) ? [...answers[q.id]] : [];
                      if (selected) {
                        newValues = newValues.filter((v) => v !== opt.option_text);
                      } else {
                        newValues.push(opt.option_text);
                      }
                      handleInputChange(q.id, newValues);
                    }}
                  >
                    <Ionicons
                      name={selected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#992C55"
                      style={{ marginRight: 8 }}
                    />
                    <Text>{opt.option_text}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ color: 'gray' }}>Unsupported type: {q.type}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {sectionIndex > 0 && (
          <TouchableOpacity onPress={onPrevious} style={[styles.btn, { backgroundColor: '#ccc' }]}>
            <Text style={{ color: '#000' }}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSubmitSection} style={[styles.btn, { backgroundColor: '#992C55' }]}>
          <Text style={{ color: '#fff' }}>{sectionIndex === totalSections - 1 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  radioDot: (selected) => ({
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#992C55',
    backgroundColor: selected ? '#992C55' : 'transparent',
    marginRight: 8,
  }),
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
});

export default DynamicCategoryModal;
