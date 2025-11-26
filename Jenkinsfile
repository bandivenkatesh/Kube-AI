def K8S_DEPLOYMENT_NAME = "node-app-deployment"
def K8S_NAMESPACE = "app-namespace" // The namespace with the deployment-manager RoleBinding
def REGISTRY_IMAGE = "your-registry/node-app" // e.g., docker.io/myuser/node-app

pipeline {
    agent {
        kubernetes {
            // Use the label defined in the Pod Template
            label 'node-app-agent' 
            // Define the Kaniko sidecar container for image building
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
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
      # This secret holds your Docker registry credentials for Kaniko
      secretName: docker-auth-secret 
"""
        }
    }
    
    environment {
        // SonarQube project key and options
        SONAR_PROJECT_KEY = "node-app-project-key" 
        SONAR_SERVER = "SonarQube-Server" // Name from Jenkins Configure System
    }

    stages {
        stage('Checkout & Install') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test & Sonar Analysis') {
            steps {
                container('node') {
                    sh 'npm test' // Ensure this command exits non-zero on failure
                }
                withSonarQubeEnv(env.SONAR_SERVER) {
                    container('node') {
                        // The SonarScanner needs the files
                        sh "npm install -g sonarqube-scanner"
                        sh "sonar-scanner -Dsonar.projectKey=${env.SONAR_PROJECT_KEY} -Dsonar.sources=."
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    // Wait for analysis result. abortPipeline: true stops the build on Quality Gate failure
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                     passwordVariable: 'PASS', 
                                                     usernameVariable: 'USER')]) {
                        // Build and push using Kaniko
                        sh """
                          /kaniko/executor --context=\$(pwd) \
                            --dockerfile=Dockerfile \
                            --destination=${REGISTRY_IMAGE}:${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
        
        stage('Deploy to K8s') {
            // The pipeline will use the Jenkins Service Account token to run kubectl
            steps {
                sh "kubectl config use-service-account -n ${K8S_NAMESPACE}" // Optional, but good practice
                sh "kubectl set image deployment/${K8S_DEPLOYMENT_NAME} node-app-container=${REGISTRY_IMAGE}:${BUILD_NUMBER} -n ${K8S_NAMESPACE}"
                sh "kubectl rollout status deployment/${K8S_DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}"
            }
        }
    }
}