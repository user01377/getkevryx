# Overview Of Project

**getkevryx** is a full-stack e-commerce app themed around a premium, modern, outdoor apparel brand. The app provides a complete online shopping experience including product browsing, order placement, order tracking, and a responsive user-interface.

Rather than focusing solely on frontend and backend development, this project aimed to replicate a production style infrastructure. It showcases containerization, orchestration, automated CI/CD pipelines, and monitoring—bringing together the technologies commonly used to deploy and operate modern cloud-native applications.

**The primary goal of this project was to gain hands-on experience building, deploying, and operating a cloud-native application using tools commonly found in modern production environments.**

## Overview of Deployment Platforms

There are two platforms which kevryx was deployed on. An **AWS EC2 instance** and a locally run **Ubuntu server** on an external machine.

Due to cost constraints, the deployment on AWS did not include any Kubernetes orchestration and was deployed from docker compose files.

The locally run Ubuntu server deployment has all of the infrastructure mentioned and more.

<br>

## Tech Stack

### Frontend
- React
- Vite

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL

### DevOps & Infrastructure
- Docker
- Docker Compose
- Kubernetes
- Helm
- NGINX
- Redis
- GitHub Actions
- Prometheus
- Grafana
