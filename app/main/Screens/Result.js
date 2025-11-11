import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Header from '../Components/Header.js';

export default function Result({ route, navigation }) {
  const { recognizedText, similarity } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Recognition Result" showBack={true} />
      
      <ScrollView style={styles.content}>
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>Recognition Details</Text>
          
          <View style={styles.resultSection}>
            <Text style={styles.sectionLabel}>Recognized Text:</Text>
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{recognizedText || 'No text recognized'}</Text>
            </View>
          </View>
          
          <View style={styles.resultSection}>
            <Text style={styles.sectionLabel}>Confidence Score:</Text>
            <View style={styles.confidenceBox}>
              <Text style={styles.confidenceText}>{similarity ? `${similarity}%` : 'N/A'}</Text>
              <View style={styles.confidenceBar}>
                <View style={[styles.confidenceFill, { width: `${similarity || 0}%` }]} />
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.editButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={() => {
                // Save to collection
                alert('Saved to collection!');
              }}
            >
              <Text style={styles.saveButtonText}>Save to Collection</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Better Recognition</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Write clearly and slowly</Text>
            <Text style={styles.tipItem}>• Use proper spacing between letters</Text>
            <Text style={styles.tipItem}>• Write in a well-lit area</Text>
            <Text style={styles.tipItem}>• Use a stylus for better precision</Text>
          </View>
        </View>
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
    paddingTop: 20,
  },
  resultCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  resultText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  confidenceBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  confidenceText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#E5E5EA',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tipsCard: {
    backgroundColor: '#FFE6D6',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D2691E',
    marginBottom: 12,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 6,
  },
});