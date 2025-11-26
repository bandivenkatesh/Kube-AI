// == USER DEFINED VARIABLES ==
// IMPORTANT: Update these values to match your specific environment
def K8S_DEPLOYMENT_NAME = "kube-ai"                  // The name of your K8s Deployment resource
def K8S_NAMESPACE = "app-namespace"                  // The target namespace for deployment
def REGISTRY_IMAGE = "venky2222/your-node-app"       // Docker Registry path (e.g., docker.io/username/repo)
def SONAR_PROJECT_KEY = "node-app-project-key"       // Key defined in SonarQube for this project
def SONAR_SERVER_NAME = "SonarQube-Server"           // Name used in Jenkins > Configure System
def DOCKER_AUTH_SECRET = "docker-auth-secret"        // K8s Secret name containing Docker credentials for Kaniko mount

// == PIPELINE DEFINITION ==
pipeline {
    // 1. Dynamic Agent Configuration (Launches a dedicated Pod on Kubernetes)
    agent {
        kubernetes {
            // Define the complete Pod spec with all required containers.
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  # 1. JNLP Container (REQUIRED: Handles communication back to the Jenkins Master)
  - name: jnlp
    image: jenkins/agent:latest-jdk17 
    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)', '\$(JENKINS_WEB_SOCKET)']
    resources:
      limits:
        memory: 256Mi
        cpu: 100m

  # 2. NODE Container (The primary container for running npm, tests, and Sonar Scanner)
  - name: node
    image: node:20-slim 
    command:
    - cat
    tty: true
    resources:
      limits:
        memory: 512Mi
        cpu: 500m
        
  # 3. KANIKO Container (For building and pushing the Docker image)
  - name: kaniko
    image: gcr.io/kaniko-project/executor:v1.9.0-debug
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
      
  volumes:
  - name: docker-config
    secret:
      # Mounts the K8s Secret containing Docker config.json for Kaniko auth
      secretName: ${DOCKER_AUTH_SECRET}
"""
        }
    }
    
    // Global environment variables
    environment {
        SONAR_PROJECT_KEY_ENV = "${SONAR_PROJECT_KEY}" 
        SONAR_SERVER_ENV = "${SONAR_SERVER_NAME}" 
        IMAGE_TAG = "${REGISTRY_IMAGE}:${BUILD_NUMBER}"
    }

    options {
        // Skip the default checkout to manage it explicitly in the first stage
        skipDefaultCheckout()
        // Set an overall timeout for the entire build
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Assuming 'github-credentials' is your Jenkins credential ID for GitHub PAT
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], 
                               extensions: [], 
                               userRemoteConfigs: [[credentialsId: 'github-credentials', 
                                                    url: 'https://github.com/bandivenkatesh/Kube-AI.git']]]
            }
        }
        
        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test & Sonar Analysis') {
            steps {
                container('node') {
                    sh 'npm test' 
                }
                // Use the server name configured in Manage Jenkins > Configure System
                withSonarQubeEnv(env.SONAR_SERVER_ENV) {
                    container('node') {
                        // Install Sonar Scanner globally inside the agent container
                        sh "npm install -g sonarqube-scanner" 
                        sh "sonar-scanner -Dsonar.projectKey=${env.SONAR_PROJECT_KEY_ENV} -Dsonar.sources=."
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    // Waits for SonarQube analysis result and fails the build if the Quality Gate fails
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                container('kaniko') { 
                    // Use a Jenkins credential ID to ensure environment variables are set (optional for Kaniko)
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                     passwordVariable: 'PASS', 
                                                     usernameVariable: 'USER')]) {
                        sh """
                          /kaniko/executor --context=\$(pwd) \
                            --dockerfile=Dockerfile \
                            --destination=${env.IMAGE_TAG}
                        """
                    }
                }
            }
        }
        
        stage('Deploy to K8s') {
            steps {
                // Use the Service Account token inherited by the agent for kubectl access
                sh "kubectl config use-service-account -n ${K8S_NAMESPACE}"
                
                // Set the new image tag on the deployment for rolling update
                sh "kubectl set image deployment/${K8S_DEPLOYMENT_NAME} node-app-container=${env.IMAGE_TAG} -n ${K8S_NAMESPACE}"
                
                // Wait for the new Pod to become ready before completing the stage
                sh "kubectl rollout status deployment/${K8S_DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}"
            }
        }
    }
}
