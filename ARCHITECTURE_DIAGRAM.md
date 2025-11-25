# 📋 Implementation Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER                                  │
│                   (localStorage)                                │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴──────────┐
                    │                    │
        ┌───────────▼────────┐  ┌────────▼──────────┐
        │  AuthProvider      │  │  Chat History     │
        │  Context           │  │  Management       │
        │                    │  │                   │
        │ • user state       │  │ • Save chat       │
        │ • login/logout     │  │ • Get history     │
        │ • register         │  │ • Delete chat     │
        └───────────┬────────┘  └────────┬──────────┘
                    │                    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   App.tsx          │
                    │                    │
                    │ Orchestrates all   │
                    │ components         │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼────┐          ┌────▼────┐          ┌───▼────┐
    │ Header │          │ Input   │          │Output  │
    │        │          │ Panel   │          │Display │
    │ • User │          │ • Prompt│          │ • Tabs │
    │ • Info │          │ • Button│          │ • Code │
    │ • Logout          └────┬────┘          └───┬────┘
    └────┬───┘               │                   │
         │                   │                   │
         │         ┌─────────▼──────────┐        │
         │         │ useKubeGenerator   │        │
         │         │                    │        │
         │         │ AI API Call        │        │
         │         └─────────┬──────────┘        │
         │                   │                   │
         │         ┌─────────▼──────────┐        │
         │         │ Gemini API         │        │
         │         │ Response           │        │
         │         └────────────────────┘        │
         │                                       │
         └───────────────────────────────────────┘
                     Connected via:
              useAuth, useChatHistory hooks
```

## Component Hierarchy

```
index.tsx
  └── AuthProvider
      └── App.tsx
          ├── Header (useAuth)
          ├── ChatHistorySidebar (useChatHistory)
          ├── InputPanel
          │   └── useKubeGenerator
          ├── OutputDisplay
          └── LoginScreen (if not authenticated)
              └── useAuth
```

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│                   USER LOGIN/REGISTER                 │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Validate Input      │
          │  • Email format      │
          │  • Password length   │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Check localStorage  │
          │  kube_ai_users       │
          └──────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼──────┐
    │ User     │          │ New User   │
    │ Exists   │          │ Register   │
    └────┬─────┘          └─────┬──────┘
         │                      │
    ┌────▼──────────┐      ┌────▼───────────┐
    │ Verify        │      │ Store to       │
    │ Password      │      │ localStorage   │
    └────┬──────────┘      └────┬───────────┘
         │                      │
         └───────────┬──────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Set Current User in  │
          │ localStorage         │
          │ kube_ai_user         │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ AuthContext Updated  │
          │ All components       │
          │ re-render            │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Show Main App        │
          │ (Sidebar, Input...)  │
          └──────────────────────┘
```

## Chat Generation Flow

```
┌──────────────────────────────────────┐
│  User Enters Prompt                  │
│  Clicks "Generate Project"           │
└──────────────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ validateKubeGenerator│
        │ • Call Gemini API    │
        │ • Send prompt        │
        │ • AI processes       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Parse Response       │
        │ JSON from API        │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ useChatHistory       │
        │ .saveChat()          │
        │                      │
        │ Generates:           │
        │ • chat.id            │
        │ • chat.title         │
        │ • Timestamp          │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Store to             │
        │ localStorage:        │
        │ kube_ai_chats_[id]   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Display Output       │
        │ Show in tabs:        │
        │ • Overview           │
        │ • Manifests          │
        │ • Dockerfiles        │
        │ • Explanations       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Show in Sidebar      │
        │ Click to restore     │
        │ any time             │
        └──────────────────────┘
```

## LocalStorage Structure

```
Browser LocalStorage
│
├── kube_ai_users
│   └── [
│       { id, username, email, password, createdAt },
│       { id, username, email, password, createdAt }
│     ]
│
├── kube_ai_user (Current)
│   └── { id, username, email, createdAt }
│
├── kube_ai_chats_1234567890 (User 1)
│   └── [
│       { id, userId, prompt, generatedData, createdAt, title },
│       { id, userId, prompt, generatedData, createdAt, title }
│     ]
│
└── kube_ai_chats_0987654321 (User 2)
    └── [
        { id, userId, prompt, generatedData, createdAt, title },
        ...
      ]
```

## State Management

```
┌─────────────────────────────────────────┐
│         AuthContext (Global)            │
│                                         │
│ user: User | null                       │
│ isLoading: boolean                      │
│ login: (user, pass) => Promise          │
│ register: (user, email, pass) => Promise│
│ logout: () => void                      │
└──────────────┬──────────────────────────┘
               │
               ├─────────────────────────────┐
               │                             │
        ┌──────▼──────┐          ┌──────────▼────┐
        │ App State    │          │ Component     │
        │              │          │ State         │
        │ • prompt     │          │               │
        │ • generated  │          │ • sidebarOpen│
        │ • chatId     │          │ • loading    │
        └──────────────┘          │ • error      │
                                  └──────────────┘
```

## Mobile Responsive Layout

```
Desktop (1024px+)
┌──────┬──────────────────────────────┐
│      │                              │
│ Side │      Main Content            │
│ bar  │                              │
│      │                              │
│      ├──────────────┬──────────────┐│
│      │ Input Panel  │ Output Displ.││
│      │              │              ││
│      └──────────────┴──────────────┘│
└──────┴──────────────────────────────┘

Mobile (< 1024px)
┌─────────────────────────────┐
│ ☰ Header (User, Logout)    │
├─────────────────────────────┤
│                             │
│      Main Content           │
│                             │
│  ┌──────────────────────┐   │
│  │ Input Panel          │   │
│  ├──────────────────────┤   │
│  │ Output Display       │   │
│  │                      │   │
│  └──────────────────────┘   │
│                             │
│  [Sidebar overlays when ☰]  │
└─────────────────────────────┘
```

## API Integration

```
Kube-AI App (Browser)
        │
        │ HTTPS Request
        ▼
┌──────────────────────┐
│ Gemini API           │
│ (Google)             │
│                      │
│ • Endpoint: models/  │
│   generateContent    │
│ • Model: gemini-2.5- │
│   flash              │
│ • Auth: VITE_API_KEY │
└──────────┬───────────┘
           │
           │ JSON Response
           │ {
           │   architectureOverview,
           │   kubernetesManifests[],
           │   dockerfiles[],
           │   explanations[]
           │ }
           ▼
    Parse & Display
```

## Security Layer (Current Dev)

```
⚠️  DEVELOPMENT ONLY - NOT FOR PRODUCTION

┌────────────────────────────────────┐
│  User Input                        │
└───────────────┬────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Basic Validation│
        │ • Email regex  │
        │ • Length check │
        │ • Required     │
        └───────┬────────┘
                │
                ▼
        ┌───────────────┐
        │ LocalStorage  │
        │ (No encryption)
        │ ⚠️  UNSAFE    │
        └───────┬────────┘
                │
                ▼
        ┌───────────────┐
        │ Compare       │
        │ (Plain text)  │
        │ ⚠️  UNSAFE    │
        └───────────────┘

✅ PRODUCTION IMPROVEMENTS NEEDED:
   • bcrypt password hashing
   • JWT token authentication
   • HTTPS encryption
   • Backend validation
   • Database encryption
   • Rate limiting
   • Input sanitization
```

This architecture ensures clean separation of concerns, easy maintenance, and scalability!
