import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ResultDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (params.result) {
      setResult(JSON.parse(params.result));
    }
  }, [params.result]);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No result data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recognition Details</Text>
        <Text style={styles.subtitle}>{result.name || 'Handwriting Sample'}</Text>
      </View>

      <View style={styles.content}>
        {/* Handwriting Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Original Handwriting</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: result.image }}
              style={styles.handwritingImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Recognition Result */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recognition Result</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result.text || result.recognizedText}</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={styles.metricValue}>{result.confidence}%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Processing Time</Text>
            <Text style={styles.metricValue}>{result.recognitionTime || result.processingTime}</Text>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{result.date}</Text>
            </View>

            {result.language && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Language:</Text>
                <Text style={styles.detailValue}>{result.language}</Text>
              </View>
            )}

            {result.wordCount && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Words:</Text>
                <Text style={styles.detailValue}>{result.wordCount}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailValue}>#{result.id}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handwritingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  resultCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 50,
  },
});
