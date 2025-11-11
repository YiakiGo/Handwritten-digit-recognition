import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsRow = ({ title, subtitle, onPress, hasSwitch, value, onValueChange }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={hasSwitch ? undefined : onPress}
      activeOpacity={hasSwitch ? 1 : 0.7}
    >
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#333333', true: '#ffffff' }}
          thumbColor={value ? '#000000' : '#666666'}
        />
      ) : (
        <Text style={styles.rowArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <SettingsSection title="Preferences">
          <SettingsRow
            title="Notifications"
            subtitle="Get notified about recognition results"
            hasSwitch
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingsRow
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            hasSwitch
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingsRow
            title="Auto Sync"
            subtitle="Automatically sync with cloud"
            hasSwitch
            value={autoSync}
            onValueChange={setAutoSync}
          />
        </SettingsSection>

        <SettingsSection title="Recognition">
          <SettingsRow
            title="Recognition Language"
            subtitle="English (US)"
            onPress={() => {}}
          />
          <SettingsRow
            title="Recognition Speed"
            subtitle="Balanced"
            onPress={() => {}}
          />
          <SettingsRow
            title="Output Format"
            subtitle="Plain Text"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Privacy & Security">
          <SettingsRow
            title="Analytics"
            subtitle="Help improve the app"
            hasSwitch
            value={analytics}
            onValueChange={setAnalytics}
          />
          <SettingsRow
            title="Privacy Policy"
            onPress={() => {}}
          />
          <SettingsRow
            title="Terms of Service"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow
            title="Help Center"
            onPress={() => {}}
          />
          <SettingsRow
            title="Contact Support"
            onPress={() => {}}
          />
          <SettingsRow
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
        </SettingsSection>
      </View>
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
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  rowArrow: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.4)',
  },
});