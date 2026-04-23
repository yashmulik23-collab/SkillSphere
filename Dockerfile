# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the backend folder specifically
COPY backend/pom.xml ./backend/
RUN mvn -f backend/pom.xml dependency:go-offline

COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy the built jar from the backend target folder
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
