
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
