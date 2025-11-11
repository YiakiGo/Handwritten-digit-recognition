import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import HandwritingCanvas from '../components/HandwritingCanvas';
import HandwritingButton from '../components/HandwritingButton';
import ScribblyText from '../components/ScribblyText';

export default function Home() {
  const router = useRouter();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const canvasRef = useRef(null);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleRecognize = async () => {
    if (!canvasRef.current) {
      Alert.alert('Error', 'Canvas not ready');
      return;
    }

    const canvasData = canvasRef.current.getCanvasData();

    if (!canvasData.paths || canvasData.paths.length === 0) {
      Alert.alert('Notice', 'Please write something first');
      return;
    }

    setIsRecognizing(true);

    try {
      // Simulate recognition process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock recognition result
      const mockResult = {
        recognizedText: "This is a sample of handwritten text that has been processed by our AI recognition system.",
        confidence: 94,
        processingTime: "1.2s",
        language: "English",
        wordCount: 19,
        originalPaths: canvasData.paths,
        bounds: canvasData.bounds
      };

      // Navigate to result page with the recognition data
      router.push({
        pathname: '/result',
        params: { result: JSON.stringify(mockResult) }
      });

    } catch (error) {
      Alert.alert('Error', 'Recognition failed. Please try again.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleCanvasReady = () => {
    console.log('Canvas is ready for handwriting input');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ScribblyText variant="title" size="giant" scribbly={true}>
          ✎ Written.ai
        </ScribblyText>
        <ScribblyText variant="secondary" size="large" scribbly={true}>
          ✨ Your Personal Handwriting Assistant ✨
        </ScribblyText>
      </View>

      <View style={styles.content}>
        <View style={styles.writingSection}>
          <ScribblyText variant="accent" size="large" scribbly={true}>
            📝 Write Here
          </ScribblyText>
          <ScribblyText variant="muted" size="medium" scribbly={true}>
            Use your finger or stylus to write naturally!
          </ScribblyText>

          <View style={styles.canvasContainer}>
            <HandwritingCanvas
              ref={canvasRef}
              onCanvasReady={handleCanvasReady}
              style={styles.canvas}
            />
            <View style={styles.canvasDecorations}>
              <Text style={styles.cornerDoodle}>✨</Text>
              <Text style={styles.cornerDoodleRight}>🌟</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <HandwritingButton
            title="✕ Clear"
            onPress={handleClear}
            variant="secondary"
            size="medium"
            disabled={isRecognizing}
          />

          <HandwritingButton
            title={isRecognizing ? "Thinking..." : "✓ Recognize"}
            onPress={handleRecognize}
            variant="primary"
            size="medium"
            disabled={isRecognizing}
            icon={isRecognizing ? "🤔" : "✨"}
          />
        </View>

        <View style={styles.tipsSection}>
          <ScribblyText variant="ink" size="medium" scribbly={true}>
            💡 Pro Tips:
          </ScribblyText>
          <View style={styles.tipItem}>
            <Text style={styles.tipEmoji}>🎯</Text>
            <ScribblyText variant="secondary" size="small" scribbly={true}>
              Write slowly for better recognition
            </ScribblyText>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipEmoji}>✨</Text>
            <ScribblyText variant="secondary" size="small" scribbly={true}>
              Use your natural handwriting style
            </ScribblyText>
          </View>
        </View>

        <View style={styles.quickActions}>
          <HandwritingButton
            title="📚 My Collections"
            onPress={() => router.push('/collection')}
            variant="cute"
            size="small"
          />

          <HandwritingButton
            title="🗄️ Database"
            onPress={() => router.push('/database')}
            variant="scribbly"
            size="small"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Paper cream color
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFF8F0',
  },
  writingSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  canvasContainer: {
    position: 'relative',
    marginTop: 16,
  },
  canvas: {
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#D4B996',
    borderStyle: 'dotted',
    overflow: 'hidden',
  },
  canvasDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cornerDoodle: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 20,
    color: '#FFD93D',
    opacity: 0.7,
  },
  cornerDoodleRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 20,
    color: '#FFD93D',
    opacity: 0.7,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  tipsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFE5E5',
    borderStyle: 'dashed',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});