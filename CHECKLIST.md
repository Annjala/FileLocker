# Secure Vault - Setup Checklist

Use this checklist to ensure you've completed all necessary setup steps.

## ☐ Phase 1: Initial Setup

### Environment Setup
- [ ] Node.js installed (v16+)
- [ ] npm or yarn installed
- [ ] Android Studio installed (for Android development)
- [ ] Xcode installed (for iOS development, macOS only)

### PowerShell Configuration (Windows)
- [ ] PowerShell execution policy enabled:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
  OR
- [ ] Using Command Prompt instead of PowerShell

## ☐ Phase 2: Install Dependencies

- [ ] Navigate to project directory
- [ ] Run `npm install` or use `install.bat`
- [ ] Wait for all dependencies to install
- [ ] Verify no critical errors in installation

## ☐ Phase 3: Supabase Setup

### Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create account (if needed)
- [ ] Click "New Project"
- [ ] Choose organization
- [ ] Enter project name: "secure-vault" (or your choice)
- [ ] Enter database password (save this!)
- [ ] Select region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait for project to be ready (~2 minutes)

### Get API Credentials
- [ ] Go to Project Settings (gear icon)
- [ ] Click "API" in sidebar
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Save these credentials securely

### Configure App
- [ ] Open `src/lib/supabase.ts`
- [ ] Replace `YOUR_SUPABASE_URL` with your Project URL
- [ ] Replace `YOUR_SUPABASE_ANON_KEY` with your anon key
- [ ] Save the file

## ☐ Phase 4: Database Setup

### Run SQL Setup
- [ ] In Supabase Dashboard, click "SQL Editor"
- [ ] Click "New Query"
- [ ] Open `database-setup.sql` from project
- [ ] Copy all SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Verify "Database setup completed successfully!" message

### Verify Database
- [ ] Click "Table Editor" in Supabase
- [ ] Verify "files" table exists
- [ ] Click "Storage" in Supabase
- [ ] Verify "user-files" bucket exists

## ☐ Phase 5: Development Environment

### Android Setup (if developing for Android)
- [ ] Android Studio installed
- [ ] Android SDK installed
- [ ] Android Virtual Device (AVD) created OR
- [ ] Physical Android device connected
- [ ] USB debugging enabled on device
- [ ] Device authorized for debugging

### iOS Setup (if developing for iOS - macOS only)
- [ ] Xcode installed
- [ ] Xcode Command Line Tools installed
- [ ] iOS Simulator available
- [ ] CocoaPods installed

## ☐ Phase 6: Run the App

### Start Development Server
- [ ] Open terminal in project directory
- [ ] Run `npm start`
- [ ] Wait for Metro bundler to start
- [ ] QR code appears in terminal
- [ ] No critical errors shown

### Launch on Device
Choose one:

**Option A: Android**
- [ ] Run `npm run android`
- [ ] App builds successfully
- [ ] App launches on device/emulator
- [ ] No crash on launch

**Option B: iOS (macOS only)**
- [ ] Run `npm run ios`
- [ ] App builds successfully
- [ ] App launches on simulator
- [ ] No crash on launch

**Option C: Expo Go**
- [ ] Install Expo Go app on phone
- [ ] Scan QR code from terminal
- [ ] App loads in Expo Go
- [ ] No crash on launch

## ☐ Phase 7: Test Core Features

### Authentication
- [ ] App shows login screen
- [ ] Click "Sign Up"
- [ ] Enter test email and password
- [ ] Accept terms and conditions
- [ ] Click "Create Account"
- [ ] Account created successfully
- [ ] Redirected to biometric setup (optional)

### Biometric Setup (Optional)
- [ ] Biometric setup screen appears
- [ ] Click "Enable [Biometric Type]"
- [ ] Device prompts for biometric
- [ ] Biometric registered successfully
- [ ] Redirected to main app

### File Upload
- [ ] Navigate to "Upload" tab
- [ ] Click "Tap to Select File"
- [ ] File picker opens
- [ ] Select a test file
- [ ] File appears in preview
- [ ] Click "Upload & Encrypt"
- [ ] Upload completes successfully
- [ ] Success message shown

### File List
- [ ] Navigate to "Files" tab
- [ ] Uploaded file appears in list
- [ ] File shows encryption badge
- [ ] File size displayed correctly
- [ ] Click on file
- [ ] File details screen opens

### Settings
- [ ] Navigate to "Settings" tab
- [ ] All settings sections visible
- [ ] Toggle dark mode works
- [ ] Biometric toggle works
- [ ] Sign out works

## ☐ Phase 8: Verify Security Features

### Encryption Key Storage
- [ ] Close and reopen app
- [ ] Keys persist across sessions
- [ ] No errors accessing keys

### Biometric Authentication
- [ ] Enable biometric in settings
- [ ] Close app completely
- [ ] Reopen app
- [ ] Biometric prompt appears
- [ ] Authentication works

### Data Persistence
- [ ] Upload a file
- [ ] Close app completely
- [ ] Reopen app
- [ ] File still appears in list
- [ ] File details accessible

## ☐ Phase 9: Production Preparation (When Ready)

### Security Enhancements
- [ ] Implement actual AES-256 encryption
- [ ] Replace placeholder encryption code
- [ ] Add proper error handling
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Implement certificate pinning

### Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform security testing
- [ ] Test on multiple devices
- [ ] Test edge cases

### Environment Variables
- [ ] Move secrets to environment variables
- [ ] Set up different configs for dev/prod
- [ ] Never commit secrets to git

### App Store Preparation
- [ ] Create app icons (all sizes)
- [ ] Create splash screens
- [ ] Write app description
- [ ] Take screenshots
- [ ] Prepare privacy policy
- [ ] Prepare terms of service

## 📝 Notes Section

Use this space to track issues or customizations:

```
Date: _____________
Issue/Note: _______________________________________________
Resolution: _______________________________________________

Date: _____________
Issue/Note: _______________________________________________
Resolution: _______________________________________________

Date: _____________
Issue/Note: _______________________________________________
Resolution: _______________________________________________
```

## ✅ Final Verification

- [ ] All core features working
- [ ] No critical bugs
- [ ] App doesn't crash
- [ ] Files upload successfully
- [ ] Files download successfully
- [ ] Authentication works
- [ ] Biometrics work (if enabled)
- [ ] Dark mode works
- [ ] Settings persist

## 🎉 Setup Complete!

If all items are checked, your Secure Vault app is ready for development!

---

**Need Help?**
- Check README.md for detailed documentation
- Check SETUP.md for setup instructions
- Check PROJECT_SUMMARY.md for project overview
- Review code comments for implementation details

**Common Issues:**
- Module not found → Run `npm install`
- Supabase errors → Check credentials in `src/lib/supabase.ts`
- Build errors → Check Android Studio / Xcode setup
- Biometric not working → Use physical device, not emulator
