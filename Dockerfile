FROM node:20-bookworm


# Install Python.
RUN apt-get update \
    && apt-get install -y \
        python3 \
        python3-venv \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app


# Copy Node package files first.
# This allows Docker to cache npm installation.
COPY backend/package*.json ./backend/


# Install Node dependencies.
RUN cd backend \
    && npm ci --omit=dev


# Copy Python dependency file.
COPY scraper/requirements.txt ./scraper/


# Create a Python virtual environment.
RUN python3 -m venv /opt/venv


# Install Python dependencies.
RUN /opt/venv/bin/pip install \
    --no-cache-dir \
    -r scraper/requirements.txt


# Copy application source.
COPY backend ./backend

COPY scraper ./scraper


# Make Python virtual environment available
# as the default python command.
ENV PATH="/opt/venv/bin:$PATH"


# Default database location.
#
# In production this will be overridden
# by the hosting platform.
ENV DATABASE_PATH="/app/data/news.db"


# Create local data directory.
RUN mkdir -p /app/data


# The Node server listens on PORT.
ENV PORT=10000


EXPOSE 10000


CMD ["sh", "-c", "python scraper/init_db.py && node backend/server.js"]