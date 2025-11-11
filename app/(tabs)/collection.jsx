import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Collection() {
  const router = useRouter();

  const collections = [
    {
      id: '1',
      name: 'Test 1',
      text: '2',
      image: 'https://via.placeholder.com/300x200/000000/ffffff?text=Handwriting+Sample+1',
      date: '2024-01-15',
      confidence: 94,
      recognitionTime: '1.2s'
    },
    {
      id: '2',
      name: 'Test 2',
      text: '6',
      image: 'https://via.placeholder.com/300x200/000000/ffffff?text=Handwriting+Sample+2',
      date: '2025-11-14',
      confidence: 89,
      recognitionTime: '0.8s'
    },
    {
      id: '3',
      name: 'Test 3',
      text: '9',
      image: 'https://via.placeholder.com/300x200/000000/ffffff?text=Handwriting+Sample+3',
      date: '2025-11-13',
      confidence: 96,
      recognitionTime: '1.5s'
    },
    {
      id: '4',
      name: 'Test 4',
      text: '1',
      image: 'https://via.placeholder.com/300x200/000000/ffffff?text=Handwriting+Sample+4',
      date: '2025-11-12',
      confidence: 91,
      recognitionTime: '0.9s'
    },
  ];

  const handleCollectionPress = (item) => {
    router.push({
      pathname: '/result-detail',
      params: { result: JSON.stringify(item) }
    });
  };

  const renderCollection = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() => handleCollectionPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.collectionImage} />
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{item.name}</Text>
        <Text style={styles.collectionText}>{item.text}</Text>
        <View style={styles.collectionMeta}>
          <Text style={styles.collectionDate}>{item.date}</Text>
          <Text style={styles.collectionConfidence}>{item.confidence}% confidence</Text>
          <Text style={styles.collectionTime}>{item.recognitionTime}</Text>
        </View>
      </View>
      <Text style={styles.collectionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collections</Text>
        <Text style={styles.subtitle}>Your saved handwriting collections</Text>
      </View>

      <FlatList
        data={collections}
        renderItem={renderCollection}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  listContainer: {
    paddingVertical: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  collectionImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  collectionText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 8,
  },
  collectionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collectionDate: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginRight: 12,
  },
  collectionConfidence: {
    fontSize: 12,
    color: '#0066cc',
    marginRight: 12,
  },
  collectionTime: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  collectionArrow: {
    fontSize: 24,
    color: 'rgba(0, 0, 0, 0.3)',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
});