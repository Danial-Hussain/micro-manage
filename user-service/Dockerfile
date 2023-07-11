# Build Stage
FROM maven:3.9.2 AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml package

# Run Stage
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY --from=build /usr/src/app/target/*.jar /usr/src/app.jar
ENTRYPOINT ["java","-jar","/usr/src/app.jar"]