import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function Result() {
  const [result] = useState({
    originalText: "This is a sample of handwritten text that has been processed by our AI recognition system.",
    confidence: 94,
    processingTime: "1.2s",
    language: "English",
    wordCount: 19
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recognition Result</Text>
        <Text style={styles.subtitle}>Your handwritten text has been processed</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Recognized Text</Text>
          <Text style={styles.resultText}>{result.originalText}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Confidence</Text>
            <Text style={styles.statValue}>{result.confidence}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Processing Time</Text>
            <Text style={styles.statValue}>{result.processingTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Language</Text>
            <Text style={styles.statValue}>{result.language}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Word Count</Text>
            <Text style={styles.statValue}>{result.wordCount}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save to Collection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Copy Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.9)',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  actionsContainer: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  tertiaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});