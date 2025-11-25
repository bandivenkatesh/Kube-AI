# 🚀 Quick Start Guide

## Server Status
✅ **Development Server**: http://localhost:5174

---

## 🎯 First Steps

### Option 1: Use Demo Account (Fastest)
```
1. Go to http://localhost:5174
2. Username: demo
3. Password: demo123
4. Click Login
5. Start generating projects!
```

### Option 2: Create Your Own Account
```
1. Go to http://localhost:5174
2. Click "Register" tab
3. Fill in:
   - Username: yourname
   - Email: you@example.com
   - Password: yourpassword (min 6 chars)
4. Click "Create Account"
5. You're logged in!
```

---

## ✨ What You Can Do Now

### 1. Generate Projects
- Describe your application
- Click "Generate Project"
- Get Kubernetes manifests, Dockerfiles, and explanations

### 2. Save & Access Chat History
- Every generation auto-saves
- See all projects in the left sidebar
- Click any to restore it
- Hover and click trash to delete

### 3. User Profile
- Your username shows in header
- Click logout icon to exit
- Session persists across refreshes

---

## 📊 Data Locations

All your data is stored locally:
- **Chats**: Browser localStorage
- **Account**: Browser localStorage
- **Status**: Check browser console (F12) for errors

---

## 🔧 Features Summary

| Feature | Status | How to Use |
|---------|--------|-----------|
| Register/Login | ✅ Done | Sidebar left panel |
| Generate Projects | ✅ Done | Input prompt, click button |
| Save Chat History | ✅ Done | Auto-saved on generation |
| View Past Chats | ✅ Done | Click in sidebar |
| Delete Chats | ✅ Done | Hover and click trash |
| Session Management | ✅ Done | Persists on refresh |
| Mobile Support | ✅ Done | Hamburger menu on mobile |

---

## 🎨 UI Layout

```
┌─────────────────────────────────────┐
│     Header (Logo + User Info)       │
├────────┬──────────────────────────┐
│        │                          │
│ Chat   │   Input Panel            │
│ History│   [Generate Button]      │
│ Sidebar│                          │
│        │   Output Display         │
│        │   (Tabs: Overview,       │
│        │    Manifests, Dockerfiles│
│        │    Explanations)         │
└────────┴──────────────────────────┘
```

---

## 🎓 Example Project

**Prompt:**
```
A microservices e-commerce app with:
- Node.js Express API backend
- React frontend
- PostgreSQL database
- Redis cache
```

**You'll Get:**
- 📄 **Architecture Overview**: High-level design
- 🐳 **Dockerfiles**: For each service
- ☸️ **Kubernetes Manifests**: Deployments, Services, etc.
- 📚 **Concept Explanations**: K8s concepts explained

---

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Generate | Ctrl+Enter (in input) |
| Copy Code | Hover code block, click copy |
| Logout | Click logout icon in header |

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | F12 → Console, check errors |
| Can't login | Create new account first |
| Chat not saving | Check browser localStorage enabled |
| Port 5174 instead of 5173 | Port 5173 in use, 5174 is alternate |

---

## 🔐 Security Note

This is a **demo application**. In production:
- ❌ Don't store passwords in plain text
- ❌ Don't use localStorage for sensitive data
- ✅ Use encrypted backend database
- ✅ Implement proper authentication (JWT, OAuth)

---

## 📚 Files Structure

```
components/
  ├── LoginScreen.tsx          ← Login/Register UI
  ├── ChatHistorySidebar.tsx   ← Chat history list
  └── Header.tsx              ← User info + logout

hooks/
  ├── useAuth.tsx             ← Authentication logic
  ├── useChatHistory.ts       ← Chat management
  └── useKubeGenerator.ts     ← AI generation

App.tsx                        ← Main component
types.ts                       ← Data types
```

---

## 🎯 Next Actions

1. **Try Demo Login** → username: `demo`, password: `demo123`
2. **Generate First Project** → Describe your app
3. **Check Chat History** → See saved projects in sidebar
4. **Explore Tabs** → View Architecture, Manifests, Dockerfiles
5. **Copy Code** → Use for your actual deployments

---

## 💡 Pro Tips

✅ Save complex prompts for frequently generated patterns  
✅ Use descriptive project names in prompts  
✅ Download code blocks for local use  
✅ Refresh page to restore chat history  
✅ Export generated configs for your CI/CD  

---

**Happy Kubernetes architecting! 🚀**

For detailed docs, see:
- `AUTH_IMPLEMENTATION.md` - Complete feature guide
- `LOGIN_GUIDE.md` - Visual implementation guide
