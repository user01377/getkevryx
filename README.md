# Overview Of Project

**getkevryx** is a full-stack e-commerce app themed around a premium, modern, outdoor apparel brand. The app provides a complete online shopping experience including product browsing, order placement, order tracking, and a responsive user-interface.

The application consists of a React based frontend served by nginx and a FastAPI backend, all containerized with Docker
and orchestrated using Kubernetes. A GitHub Actions CI/CD pipeline automates building and publishing container images to
GitHub Container Registry, while Prometheus and Grafana provide application monitoring and observability.

The project was built to demonstrate both modern application development and DevOps practices. Rather than focusing solely on frontend and backend development, this project aimed to replicate a production style infrastructure. It showcases containerization, orchestration, automated CI/CD pipelines, and monitoring—bringing together the technologies commonly used to deploy and operate modern cloud-native applications.

# Overview of Deployment Platforms

There are two platforms which kevryx was deployed on. An **AWS EC2 instance** and a locally run **Ubuntu server** on an external machine.

Due to cost constraints, the deployment on AWS did not include any Kubernetes orchestration and was deployed from docker compose files.

The local Ubuntu server deployment has all of the infrastructure mentioned and more.
