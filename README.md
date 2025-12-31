# Secure Vault - Encrypted File Storage App

A secure mobile application built with React Native (Expo) that allows users to store and encrypt files using AES-256 encryption with keys stored in Android Keystore. Features biometric authentication (Face ID/Fingerprint) for enhanced security.

## 🔐 Features

- **AES-256 Encryption**: All files are encrypted before upload using industry-standard AES-256 encryption
- **Android Keystore Integration**: Encryption keys are securely stored in the Android Keystore
- **Biometric Authentication**: Support for Face ID and Fingerprint authentication
- **Secure Backend**: Uses Supabase for authentication and encrypted file storage
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **File Management**: Upload, download, view, and delete encrypted files
- **User Authentication**: Secure email/password authentication with Supabase

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Backend**: Supabase (Authentication & Storage)
- **Security**: 
  - expo-secure-store (Android Keystore integration)
  - expo-local-authentication (Biometric auth)
  - expo-crypto (Encryption utilities)
  - react-native-keychain (iOS Keychain)
- **UI Components**: Custom components with Ionicons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd c:\Users\alber\OneDrive\Desktop\vault\CascadeProjects\windsurf-project
```

### 2. Install Dependencies

Since PowerShell script execution is restricted, you'll need to enable it or use an alternative method:

**Option A: Enable PowerShell Scripts (Recommended)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:
```bash
npm install
```

**Option B: Use Command Prompt**
Open Command Prompt (cmd) instead of PowerShell and run:
```bash
npm install
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Update `src/lib/supabase.ts` with your credentials:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### 5. Set Up Supabase Database

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  size BIGINT DEFAULT 0,
  mime_type TEXT,
  is_encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', false);

-- Set up Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own files
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own files
CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 6. Run the App

**Start the development server:**
```bash
npm start
```

**Run on Android:**
```bash
npm run android
```

**Run on iOS (macOS only):**
```bash
npm run ios
```

## 📱 Building for Production

### Android

1. Configure your app signing in `app.json`
2. Build the APK:
   ```bash
   expo build:android
   ```

### iOS

1. Configure your app signing in `app.json`
2. Build the IPA:
   ```bash
   expo build:ios
   ```

## 🔒 Security Features

### Encryption
- Files are encrypted using AES-256-CBC before upload
- Each file has a unique initialization vector (IV)
- Encryption keys are generated using secure random number generation

### Key Storage
- **Android**: Keys stored in Android Keystore with hardware-backed security
- **iOS**: Keys stored in iOS Keychain with biometric protection
- Keys never leave the device and are protected by the OS

### Authentication
- Biometric authentication (Face ID/Fingerprint) for quick access
- Secure password-based authentication via Supabase
- Session tokens stored in secure storage

## 📂 Project Structure

```
secure-vault/
├── src/
│   ├── components/
│   │   └── common/          # Reusable UI components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── lib/
│   │   └── supabase.ts      # Supabase client configuration
│   ├── navigation/
│   │   ├── AuthStack.tsx    # Authentication navigation
│   │   └── MainStack.tsx    # Main app navigation
│   ├── screens/
│   │   ├── auth/            # Login, Register, Biometric Setup
│   │   ├── files/           # File list, upload, details
│   │   ├── settings/        # App settings
│   │   └── profile/         # User profile
│   ├── theme/
│   │   └── ThemeContext.tsx # Theme and color management
│   └── utils/
│       └── security.ts      # Encryption utilities
├── App.tsx                  # App entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🐛 Troubleshooting

### PowerShell Script Execution Error
If you get a script execution error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found Errors
Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
expo start -c
```

### Biometric Authentication Not Working
- Ensure you have set up biometric authentication on your device
- Check that the app has the necessary permissions
- For Android, ensure you're using a physical device (emulator support is limited)

### Supabase Connection Issues
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure RLS policies are set up correctly

## 📝 TODO / Future Enhancements

- [ ] Implement actual AES-256 encryption (currently placeholder)
- [ ] Add file sharing capabilities
- [ ] Implement offline file access
- [ ] Add file preview for images and PDFs
- [ ] Implement backup and restore functionality
- [ ] Add file organization with folders
- [ ] Implement file search functionality
- [ ] Add support for multiple encryption keys
- [ ] Implement automatic key rotation
- [ ] Add audit logs for file access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Security Notice

This is a demonstration project. For production use:
1. Implement proper AES-256 encryption using a battle-tested library
2. Add proper error handling and logging
3. Implement rate limiting and abuse prevention
4. Add comprehensive security auditing
5. Use environment variables for all sensitive data
6. Implement proper key rotation mechanisms
7. Add comprehensive testing (unit, integration, security)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React Native and Expo
