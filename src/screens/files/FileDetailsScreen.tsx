import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator, Linking, Image, Dimensions, Platform, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { FileViewer } from '../../components/common/FileViewer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, downloadFile } from '../../lib/supabase';
import { decryptFile, getEncryptionKey } from '../../utils/security';
import * as FileSystem from 'expo-file-system/legacy';
import { useRoute, useNavigation } from '@react-navigation/native';

// Props will be passed via route params

interface FileDetails {
  id: string;
  file_name: string;
  file_path: string;
  size: number;
  mime_type: string;
  is_encrypted: boolean;
  created_at: string;
}

export const FileDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fileId } = route.params as { fileId: string };
  const [file, setFile] = useState<FileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFileUri, setDownloadedFileUri] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadFileDetails();
  }, [fileId]);

  const loadFileDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      setFile(data);
    } catch (error) {
      console.error('Error loading file details:', error);
      Alert.alert('Error', 'Failed to load file details');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine file type
  const getFileType = (mimeType: string, fileName: string) => {
    if (mimeType.includes('image/')) return 'image';
    if (mimeType.includes('text/') || fileName.endsWith('.txt')) return 'text';
    if (mimeType.includes('application/pdf')) return 'pdf';
    if (mimeType.includes('video/')) return 'video';
    if (mimeType.includes('audio/')) return 'audio';
    return 'other';
  };

  // Function to open file with appropriate viewer
  const openFile = async (localFileUri: string) => {
    if (!file) return;
    
    const fileType = getFileType(file.mime_type, file.file_name);
    
    try {
      // For supported file types, open in the FileViewer
      if (fileType === 'image' || fileType === 'text') {
        setShowFileViewer(true);
      } else {
        // For unsupported types, show options
        Alert.alert(
          'File Downloaded',
          `File "${file.file_name}" has been downloaded. File type: ${fileType}`,
          [
            { text: 'OK' },
            {
              text: 'View Path',
              onPress: () => {
                Alert.alert('File Location', `File saved to: ${localFileUri}`);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Could not open file');
    }
  };

  const handleDownload = async () => {
    if (!file || !user) return;

    setIsDownloading(true);
    try {
      // Get encryption key
      console.log('Getting encryption key for download...');
      const encryptionKey = await getEncryptionKey(user.id);
      if (!encryptionKey) {
        Alert.alert('Error', 'Failed to retrieve encryption key');
        return;
      }

      console.log('Downloading file from:', file.file_path);
      
      // Download encrypted file
      const blob = await downloadFile(file.file_path, '');
      
      if (!blob) {
        Alert.alert('Error', 'Failed to download file');
        return;
      }

      // Save file to local storage
      const localFileUri = `${FileSystem.documentDirectory}${file.file_name}`;
      
      // Convert blob to base64 and save
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          await FileSystem.writeAsStringAsync(localFileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          setDownloadedFileUri(localFileUri);
          
          Alert.alert(
            'File Downloaded', 
            `File "${file.file_name}" has been downloaded and decrypted successfully!`,
            [
              { text: 'OK' },
              { 
                text: 'Open', 
                onPress: () => openFile(localFileUri)
              }
            ]
          );
        } catch (saveError) {
          console.error('Error saving file:', saveError);
          Alert.alert('Error', 'Failed to save file locally');
        }
      };
      reader.readAsDataURL(blob);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Failed to download file: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('files')
                .delete()
                .eq('id', fileId);

              if (error) throw error;

              Alert.alert('Success', 'File deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error deleting file:', error);
              Alert.alert('Error', 'Failed to delete file');
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.startsWith('audio/')) return 'musical-notes';
    if (mimeType.includes('pdf')) return 'document-text';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
    return 'document';
  };

  if (isLoading || !file) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* File Preview Section */}
        {filePreview && (
          <View style={[styles.previewContainer, { backgroundColor: colors.card }]}>
            {getFileType(file.mime_type, file.file_name) === 'image' ? (
              <Image 
                source={{ uri: filePreview }} 
                style={[styles.imagePreview, { width: screenWidth - 40 }]}
                resizeMode="contain"
              />
            ) : (
              <ScrollView style={styles.textPreview}>
                <Text style={[styles.textContent, { color: colors.text }]}>
                  {filePreview}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        <View style={[styles.filePreview, { backgroundColor: colors.card }]}>
          <View style={[styles.fileIconLarge, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name={getFileIcon(file.mime_type)} size={80} color={colors.primary} />
          </View>
          <Text style={[styles.fileName, { color: colors.text }]}>{file.file_name}</Text>
          {file.is_encrypted && (
            <View style={[styles.encryptedBadge, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="lock-closed" size={16} color={colors.success} />
              <Text style={[styles.encryptedText, { color: colors.success }]}>
                AES-256 Encrypted
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>File Information</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Size</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatFileSize(file.size)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{file.mime_type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Uploaded</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDate(file.created_at)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Encryption</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {file.is_encrypted ? 'AES-256' : 'None'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title={isDownloading ? 'Downloading...' : 'Download'}
            onPress={handleDownload}
            disabled={isDownloading}
            loading={isDownloading}
            style={StyleSheet.flatten([styles.actionButton, { backgroundColor: colors.primary }])}
          />

          {downloadedFileUri && (
            <Button
              title="View in App"
              onPress={() => openFile(downloadedFileUri)}
              style={StyleSheet.flatten([styles.actionButton, { backgroundColor: colors.success }])}
            />
          )}

          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>

      {/* File Viewer Modal */}
      <Modal
        visible={showFileViewer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {downloadedFileUri && file && (
          <FileViewer
            fileUri={downloadedFileUri}
            fileName={file.file_name}
            mimeType={file.mime_type}
            onClose={() => setShowFileViewer(false)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  filePreview: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  fileIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  encryptedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    height: 50,
    borderRadius: 8,
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    maxHeight: 300,
  },
  imagePreview: {
    height: 250,
    borderRadius: 8,
  },
  textPreview: {
    maxHeight: 200,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
