# Use an official Python image
FROM python:3.12-slim

# Prevent Python from writing .pyc files & ensure output shows immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (needed for psycopg2 & other libs)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file first (take advantage of Docker caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app code
COPY . .

# Expose Django development port
EXPOSE 8000

# Default command to run Django (you can override in docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
