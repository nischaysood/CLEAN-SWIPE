import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function PermissionScreen({ onPermissionGranted }) {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      console.log('📱 Requesting photo permissions...');
      // Request full access including write permissions
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      
      console.log('📱 Permission status:', status);
      
      if (status === 'granted') {
        console.log('✅ Permission granted!');
        onPermissionGranted();
      } else if (status === 'denied') {
        // User denied permission
        Alert.alert(
          '📷 Permission Required',
          'CleanSwipe needs access to your photos to help you organize your gallery.\n\nPlease enable photo access in your device settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'Try Again',
              onPress: () => requestPermission(),
            },
          ]
        );
      } else {
        // Other status (limited, undetermined, etc.)
        Alert.alert(
          '⚠️ Permission Issue',
          `Permission status: ${status}\n\nPlease go to Settings and enable full photo access for CleanSwipe.`,
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'Try Again',
              onPress: () => requestPermission(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('❌ Permission error:', error);
      Alert.alert(
        'Error',
        `Could not request permission: ${error.message}\n\nPlease enable photo access manually in Settings.`,
        [
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
          {
            text: 'Try Again',
            onPress: () => requestPermission(),
          },
        ]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📸</Text>
        <Text style={styles.title}>Welcome to CleanSwipe!</Text>
        <Text style={styles.subtitle}>
          Clean up your photo gallery with simple swipes
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>👈</Text>
            <Text style={styles.featureText}>Swipe left to delete</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>👉</Text>
            <Text style={styles.featureText}>Swipe right to keep</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>👆</Text>
            <Text style={styles.featureText}>Swipe up to favorite</Text>
          </View>
        </View>

        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>📷 Photo Access Required</Text>
          <Text style={styles.permissionText}>
            CleanSwipe needs access to your photos to help you organize your gallery.
          </Text>
          <Text style={styles.permissionNote}>
            Your photos stay on your device. We never upload or share them.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isRequesting && styles.buttonDisabled]}
          onPress={requestPermission}
          disabled={isRequesting}
        >
          <Text style={styles.buttonText}>
            {isRequesting ? 'Requesting...' : 'Grant Photo Access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }}
        >
          <Text style={styles.settingsButtonText}>Open Settings Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 30,
    textAlign: 'center',
  },
  featureContainer: {
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  permissionBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionNote: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#666666',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  settingsButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
