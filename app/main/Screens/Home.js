import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../Components/Header.js';
import Handwriting from '../Components/Handwriting.js';
import ResultPanel from '../Components/ResultPanel.js';

export default function Home({ navigation }) {
  const [recognizedText, setRecognizedText] = useState('');
  const [similarity, setSimilarity] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleRecognize = (text, confidence) => {
    setRecognizedText(text);
    setSimilarity(confidence);
  };

  const handleClear = () => {
    setRecognizedText('');
    setSimilarity(0);
  };

  const handleNew = () => {
    setRecognizedText('');
    setSimilarity(0);
  };

  const handleSave = () => {
    if (recognizedText) {
      Alert.alert(
        'Save to Collection',
        `Save "${recognizedText}" to your collection?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => Alert.alert('Saved!', 'Item saved to your collection.') }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Written.ai" />
      
      <ScrollView style={styles.content}>
        <View style={styles.writingSection}>
          <Text style={styles.sectionTitle}>Writing field</Text>
          <Text style={styles.sectionSubtitle}>Write here!</Text>
          
          <Handwriting 
            onRecognize={handleRecognize}
            onClear={handleClear}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
          />
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.recognizeButton]}
            onPress={() => {
              // Simulate recognition
              handleRecognize('Hello', 95.6);
            }}
          >
            <Text style={styles.recognizeButtonText}>Recognize</Text>
          </TouchableOpacity>
        </View>

        {(recognizedText || similarity > 0) && (
          <ResultPanel
            recognizedText={recognizedText}
            similarity={similarity}
            onNew={handleNew}
            onSave={handleSave}
            onViewResult={() => navigation.navigate('Result', {
              recognizedText,
              similarity
            })}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  writingSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  clearButton: {
    backgroundColor: '#E5E5EA',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  recognizeButton: {
    backgroundColor: '#007AFF',
  },
  recognizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});