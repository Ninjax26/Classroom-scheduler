# Google OAuth Setup Guide

Your React + TypeScript project now supports Google OAuth authentication in addition to email/password authentication.

## 🔐 **What's Been Added:**

### **1. Google OAuth Integration**
- ✅ **Google Sign-In Button**: Beautiful Google OAuth button on login page
- ✅ **OAuth Flow**: Complete Google authentication flow
- ✅ **User Data**: Automatic extraction of Google profile data
- ✅ **Session Management**: Seamless integration with existing auth system

### **2. UI Updates**
- ✅ **Login Page**: Added Google OAuth button with proper styling
- ✅ **Visual Separator**: Clean separation between OAuth and email auth
- ✅ **Google Icon**: Official Google logo and branding
- ✅ **Responsive Design**: Works on all screen sizes

## 🚀 **Setup Instructions:**

### **Step 1: Google Cloud Console Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a New Project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name: "Smart Classroom Auth" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Smart Classroom Web Client"

5. **Configure Authorized Redirect URIs**:
   - Add these URIs:
     ```
     http://localhost:8080
     https://yourdomain.com
     ```
   - Click "Create"

6. **Copy Credentials**:
   - Copy the **Client ID** and **Client Secret**
   - Keep these secure!

### **Step 2: Supabase Configuration**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select Your Project**: `opulmhukynaxyhvpjbge`
3. **Navigate to Authentication**:
   - Go to "Authentication" → "Providers"
   - Find "Google" and click "Enable"

4. **Configure Google Provider**:
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
   - **Redirect URL**: `https://opulmhukynaxyhvpjbge.supabase.co/auth/v1/callback`
   - **Scopes**: `openid,email,profile` (default)

5. **Save Configuration**:
   - Click "Save" to enable Google OAuth

### **Step 3: Update Environment Variables**

Add Google OAuth configuration to your `.env.local`:

```env
VITE_SUPABASE_URL=https://opulmhukynaxyhvpjbge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWxtaHVreW5heHlodnBqYmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDY2NzEsImV4cCI6MjA3MzAyMjY3MX0.dGwEbP2VfWZrOUyYvlADhiWPPFZTwHz4Z4-Kj2KaPWc

# Google OAuth (Optional - for additional configuration)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### **Step 4: Test the Integration**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to login page**:
   - Go to `http://localhost:8080`
   - You'll be redirected to `/login`

3. **Test Google OAuth**:
   - Click "Continue with Google"
   - You'll be redirected to Google's OAuth consent screen
   - Sign in with your Google account
   - You'll be redirected back to your app

## 🎯 **How It Works:**

### **1. User Flow**
1. **User clicks "Continue with Google"**
2. **Redirected to Google OAuth consent screen**
3. **User signs in with Google account**
4. **Google redirects back to Supabase**
5. **Supabase creates/updates user session**
6. **User is redirected to your app dashboard**

### **2. Data Extraction**
When users sign in with Google, Supabase automatically extracts:
- **Email**: `user.email`
- **Name**: `user.user_metadata.full_name`
- **Avatar**: `user.user_metadata.avatar_url`
- **Google ID**: `user.user_metadata.provider_id`

### **3. Profile Integration**
Google OAuth users get:
- **Automatic profile creation**
- **Google profile picture** (if available)
- **Name from Google account**
- **Email verification** (automatic)

## 🔧 **Customization Options:**

### **1. Additional Scopes**
To request more data from Google, update the OAuth configuration:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    scopes: 'openid email profile https://www.googleapis.com/auth/calendar.readonly'
  },
})
```

### **2. Custom Redirect URLs**
For production, update the redirect URLs in both:
- **Google Cloud Console**: Add your production domain
- **Supabase Dashboard**: Update the site URL

### **3. UI Customization**
Modify the Google button in `src/pages/auth/Login.tsx`:
- Change button text
- Modify styling
- Add loading states
- Customize the Google icon

## 🚨 **Important Security Notes:**

### **1. Environment Variables**
- **Never commit** `.env.local` to version control
- **Use different credentials** for development and production
- **Rotate secrets** regularly

### **2. Redirect URLs**
- **Always use HTTPS** in production
- **Validate redirect URLs** in Google Cloud Console
- **Test thoroughly** before going live

### **3. User Data**
- **Respect user privacy** - only request necessary data
- **Handle errors gracefully** - OAuth can fail
- **Provide fallback options** - keep email/password auth

## 🎉 **Ready to Use!**

Your application now supports:
- ✅ **Email/Password Authentication**
- ✅ **Google OAuth Authentication**
- ✅ **Seamless user experience**
- ✅ **Automatic profile creation**
- ✅ **Secure session management**

Users can now sign in with either:
1. **Email and password** (traditional method)
2. **Google account** (OAuth method)

Both methods provide the same access to your application features!

## 🔍 **Troubleshooting:**

### **Common Issues:**

1. **"Invalid redirect URI"**:
   - Check Google Cloud Console redirect URIs
   - Ensure exact match with your domain

2. **"Client ID not found"**:
   - Verify Google Client ID in Supabase
   - Check environment variables

3. **"Access denied"**:
   - Check Google+ API is enabled
   - Verify OAuth consent screen is configured

4. **"Redirect mismatch"**:
   - Update Supabase site URL
   - Check Google redirect URIs

### **Testing Checklist:**
- [ ] Google OAuth button appears on login page
- [ ] Clicking button redirects to Google
- [ ] Google consent screen shows correctly
- [ ] After sign-in, user returns to app
- [ ] User profile shows Google data
- [ ] User can sign out and sign back in

Your Google OAuth integration is now complete and ready for production use! 🚀







