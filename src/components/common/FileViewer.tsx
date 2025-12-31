import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'react-native';

interface FileViewerProps {
  fileUri: string;
  fileName: string;
  mimeType: string;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ 
  fileUri, 
  fileName, 
  mimeType, 
  onClose 
}) => {
  const { colors } = useTheme();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    loadFileContent();
  }, [fileUri]);

  const getFileType = () => {
    if (mimeType.includes('image/')) return 'image';
    if (mimeType.includes('text/') || 
        fileName.endsWith('.txt') || 
        fileName.endsWith('.md') || 
        fileName.endsWith('.json') ||
        fileName.endsWith('.js') ||
        fileName.endsWith('.ts') ||
        fileName.endsWith('.tsx') ||
        fileName.endsWith('.jsx') ||
        fileName.endsWith('.css') ||
        fileName.endsWith('.html') ||
        fileName.endsWith('.xml') ||
        fileName.endsWith('.csv')) return 'text';
    if (mimeType.includes('application/pdf')) return 'pdf';
    if (mimeType.includes('video/')) return 'video';
    if (mimeType.includes('audio/')) return 'audio';
    return 'other';
  };

  const loadFileContent = async () => {
    try {
      setIsLoading(true);
      const fileType = getFileType();

      switch (fileType) {
        case 'text':
          const textContent = await FileSystem.readAsStringAsync(fileUri);
          setFileContent(textContent);
          break;
        case 'image':
          // For images, we'll use the file URI directly
          setFileContent(fileUri);
          break;
        default:
          setError(`File type "${fileType}" is not supported for in-app viewing`);
      }
    } catch (err) {
      console.error('Error loading file content:', err);
      setError('Failed to load file content');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileContent = () => {
    const fileType = getFileType();

    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.text }}>Loading file...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff4444" />
          <Text style={[styles.errorText, { color: "#ff4444" }]}>{error}</Text>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            This file type cannot be viewed in the app. You can download it to view with external apps.
          </Text>
        </View>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <ScrollView 
            style={styles.imageContainer}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: fileContent! }}
              style={[styles.image, { width: screenWidth - 40 }]}
              resizeMode="contain"
              onError={() => setError('Failed to load image')}
            />
          </ScrollView>
        );

      case 'text':
        const isCodeFile = fileName.endsWith('.js') || fileName.endsWith('.ts') || 
                          fileName.endsWith('.tsx') || fileName.endsWith('.jsx') ||
                          fileName.endsWith('.css') || fileName.endsWith('.html') ||
                          fileName.endsWith('.json');
        
        return (
          <ScrollView style={styles.textContainer}>
            <View style={[styles.codeContainer, { backgroundColor: isCodeFile ? '#1e1e1e' : 'transparent' }]}>
              <Text style={[
                styles.textContent, 
                { 
                  color: isCodeFile ? '#d4d4d4' : colors.text,
                  backgroundColor: isCodeFile ? '#1e1e1e' : 'transparent'
                }
              ]}>
                {fileContent}
              </Text>
            </View>
          </ScrollView>
        );

      default:
        return (
          <View style={styles.centerContainer}>
            <Ionicons name="document" size={48} color={colors.textSecondary} />
            <Text style={[styles.unsupportedText, { color: colors.text }]}>
              File type not supported for preview
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={[styles.fileType, { color: colors.textSecondary }]}>
            {getFileType().toUpperCase()} • {mimeType}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* File Content */}
      <View style={styles.content}>
        {renderFileContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  fileType: {
    fontSize: 12,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    padding: 20,
  },
  image: {
    height: 400,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  codeContainer: {
    borderRadius: 8,
    padding: 16,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  unsupportedText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
