# Quick Setup Guide

## Step 1: Install Dependencies

Since PowerShell script execution is restricted on your system, use one of these methods:

### Method 1: Enable PowerShell Scripts (Recommended)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:
```bash
npm install
```

### Method 2: Use Command Prompt
Open Command Prompt (cmd.exe) and navigate to the project folder:
```bash
cd c:\Users\alber\OneDrive\Desktop\vault\CascadeProjects\windsurf-project
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)
4. Go to **Project Settings** > **API**
5. Copy the following:
   - Project URL
   - anon/public key

## Step 3: Configure the App

1. Open `src/lib/supabase.ts`
2. Replace these lines:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
   With your actual Supabase credentials

## Step 4: Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from `database-setup.sql` (see below)
4. Click **Run**

### Database Setup SQL

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

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for files table
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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

## Step 5: Run the App

### Start Development Server
```bash
npm start
```

### Run on Android
```bash
npm run android
```

Make sure you have:
- Android Studio installed
- An Android emulator running OR
- A physical Android device connected with USB debugging enabled

### Run on iOS (macOS only)
```bash
npm run ios
```

## Troubleshooting

### "Cannot find module" errors
These are expected before running `npm install`. After installation, restart your IDE.

### Expo CLI not found
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

### Android build fails
1. Make sure Android Studio is installed
2. Set up Android SDK
3. Accept all Android licenses:
   ```bash
   cd %ANDROID_HOME%/tools/bin
   sdkmanager --licenses
   ```

### Biometric authentication not working
- Use a physical device (emulator support is limited)
- Ensure biometric authentication is set up on the device
- Grant the app necessary permissions

## Next Steps

1. Create an account in the app
2. Set up biometric authentication
3. Upload your first encrypted file
4. Explore the settings and features

## Important Security Notes

⚠️ **This is a demonstration project**. For production use:
- Implement actual AES-256 encryption (currently uses placeholder)
- Add comprehensive error handling
- Implement proper key rotation
- Add security auditing and logging
- Use environment variables for all sensitive data
- Add comprehensive testing

## Need Help?

Check the main README.md for more detailed information.
