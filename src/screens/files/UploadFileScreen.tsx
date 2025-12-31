import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { encryptFile, getEncryptionKey, hasEncryptionKey } from '../../utils/security';
import { uploadFile } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export const UploadFileScreen = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { colors } = useTheme();
  const { user, setupBiometricAuth } = useAuth();
  const navigation = useNavigation();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // First check if encryption key exists
      console.log('Checking if encryption key exists for user:', user.id);
      const keyExists = await hasEncryptionKey(user.id);
      console.log('Encryption key exists:', keyExists);
      
      if (!keyExists) {
        Alert.alert(
          'Biometric Setup Required', 
          'You need to set up biometric authentication first to encrypt your files.',
          [
            { text: 'Cancel' },
            { 
              text: 'Setup Now', 
              onPress: async () => {
                console.log('User wants to setup biometrics - starting setup process');
                const success = await setupBiometricAuth();
                if (success) {
                  Alert.alert('Success', 'Biometric authentication set up successfully!');
                } else {
                  Alert.alert('Error', 'Failed to set up biometric authentication');
                }
              }
            }
          ]
        );
        return;
      }

      // Get the encryption key
      console.log('Attempting to get encryption key for user:', user.id);
      const encryptionKey = await getEncryptionKey(user.id);
      console.log('Encryption key retrieved:', encryptionKey ? 'SUCCESS' : 'FAILED');
      
      if (!encryptionKey) {
        Alert.alert(
          'Authentication Failed', 
          'Failed to authenticate. Please try again or check your biometric settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Encrypt the file
      setUploadProgress(25);
      const { encryptedData, iv } = await encryptFile(selectedFile.uri, encryptionKey);

      // Upload the encrypted file
      setUploadProgress(50);
      await uploadFile(selectedFile.uri, user.id, encryptionKey);

      setUploadProgress(100);
      Alert.alert('Success', 'File uploaded and encrypted successfully!', [
        {
          text: 'View Files',
          onPress: () => {
            setSelectedFile(null);
            setUploadProgress(0);
            // Navigate back to file list to see the uploaded file
            navigation.goBack();
          },
        },
        {
          text: 'Upload Another',
          onPress: () => {
            setSelectedFile(null);
            setUploadProgress(0);
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return 'document';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.startsWith('audio/')) return 'musical-notes';
    if (mimeType.includes('pdf')) return 'document-text';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
    return 'document';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Upload File</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
            onPress={pickDocument}
            disabled={isUploading}
          >
            <Ionicons name="cloud-upload-outline" size={60} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
              Tap to Select File
            </Text>
            <Text style={[styles.uploadButtonSubtext, { color: colors.textSecondary }]}>
              All files will be encrypted with AES-256
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={[styles.selectedFileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.selectedFileHeader}>
                <View style={[styles.fileIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={getFileIcon(selectedFile.mimeType)} size={32} color={colors.primary} />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <Ionicons name="close-circle" size={24} color={colors.danger} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.selectedFileName, { color: colors.text }]} numberOfLines={2}>
                {selectedFile.name}
              </Text>

              <View style={styles.fileDetails}>
                <View style={styles.fileDetailItem}>
                  <Ionicons name="document-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.fileDetailText, { color: colors.textSecondary }]}>
                    {selectedFile.size ? formatFileSize(selectedFile.size) : 'Unknown size'}
                  </Text>
                </View>
                <View style={styles.fileDetailItem}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.success} />
                  <Text style={[styles.fileDetailText, { color: colors.success }]}>
                    Will be encrypted
                  </Text>
                </View>
              </View>

              {isUploading && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${uploadProgress}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {uploadProgress}% Uploaded
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="information-circle" size={24} color={colors.info} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Secure Upload</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Your files are encrypted with AES-256 before upload. Only you can decrypt them with your secure key.
              </Text>
            </View>
          </View>
        </View>

        {selectedFile && (
          <View style={styles.buttonContainer}>
            <Button
              title={isUploading ? 'Uploading...' : 'Upload & Encrypt'}
              onPress={handleUpload}
              disabled={isUploading}
              loading={isUploading}
              style={[styles.uploadActionButton, { backgroundColor: colors.primary }]}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedFileCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedFileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    padding: 4,
  },
  selectedFileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  fileDetails: {
    gap: 8,
  },
  fileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileDetailText: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  uploadActionButton: {
    height: 50,
    borderRadius: 8,
  },
});
