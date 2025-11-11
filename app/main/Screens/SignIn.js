import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function SignIn({ navigation }) {
  const [username, setUsername] = useState('');

  const handleSignIn = () => {
    if (username.trim()) {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Written.ai</Text>
          <Text style={styles.subtitle}>Where your handwriting gets recognized...</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your username...</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#8E8E93"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity 
            style={[styles.signInButton, username.trim() && styles.signInButtonActive]}
            onPress={handleSignIn}
            disabled={!username.trim()}
          >
            <Text style={[styles.signInButtonText, username.trim() && styles.signInButtonTextActive]}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  inputSection: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F2F2F7',
    marginBottom: 24,
  },
  signInButton: {
    height: 50,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonActive: {
    backgroundColor: '#007AFF',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  signInButtonTextActive: {
    color: '#fff',
  },
});