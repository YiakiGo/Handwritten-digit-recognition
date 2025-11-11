import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';

export default function Handwriting({ onRecognize, onClear, isDrawing, setIsDrawing }) {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (event) => {
      setIsDrawing(true);
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    
    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
    },
    
    onPanResponderRelease: () => {
      setIsDrawing(false);
      if (currentPath.length > 0) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath([]);
      }
    },
  });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    onClear && onClear();
  };

  const getPathString = (path) => {
    if (path.length < 2) return '';
    
    let pathString = `M ${path[0].x} ${path[0].y}`;
    for (let i = 1; i < path.length; i++) {
      pathString += ` L ${path[i].x} ${path[i].y}`;
    }
    return pathString;
  };

  return (
    <View style={styles.container}>
      <View 
        style={styles.canvas}
        {...panResponder.panHandlers}
      >
        <Animated.View>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 350 250" 
            style={styles.svg}
          >
            {/* Render completed paths */}
            {paths.map((path, index) => (
              <path
                key={`path-${index}`}
                d={getPathString(path)}
                stroke="#000"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            
            {/* Render current drawing path */}
            {currentPath.length > 1 && (
              <path
                d={getPathString(currentPath)}
                stroke="#000"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  canvas: {
    width: 350,
    height: 250,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});