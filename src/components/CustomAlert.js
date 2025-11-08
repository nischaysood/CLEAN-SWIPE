import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function CustomAlert({ visible, onClose, title, message, emoji = '✨', buttons = [], onCloseCallback }) {
  const handleClose = () => {
    onClose();
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          {/* Emoji */}
          <Text style={styles.emoji}>{emoji}</Text>
          
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Message */}
          <Text style={styles.message}>{message}</Text>
          
          {/* Buttons */}
          <View style={[styles.buttonContainer, buttons.length > 2 && styles.buttonContainerVertical]}>
            {buttons.length > 0 ? (
              buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === 'primary' && styles.buttonPrimary,
                    button.style === 'secondary' && styles.buttonSecondary,
                    button.style === 'danger' && styles.buttonDanger,
                    (buttons.length === 1 || buttons.length > 2) && styles.buttonFull,
                  ]}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === 'primary' && styles.buttonTextPrimary,
                      button.style === 'secondary' && styles.buttonTextSecondary,
                      button.style === 'danger' && styles.buttonTextDanger,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, styles.buttonFull]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    color: '#AAAAAA',
    fontSize: 24,
    fontWeight: '300',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  buttonContainerVertical: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  buttonDanger: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  buttonTextDanger: {
    color: '#FFFFFF',
  },
});
