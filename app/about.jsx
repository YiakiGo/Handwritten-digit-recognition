import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AboutTeam() {
  const router = useRouter();

  const teamMembers = [
    {
      name: "Johni",
      role: "Team leader & Project Manager",
      description: "Building the future of handwriting recognition technology",
      emoji: "💻"
    },
    {
      name: "Ming",
      role: "User Experience & Interface Design",
      description: "Creating intuitive and delightful user experiences",
      emoji: "🎨"
    },
    {
      name: "Liza",
      role: "Machine Learning & Computer Vision",
      description: "Developing state-of-the-art recognition algorithms",
      emoji: "🤖"
    },
    {
      name: "Erik",
      role: "Machine Learning & Computer Vision",
      description: "Developing state-of-the-art recognition algorithms",
      emoji: "🤖"
    },
    {
      name: "Santos",
      role: "Machine Learning & Computer Vision",
      description: "Developing state-of-the-art recognition algorithms",
      emoji: "🤖"
    },
    {
      name: "Abdul",
      role: "Testing & Quality Control",
      description: "Ensuring the app works flawlessly for every user",
      emoji: "✅"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Team</Text>
        <Text style={styles.subtitle}>
          Meet the passionate team behind Written.ai
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.description}>
          We believe that handwriting is a personal expression that should be preserved and understood in the digital age.
          Our mission is to bridge the gap between traditional handwriting and modern technology through advanced AI.
        </Text>

        <Text style={[styles.sectionTitle, styles.teamSectionTitle]}>Team Members</Text>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.memberCard}>
            <Text style={styles.memberEmoji}>{member.emoji}</Text>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            <Text style={styles.memberDescription}>{member.description}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Written.ai Version 1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built with React Native & Expo
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 32,
  },
  teamSectionTitle: {
    marginTop: 16,
  },
  memberCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  memberEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  memberDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999999',
  },
});
