

export interface GeneratedFile {
  fileName: string;
  content: string;
  description?: string;
}

export interface Explanation {
  concept: string;
  explanation: string;
}

export interface KubeProject {
  architectureOverview: string;
  kubernetesManifests: GeneratedFile[];
  dockerfiles: GeneratedFile[];
  explanations: Explanation[];
}

export interface ChatSession {
  id: string;
  userId: string;
  prompt: string;
  generatedData: KubeProject;
  createdAt: string;
  title: string;
  lastAccessedAt?: string;
  starred?: boolean;
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
