# Elderly Companion App

## Introduction

The Elderly Companion App is a mobile application designed to address the unique challenges faced by elderly individuals in accessing essential services, receiving assistance with daily tasks, and maintaining social connections within their local communities. This document serves as a guide to the project, outlining its purpose, stakeholders, system requirements, and development details.

## Problem Statement

Many elderly individuals experience isolation, difficulty in accessing assistance with daily tasks, and a lack of engagement in community events. Existing platforms do not sufficiently address these issues. The Elderly Companion App aims to bridge this gap by providing a comprehensive solution that connects elderly users with trustworthy neighbors and service providers.

## Stakeholders

1. **Product Owner**: Defines the product's vision, features, and goals.
2. **Elderly Users**: Primary beneficiaries of the app, actively using it for various tasks and interactions.
3. **Volunteers/Service Providers**: Offer assistance and services to elderly users.
4. **Community Organizations**: Collaborate with the app to promote and organize events for the elderly.
5. **Software Engineering Team**: Responsible for the technical aspects of the project.

## System Requirements

### Frontend Framework
- The app's frontend is developed using React Native with Expo for cross-platform compatibility.

### Backend Framework
- Firebase handles the complete backend, including APIs and database management.

### Cloud Services
- Utilizes Firebase services, such as Firestore for database management and Cloud Functions for API implementation.

## Installation and Setup

### Prerequisites
- Node.js
- Expo CLI
- Firebase CLI

### Steps
1. Clone the repository: `git clone https://github.com/rolanorebelo/ElderApp.git`
2. Navigate to the project directory: `cd ElderApp`
3. Install frontend dependencies: `npm install`
4. Install Firebase CLI: `npm install -g firebase-tools`
5. Log in to Firebase: `firebase login`
6. Set up Firebase for the project: `firebase init`
7. Deploy Firebase functions: `firebase deploy --only functions`
8. Start the frontend: `npm start`

## Contributing

Contributions are welcome! Please follow the guidelines outlined in CONTRIBUTING.md.

## License

This project is licensed under the [MIT License](LICENSE).
