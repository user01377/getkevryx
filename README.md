# Overview Of Project

**getkevryx** is a full-stack e-commerce app themed around a premium, modern, outdoor apparel brand. The app provides a complete online shopping experience including product browsing, order placement, order tracking, and a responsive user-interface.

The application is fundamentally build with a React frontend served by NGINX, a FastAPI backend, and a PostgreSQL database. The services are containerized with Docker and deployed using either Docker Compose or Kubernetes depending on the target environment.

Rather than focusing solely on frontend and backend development, this project aimed to replicate a production style infrastructure. It showcases containerization, orchestration, automated CI/CD pipelines, and monitoring—bringing together the technologies commonly used to deploy and operate modern cloud-native applications.

**TLDR; The primary goal of this project was to gain hands-on experience building, deploying, and operating a cloud-native application using tools commonly found in modern production environments.**

## Overview of Deployment Platforms

The project was deployed in two different environments:

- **AWS EC2** – A cloud deployment using Docker Compose. Kubernetes was intentionally omitted to reduce infrastructure costs.

- **Local Ubuntu Server** – A production-style deployment running the complete infrastructure, including Kubernetes, Helm, Prometheus, Grafana, Redis, and the application stack.

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

## CI/CD Pipeline Diagrams
### Continuous Integration (CI)
```mermaid
flowchart TD

    A[Push to main / Pull Request] --> B[Checkout Repository]

    B --> C1[Backend Job]
    B --> C2[Frontend Job]

    subgraph Backend Testing
        C1 --> D1[Build Backend Test Image]
        D1 --> E1[Ruff Lint]
        E1 --> F1[Ruff Format Check]
        F1 --> G1[Pytest]
    end

    subgraph Frontend Testing
        C2 --> D2[Build Frontend Test Image]
        D2 --> E2[ESLint]
        E2 --> F2[Frontend Tests]
    end

    G1 --> H{On main?}
    F2 --> H

    H -->|Yes| I[Build Runtime Docker Images]
    H -->|No| X[Pipeline Complete]

    I --> J[Login to GHCR]
    J --> K[Tag Images<br/>SHA + prod]
    K --> L[Push Images to GHCR]
```

### Continuous Development (CD)
```mermaid
flowchart TD

    A[CI Workflow Succeeds] --> B{Branch == main?}

    B -->|No| X[Stop]

    B -->|Yes| C[Self-hosted Runner]

    C --> D[Login to GHCR]

    D --> E[helm upgrade --install]

    E --> F[Pull Backend Image<br/>commit SHA]

    E --> G[Pull Frontend Image<br/>commit SHA]

    F --> H[Update Kubernetes Deployment]
    G --> H

    H --> I[Deploy New Release]

    I --> J{Deployment Successful?}

    J -->|Yes| K[Application Updated]

    J -->|No| L[Automatic Helm Rollback]
```

## Full CI/CD Pipeline

``` mermaid
flowchart LR

    Dev[Developer] --> Git[GitHub]

    Git --> CI[GitHub Actions CI]

    CI --> Backend[Backend Tests]
    CI --> Frontend[Frontend Tests]

    Backend --> Build[Build Images]
    Frontend --> Build

    Build --> GHCR[(GitHub Container Registry)]

    GHCR --> CD[GitHub Actions CD]

    CD --> Helm[Helm Upgrade]

    Helm --> K8s[(Kubernetes Cluster)]

    K8s --> FrontendPod[Frontend Pod]
    K8s --> BackendPod[Backend Pod]
```
