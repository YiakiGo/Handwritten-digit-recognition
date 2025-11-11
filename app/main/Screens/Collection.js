import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Header from '../Components/Header.js';

export default function Collection() {
  const [collections, setCollections] = useState([
    { id: '1', text: 'Hello World', confidence: 95.6, date: '2024-01-15' },
    { id: '2', text: 'React Native', confidence: 92.3, date: '2024-01-14' },
    { id: '3', text: 'Written.ai', confidence: 98.1, date: '2024-01-13' },
    { id: '4', text: 'Programming', confidence: 89.7, date: '2024-01-12' },
    { id: '5', text: 'Mobile App', confidence: 94.2, date: '2024-01-11' },
    { id: '6', text: 'Development', confidence: 91.8, date: '2024-01-10' },
    { id: '7', text: 'JavaScript', confidence: 96.4, date: '2024-01-09' },
    { id: '8', text: 'Machine Learning', confidence: 88.9, date: '2024-01-08' },
  ]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCollections(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item.text}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.confidenceText}>{item.confidence}% confidence</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Collections" />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Your Saved Items</Text>
          <Text style={styles.pageSubtitle}>{collections.length} items saved</Text>
        </View>
        
        <FlatList
          data={collections}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No saved items yet</Text>
              <Text style={styles.emptySubtitle}>Start writing to build your collection!</Text>
            </View>
          )}
        />
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
    paddingHorizontal: 20,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
});