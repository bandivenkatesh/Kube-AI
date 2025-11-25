
import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { KubeProject } from '../types.ts';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Please set VITE_API_KEY in .env file.");
}

// Use regular GoogleGenAI without vertexai (vertexai is not supported in browser)
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    architectureOverview: {
      type: Type.STRING,
      description: "A concise, high-level overview of the application architecture and deployment strategy. Explain how the services interact.",
    },
    kubernetesManifests: {
      type: Type.ARRAY,
      description: "An array of Kubernetes YAML manifest files.",
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: {
            type: Type.STRING,
            description: "The suggested filename for the manifest, e.g., 'frontend-deployment.yaml'.",
          },
          content: {
            type: Type.STRING,
            description: "The full YAML content of the Kubernetes manifest.",
          },
          description: {
            type: Type.STRING,
            description: "A brief one-sentence explanation of this manifest's purpose."
          }
        },
        required: ["fileName", "content", "description"],
      },
    },
    dockerfiles: {
      type: Type.ARRAY,
      description: "An array of Dockerfiles for each microservice.",
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: {
            type: Type.STRING,
            description: "The suggested filename, e.g., 'frontend/Dockerfile'.",
          },
          content: {
            type: Type.STRING,
            description: "The full content of the Dockerfile.",
          },
           description: {
            type: Type.STRING,
            description: "A brief one-sentence explanation of this Dockerfile's purpose."
          }
        },
        required: ["fileName", "content", "description"],
      },
    },
    explanations: {
      type: Type.ARRAY,
      description: "An array of explanations for key Kubernetes concepts used.",
      items: {
        type: Type.OBJECT,
        properties: {
          concept: {
            type: Type.STRING,
            description: "The name of the Kubernetes concept, e.g., 'Deployment', 'Service', 'Ingress'.",
          },
          explanation: {
            type: Type.STRING,
            description: "A detailed but easy-to-understand explanation of the concept and its role in this project.",
          },
        },
        required: ["concept", "explanation"],
      },
    },
  },
  required: ["architectureOverview", "kubernetesManifests", "dockerfiles", "explanations"],
};


export const useKubeGenerator = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateKubeProject = useCallback(async (prompt: string): Promise<KubeProject | null> => {
    setIsLoading(true);
    setError(null);

    if (!API_KEY) {
      setError("API key is not configured. Please set VITE_API_KEY in .env file and restart the server.");
      setIsLoading(false);
      return null;
    }

    if (!ai) {
      setError("AI client failed to initialize. Please check your API key.");
      setIsLoading(false);
      return null;
    }

    try {
      const systemInstruction = `You are KubeArchitect AI, an expert Kubernetes and DevOps engineer. Your task is to generate a complete set of configuration files for deploying a web application on Kubernetes based on a user's description.
      - You must provide placeholder Dockerfiles for each service.
      - You must provide Kubernetes YAML manifests (Deployments, Services, and Ingress if applicable). For stateful services like databases, include a PersistentVolumeClaim and a StatefulSet. For configuration, use ConfigMaps. For secrets, use Secrets with placeholder base64 encoded values (e.g., 'dXNlcg==', 'cGFzc3dvcmQ=').
      - Provide a high-level architectural overview.
      - Provide detailed explanations of the core Kubernetes concepts used.
      - Ensure all generated code is valid and follows best practices.
      - The final output must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json in your response.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: prompt }] },
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2,
        },
      });
      
      const jsonString = result.text;
      const parsedData: KubeProject = JSON.parse(jsonString);
      
      return parsedData;

    } catch (e: any) {
      console.error("Error generating Kubernetes project:", e);
      setError(e.message || "An unknown error occurred.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateKubeProject, isLoading, error };
};
