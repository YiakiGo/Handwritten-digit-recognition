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

export default function User({ navigation }) {
  const [username] = useState('John Doe');
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: '1', title: 'Option 1', subtitle: 'Option 1' },
    { id: '2', title: 'Option 2', subtitle: 'Option 2' },
    { id: '3', title: 'Option 3', subtitle: 'Option 3' },
    { id: '4', title: 'Option 4', subtitle: 'Option 4' },
    { id: '5', title: 'Option 5', subtitle: 'Option 5, but this one is...' },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => navigation.replace('SignIn')
        }
      ]
    );
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option.id);
    Alert.alert('Selected', `You selected: ${option.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="User Profile" />
      
      <ScrollView style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{username}</Text>
        </View>
        
        <View style={styles.dropdownSection}>
          <Text style={styles.sectionTitle}>Dropdown Title</Text>
          
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionItem, selectedOption === option.id && styles.optionItemSelected]}
              onPress={() => handleOptionPress(option)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, selectedOption === option.id && styles.optionTitleSelected]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, selectedOption === option.id && styles.optionSubtitleSelected]}>
                  {option.subtitle}
                </Text>
              </View>
              {selectedOption === option.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>SIGN OUT</Text>
        </TouchableOpacity>
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
  userSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  dropdownSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  optionItem: {
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
  optionItemSelected: {
    backgroundColor: '#E6F2FF',
    borderColor: '#007AFF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: '#007AFF',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  optionSubtitleSelected: {
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
  signOutButton: {
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});