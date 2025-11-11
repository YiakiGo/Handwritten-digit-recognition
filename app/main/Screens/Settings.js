import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Header from '../Components/Header.js';

export default function Settings({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      subtitle: 'Get the Eastern flavour !',
      selected: selectedLanguage === 'English'
    },
    { 
      code: 'zh', 
      name: '简体中文', 
      subtitle: '中国味道放在你的手里 ！',
      selected: selectedLanguage === '简体中文'
    },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    Alert.alert(
      'Language Changed',
      `Language has been changed to ${language.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'Choose feedback type',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report Issue', 
          onPress: () => {
            Alert.alert(
              'Report an Issue',
              'Facing an issue? Report and we\'ll look into it.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Email', onPress: () => Linking.openURL('mailto:support@written.ai') }
              ]
            );
          }
        },
        { 
          text: 'Rate App', 
          onPress: () => {
            Alert.alert(
              'Rate in Class',
              'Enjoying the app? Leave a review!',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Rate Now', onPress: () => alert('Redirecting to app store...') }
              ]
            );
          }
        }
      ]
    );
  };

  const handleAbout = (type) => {
    if (type === 'app') {
      Alert.alert(
        'About Written.ai',
        'Read a bit more about the app.\n\nWritten.ai is a cutting-edge handwriting recognition app that uses advanced AI to convert your handwritten text into digital format with high accuracy.',
        [{ text: 'OK' }]
      );
    } else if (type === 'team') {
      Alert.alert(
        'The Team',
        'Get to know the team that made this cool app.\n\nOur team consists of passionate developers, AI researchers, and designers dedicated to making handwriting recognition accessible and accurate for everyone.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[styles.languageItem, language.selected && styles.languageItemSelected]}
              onPress={() => handleLanguageSelect(language)}
            >
              <View style={styles.languageContent}>
                <Text style={[styles.languageName, language.selected && styles.languageNameSelected]}>
                  {language.name}
                </Text>
                <Text style={[styles.languageSubtitle, language.selected && styles.languageSubtitleSelected]}>
                  {language.subtitle}
                </Text>
              </View>
              {language.selected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          
          <TouchableOpacity 
            style={styles.feedbackItem}
            onPress={handleFeedback}
          >
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Report an Issue</Text>
              <Text style={styles.feedbackSubtitle}>Facing an issue? Report and we'll look into it.</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.feedbackItem}
            onPress={handleFeedback}
          >
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Rate in Class</Text>
              <Text style={styles.feedbackSubtitle}>Enjoying the app? Leave a review !</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.aboutItem}
            onPress={() => handleAbout('app')}
          >
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>About Written.ai</Text>
              <Text style={styles.aboutSubtitle}>Read a bit more about the app.</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.aboutItem}
            onPress={() => handleAbout('team')}
          >
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>The Team</Text>
              <Text style={styles.aboutSubtitle}>Get to know the team that made this cool app.</Text>
            </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    backgroundColor: '#E6F2FF',
    borderColor: '#007AFF',
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: '#007AFF',
  },
  languageSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  languageSubtitleSelected: {
    color: '#007AFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  feedbackItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  aboutItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  aboutSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
});