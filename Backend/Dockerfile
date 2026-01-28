# Perfect Backend for Free Tier Render
FROM python:3.11-slim

# Prevent Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevent Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

WORKDIR /code

# Install system dependencies (needed for some python packages or building)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port (Render sets PORT env var, but we document 8080)
EXPOSE 8080

# Command to run the application
# We use shell form to allow variable expansion if needed, but array form is safer for signals.
# Render creates a PORT env var. Uvicorn needs to listen on it.
# We can use a shell script or just rely on default if we map it.
# Render recommends: uvicorn main:app --host 0.0.0.0 --port $PORT
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
