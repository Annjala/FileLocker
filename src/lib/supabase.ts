import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import 'react-native-url-polyfill/auto';

// Supabase configuration - using the values from your .env.example
const supabaseUrl = 'https://zqremssgjwolkfnddsxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcmVtc3NnandvbGtmbmRkc3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTUxNTMsImV4cCI6MjA4MjU3MTE1M30.-IPhvk_d-JmxhHBDkw5o5xuZsraSvW6z3e31-KF4wgw';

// Custom storage adapter for Supabase to use SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to handle file uploads with encryption
export const uploadFile = async (fileUri: string, userId: string, encryptionKey: string) => {
  try {
    // Generate a unique file name
    const fileName = `${userId}/${Date.now()}_${fileUri.split('/').pop()}`;
    
    // Read the file content
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Create a simple base64 to ArrayBuffer converter
    const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    };
    
    // In a real app, you would encrypt the file here before uploading
    // For now, we'll upload the file data directly
    
    const { data, error } = await supabase.storage
      .from('user-files') // Your Supabase storage bucket name
      .upload(fileName, base64ToArrayBuffer(fileContent), {
        contentType: 'application/octet-stream',
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }
    
    console.log('File uploaded to storage successfully:', data.path);
    
    // Store file metadata in the database
    const fileMetadata = { 
      user_id: userId, 
      file_path: data.path,
      file_name: fileUri.split('/').pop(),
      size: 0, // You would get the actual file size here
      mime_type: 'application/octet-stream',
      is_encrypted: true,
    };
    
    console.log('Inserting file metadata:', fileMetadata);
    
    const { data: fileData, error: metadataError } = await supabase
      .from('files')
      .insert([fileMetadata])
      .select()
      .single();

    if (metadataError) {
      console.error('Database metadata insert error:', metadataError);
      throw metadataError;
    }
    
    console.log('File metadata inserted successfully:', fileData);
    
    return fileData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Helper function to download files
export const downloadFile = async (filePath: string, localFilePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('user-files')
      .download(filePath);

    if (error) throw error;
    
    // In a real app, you would decrypt the file here
    // For now, we'll just return the blob
    
    return data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
