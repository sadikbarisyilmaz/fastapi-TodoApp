# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL configuration
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=database

# Copy the initial database setup script, if any
# COPY ./init.sql /docker-entrypoint-initdb.d/
# COPY tables.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432

# Command to run PostgreSQL
CMD ["postgres"]