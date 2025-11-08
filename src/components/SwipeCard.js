import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;
const SWIPE_THRESHOLD = 100;

function SwipeCard({ photo, onSwipeLeft, onSwipeRight, onSwipeUp }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [imageError, setImageError] = useState(false);

  // Reset animation values when photo changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setImageError(false);
  }, [photo.id]);

  // Memoize handlers for performance
  const handleLoadError = useCallback(() => {
    if (__DEV__) console.error('Image load error for:', photo.id);
    setImageError(true);
  }, [photo.id]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeUp = translateY.value < -SWIPE_THRESHOLD;

      if (shouldSwipeUp) {
        translateY.value = withTiming(-SCREEN_HEIGHT * 1.5, { duration: 250 });
        runOnJS(onSwipeUp)();
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 });
        translateY.value = withTiming(translateY.value + 50, { duration: 250 });
        runOnJS(onSwipeLeft)();
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 });
        translateY.value = withTiming(translateY.value + 50, { duration: 250 });
        runOnJS(onSwipeRight)();
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD, SCREEN_WIDTH],
      [1, 0.8, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
      opacity,
    };
  });

  const animatedDeleteStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -50, 0],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const animatedKeepStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, 50, SWIPE_THRESHOLD],
      [0, 0.5, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const animatedFavoriteStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-SWIPE_THRESHOLD, -50, 0],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          {/* Optimized Image with expo-image for better performance */}
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            onError={handleLoadError}
            priority="high"
            cachePolicy="memory-disk"
          />

          {/* Error message */}
          {imageError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️</Text>
              <Text style={styles.errorTextSmall}>Failed to load image</Text>
            </View>
          )}

          <Animated.View style={[styles.overlay, styles.deleteOverlay, animatedDeleteStyle]}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>DELETE</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.overlay, styles.keepOverlay, animatedKeepStyle]}>
            <View style={[styles.labelContainer, styles.keepLabelContainer]}>
              <Text style={styles.labelText}>KEEP</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.overlay, styles.favoriteOverlay, animatedFavoriteStyle]}>
            <View style={[styles.labelContainer, styles.favoriteLabelContainer]}>
              <Text style={styles.labelText}>❤️ FAVORITE</Text>
            </View>
          </Animated.View>

          <View style={styles.photoInfo}>
            <Text style={styles.photoDate}>
              {new Date(photo.creationTime).toLocaleDateString()}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTextSmall: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteOverlay: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
  },
  keepOverlay: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  favoriteOverlay: {
    backgroundColor: 'rgba(255, 107, 129, 0.3)',
  },
  labelContainer: {
    borderWidth: 4,
    borderColor: '#FF5252',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    transform: [{ rotate: '-15deg' }],
  },
  keepLabelContainer: {
    borderColor: '#4CAF50',
    transform: [{ rotate: '15deg' }],
  },
  favoriteLabelContainer: {
    borderColor: '#FF6B81',
    transform: [{ rotate: '0deg' }],
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  photoDate: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(SwipeCard, (prevProps, nextProps) => {
  // Only re-render if photo ID changes
  return prevProps.photo.id === nextProps.photo.id;
});
