pipeline {
  agent any
  parameters {
    string(name: 'GIT_REPO', defaultValue: 'https://github.com/parii-star/MyFirstProject.git', description: 'Git repository URL to checkout (HTTPS)')
    string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Branch to build')
    string(name: 'GIT_CREDENTIALS', defaultValue: '', description: 'Jenkins credentials ID for Git (leave empty for public repos)')
  }
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }
  environment {
    COMPOSE_PROJECT_NAME = "myfirstproject_${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps {
        script {
          if (params.GIT_CREDENTIALS?.trim()) {
            checkout([$class: 'GitSCM', branches: [[name: params.GIT_BRANCH]], doGenerateSubmoduleConfigurations: false, extensions: [], userRemoteConfigs: [[url: params.GIT_REPO, credentialsId: params.GIT_CREDENTIALS]]])
          } else {
            git branch: params.GIT_BRANCH, url: params.GIT_REPO
          }
        }
      }
    }

    stage('Build images') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose build --pull --no-cache'
          } else {
            bat 'docker-compose build --pull --no-cache'
          }
        }
      }
    }

    stage('Start services') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose up -d'
            sh 'sleep 10'
            sh 'docker-compose ps'
          } else {
            bat 'docker-compose up -d'
            bat 'powershell -Command "Start-Sleep -s 10"'
            bat 'docker-compose ps'
          }
        }
      }
    }

    stage('Smoke test') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              echo "Checking frontend on http://localhost:3000"
              if curl -sSf http://localhost:3000 > /dev/null; then echo "frontend OK"; else echo "frontend failed"; exit 1; fi
            '''
          } else {
            bat 'powershell -Command "try { Invoke-WebRequest -UseBasicParsing -Uri http://localhost:3000 -TimeoutSec 10; Write-Host \"frontend OK\" } catch { Write-Error \"frontend failed\"; exit 1 }"'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        if (isUnix()) {
          sh 'docker-compose logs --no-color --tail=200 > jenkins-docker-logs.txt || true'
          archiveArtifacts artifacts: 'jenkins-docker-logs.txt', fingerprint: true
          sh 'docker-compose down -v'
        } else {
          bat 'docker-compose logs --tail=200 > jenkins-docker-logs.txt || exit 0'
          archiveArtifacts artifacts: 'jenkins-docker-logs.txt', fingerprint: true
          bat 'docker-compose down -v'
        }
      }
    }
    success {
      echo 'Pipeline succeeded.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
