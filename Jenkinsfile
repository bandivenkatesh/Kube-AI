// == USER DEFINED VARIABLES ==
def K8S_DEPLOYMENT_NAME = "your-app-deployment-name" // The name of your K8s Deployment resource
def K8S_NAMESPACE = "app-namespace"                 // The target namespace for deployment
def REGISTRY_IMAGE = "your-registry/your-node-app"   // e.g., docker.io/myuser/node-app
def SONAR_PROJECT_KEY = "node-app-project-key"      // Key defined in SonarQube
def SONAR_SERVER_NAME = "SonarQube-Server"          // Name used in Jenkins > Configure System
def DOCKER_AUTH_SECRET = "docker-auth-secret"       // K8s Secret name for Kaniko credentials

// == PIPELINE DEFINITION ==
pipeline {
    // 1. Dynamic Agent Configuration (Runs on Kubernetes)
    agent {
        kubernetes {
            // No 'label' is used here; the entire Pod is defined below.
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  # 1. JNLP Container (REQUIRED for agent-master handshake)
  - name: jnlp
    image: jenkins/jnlp-agent:latest-jdk17 
    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)', '\$(JENKINS_WEB_SOCKET)']
    resources:
      limits:
        memory: 256Mi
        cpu: 100m

  # 2. NODE Container (The primary build environment)
  - name: node
    image: node:20-slim 
    command:
    - cat
    tty: true
    resources:
      limits:
        memory: 512Mi
        cpu: 500m
        
  # 3. KANIKO Container (For building the Docker image securely)
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
      secretName: ${DOCKER_AUTH_SECRET}
"""
        }
    }
    
    // Environment variables for use throughout the pipeline
    environment {
        SONAR_PROJECT_KEY_ENV = "${SONAR_PROJECT_KEY}" 
        SONAR_SERVER_ENV = "${SONAR_SERVER_NAME}" 
        IMAGE_TAG = "${REGISTRY_IMAGE}:${BUILD_NUMBER}"
    }

    // Options to skip default checkout and set a timeout
    options {
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Assuming 'github-credentials' is your Jenkins ID for GitHub PAT
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], 
                               extensions: [], 
                               userRemoteConfigs: [[credentialsId: 'github-credentials', 
                                                    url: 'https://github.com/bandivenkatesh/Kube-AI.git']]]
            }
        }
        
        stage('Install Dependencies') {
            steps {
                container('node') { // Runs inside the Node container
                    sh 'npm install'
                }
            }
        }
        
        stage('Test & Sonar Analysis') {
            steps {
                container('node') {
                    sh 'npm test' 
                }
                withSonarQubeEnv(env.SONAR_SERVER_ENV) {
                    container('node') {
                        sh "npm install -g sonarqube-scanner" // Install scanner in the agent container
                        sh "sonar-scanner -Dsonar.projectKey=${env.SONAR_PROJECT_KEY_ENV} -Dsonar.sources=."
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    // Pipeline waits here. Fails build if Quality Gate fails.
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                container('kaniko') { // Runs inside the Kaniko container
                    // Assuming 'docker-registry-credentials' is your Jenkins ID for registry creds
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
                // The agent uses its Service Account token for kubectl authentication
                sh "kubectl config use-service-account -n ${K8S_NAMESPACE}"
                
                // Perform Rolling Update by setting the new image tag
                sh "kubectl set image deployment/${K8S_DEPLOYMENT_NAME} node-app-container=${env.IMAGE_TAG} -n ${K8S_NAMESPACE}"
                
                // Wait for the rollout to complete before marking the job successful
                sh "kubectl rollout status deployment/${K8S_DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}"
            }
        }
    }
}
