# **Elderly Companion App**

**Introduction**

The Elderly Companion App is a mobile application designed to address the unique challenges faced by elderly individuals in accessing essential services, receiving assistance with daily tasks, and maintaining social connections within their local communities. This document serves as a guide to the project, outlining its purpose, stakeholders, system requirements, and development details.
Problem Statement

Many elderly individuals experience isolation, difficulty in accessing assistance with daily tasks, and a lack of engagement in community events. Existing platforms do not sufficiently address these issues. The Elderly Companion App aims to bridge this gap by providing a comprehensive solution that connects elderly users with trustworthy neighbors and service providers.
Stakeholders

    Product Owner: Defines the product's vision, features, and goals.
    Elderly Users: Primary beneficiaries of the app, actively using it for various tasks and interactions.
    Volunteers/Service Providers: Offer assistance and services to elderly users.
    Community Organizations: Collaborate with the app to promote and organize events for the elderly.
    Software Engineering Team: Responsible for the technical aspects of the project.

**System Requirements**
**Frontend Framework**

    The app's frontend is developed using React Native with Expo for cross-platform compatibility.

**Backend Framework**

    Firebase handles the complete backend, including APIs and database management.

**Cloud Services**

    Utilizes Firebase services, such as Firestore for database management and Cloud Functions for API implementation.

**Installation and Setup**
**Prerequisites**

    Node.js
    Expo CLI
    Firebase CLI

**Steps**

    Clone the repository: git clone https://github.com/rolanorebelo/ElderApp.git
    Navigate to the project directory: cd ElderApp
    Install frontend dependencies: npm install
    Install Firebase CLI: npm install -g firebase-tools
    Log in to Firebase: firebase login
    Set up Firebase for the project: firebase init
    Deploy Firebase functions: firebase deploy --only functions
    Start the frontend: npm start
