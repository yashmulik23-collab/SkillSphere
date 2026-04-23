# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the entire project to ensure all subfolders are present
COPY . .

# Run the build from the backend folder
RUN mvn -f backend/pom.xml clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
# Copy the built jar
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
