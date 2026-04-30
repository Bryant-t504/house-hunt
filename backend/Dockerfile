# Use an official Python runtime as a parent image
FROM --platform=linux/amd64 python:3.11-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies for psycopg2 and other tools
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn daphne  # Ensure production servers are installed

# Copy project
COPY . /app/

# Create logs directory
RUN mkdir -p /app/logs

# Command to run the application using Daphne (supports both HTTP and WS)
# We bind to 0.0.0.0:8000 to be accessible within the docker network
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "gridnest.asgi:application"]
