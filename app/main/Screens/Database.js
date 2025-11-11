import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import Header from '../Components/Header.js';

export default function Database() {
  const [databaseInfo] = useState({
    name: 'MNIST Database',
    source: 'mnist.org',
    description: 'The MNIST database is a large database of handwritten digits that is commonly used for training various image processing systems.',
    size: '60,000 training images + 10,000 test images',
    format: '28x28 pixel grayscale images',
    accuracy: '99.7% recognition accuracy',
  });

  const handleVisitWebsite = () => {
    Alert.alert(
      'Visit Website',
      'You will be redirected to mnist.org',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Visit', 
          onPress: () => Linking.openURL('http://yann.lecun.com/exdb/mnist/')
        }
      ]
    );
  };

  const stats = [
    { label: 'Training Images', value: '60,000' },
    { label: 'Test Images', value: '10,000' },
    { label: 'Image Size', value: '28x28 px' },
    { label: 'Format', value: 'Grayscale' },
    { label: 'Accuracy', value: '99.7%' },
    { label: 'Classes', value: '10 (0-9)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Database" showBack={true} />
      
      <ScrollView style={styles.content}>
        <View style={styles.databaseCard}>
          <Text style={styles.databaseName}>{databaseInfo.name}</Text>
          <TouchableOpacity onPress={handleVisitWebsite}>
            <Text style={styles.databaseSource}>{databaseInfo.source}</Text>
          </TouchableOpacity>
          
          <Text style={styles.databaseDescription}>{databaseInfo.description}</Text>
          
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>High accuracy recognition</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Standardized benchmark dataset</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Widely used in research</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Pre-processed and normalized</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Balanced class distribution</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.visitCard}>
          <Text style={styles.visitTitle}>Learn More</Text>
          <Text style={styles.visitDescription}>
            Visit the official MNIST database website to explore more about this dataset and its applications in machine learning research.
          </Text>
          <TouchableOpacity 
            style={styles.visitButton}
            onPress={handleVisitWebsite}
          >
            <Text style={styles.visitButtonText}>Visit mnist.org</Text>
          </TouchableOpacity>
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
  databaseCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  databaseName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  databaseSource: {
    fontSize: 18,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  databaseDescription: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: '#E6F2FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    color: '#34C759',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#000',
  },
  visitCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  visitTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D2691E',
    marginBottom: 12,
  },
  visitDescription: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 16,
  },
  visitButton: {
    backgroundColor: '#D2691E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});