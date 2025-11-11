import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HandwritingCanvas({
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
  onCanvasReady,
  style
}) {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef('');

  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady();
    }
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current = `M ${locationX} ${locationY}`;
      setCurrentPath(pathRef.current);
      setIsDrawing(true);

      if (onStrokeStart) {
        onStrokeStart({ x: locationX, y: locationY });
      }
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current += ` L ${locationX} ${locationY}`;
      setCurrentPath(pathRef.current);

      if (onStrokeMove) {
        onStrokeMove({ x: locationX, y: locationY });
      }
    },

    onPanResponderRelease: () => {
      if (pathRef.current && pathRef.current.length > 5) {
        setPaths(prevPaths => [...prevPaths, pathRef.current]);
      }

      setCurrentPath('');
      pathRef.current = '';
      setIsDrawing(false);

      if (onStrokeEnd) {
        onStrokeEnd();
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const getCanvasData = () => {
    return {
      paths: paths,
      bounds: getBounds(),
      canvasSize: { width: screenWidth - 32, height: 300 }
    };
  };

  const getBounds = () => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const allPaths = [...paths, currentPath].filter(Boolean);

    allPaths.forEach(path => {
      const matches = path.match(/[ML]\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g);
      if (matches) {
        matches.forEach(match => {
          const [, x, y] = match.match(/[ML]\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/);
          const px = parseFloat(x);
          const py = parseFloat(y);
          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxX = Math.max(maxX, px);
          maxY = Math.max(maxY, py);
        });
      }
    });

    return { minX, minY, maxX, maxY };
  };

  return (
    <View style={[styles.container, style]} ref={canvasRef}>
      <View style={styles.canvasWrapper} {...panResponder.panHandlers}>
        <Svg
          width="100%"
          height="100%"
          style={styles.svg}
          viewBox={`0 0 ${screenWidth - 32} 300`}
        >
          {/* Render all completed paths */}
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke="#000000"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Render current drawing path */}
          {currentPath ? (
            <Path
              d={currentPath}
              stroke="#000000"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#D4B996',
    borderStyle: 'dotted',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  canvasWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  svg: {
    backgroundColor: '#FFFFFF',
  },
});

// Export methods for parent component
HandwritingCanvas.clearCanvas = () => {};
HandwritingCanvas.getCanvasData = () => {};