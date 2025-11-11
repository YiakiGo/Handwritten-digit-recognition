import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Database() {
  const databaseInfo = {
    totalEntries: 70000,
    mnistSamples: 60000,
    testSamples: 10000,
    languages: ['English', 'Spanish', 'French', 'German'],
    lastUpdated: '2024-01-15',
    accuracy: 94.2,
    datasetSize: '70,000 images',
    imageSize: '28x28 pixels',
    format: 'Grayscale',
  };

  const mnistDigits = [
    { id: 0, label: 'Zero', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=0', samples: 5923 },
    { id: 1, label: 'One', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=1', samples: 6742 },
    { id: 2, label: 'Two', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=2', samples: 5958 },
    { id: 3, label: 'Three', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=3', samples: 6131 },
    { id: 4, label: 'Four', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=4', samples: 5842 },
    { id: 5, label: 'Five', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=5', samples: 5421 },
    { id: 6, label: 'Six', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=6', samples: 5918 },
    { id: 7, label: 'Seven', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=7', samples: 6265 },
    { id: 8, label: 'Eight', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=8', samples: 5851 },
    { id: 9, label: 'Nine', image: 'https://via.placeholder.com/100x100/000000/ffffff?text=9', samples: 5949 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database</Text>
        <Text style={styles.subtitle}>Recognition database overview</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>MNIST Database Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Dataset Size</Text>
            <Text style={styles.statValue}>{databaseInfo.datasetSize}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Training Samples</Text>
            <Text style={styles.statValue}>{databaseInfo.mnistSamples.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Test Samples</Text>
            <Text style={styles.statValue}>{databaseInfo.testSamples.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Image Size</Text>
            <Text style={styles.statValue}>{databaseInfo.imageSize}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Format</Text>
            <Text style={styles.statValue}>{databaseInfo.format}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Last Updated</Text>
            <Text style={styles.statValue}>{databaseInfo.lastUpdated}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supported Languages</Text>
          {databaseInfo.languages.map((language, index) => (
            <View key={index} style={styles.languageItem}>
              <Text style={styles.languageText}>● {language}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>MNIST Handwritten Digits</Text>
          <View style={styles.digitGrid}>
            {mnistDigits.map((digit) => (
              <View key={digit.id} style={styles.digitItem}>
                <Image source={{ uri: digit.image }} style={styles.digitImage} />
                <Text style={styles.digitLabel}>{digit.label}</Text>
                <Text style={styles.digitSamples}>{digit.samples.toLocaleString()} samples</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Update Database</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText}>Clear History</Text>
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
  overviewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  languageItem: {
    marginBottom: 8,
  },
  languageText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.9)',
  },
  digitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  digitItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  digitImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  digitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  digitSamples: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
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