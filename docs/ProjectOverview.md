# Project Overview

## 🌟 Introduction
**CampusSync** is a centralized communication platform designed specifically for the **USTP community**. It unifies students, faculty, and organizations under one trusted digital ecosystem, streamlining access to essential campus information.

## 🎯 The Problem
Before CampusSync, campus communication was fragmented:
- Announcements were scattered across various social media channels (Facebook, Messenger, etc.).
- "Lost & Found" items were difficult to track and verify.
- Event information was often missed or unverified.
- Dependence on third-party platforms led to information overload and security concerns.

## 💡 The Solution
CampusSync provides a dedicated platform for:
1.  **Verified Announcements**: Only authorized Organization Heads can post official announcements.
2.  **Centralized Events**: A single calendar/feed for all campus activities.
3.  **Lost & Found**: A structured system for reporting and claiming lost items, featuring a "Witness" system for added legitimacy.
4.  **Secure Access**: Exclusive to users with `@1.ustp.edu.ph` institutional emails.

## 👥 Target Audience
*   **Students**: To stay updated on events, find lost items, and receive verified news.
*   **Organization Heads**: To manage posts and announcements for their specific organizations.
*   **Moderators**: Manage organizations.

---

# 📚 Documentation Navigation

This folder contains detailed documentation for every aspect of the project, prepared for the capstone defense.

## 📑 Features & Functionality

*   **[User Guide](./UserGuide.md)**: Step-by-step walkthrough for using the application (Registration, Posting, etc.).
*   **[Post Management](./features/PostManagement.md)**: Deep dive into the Lost & Found, Announcements, and Events features.
*   **[User System](./features/UserSystem.md)**: Explanation of user profiles, roles (Moderator vs Standard), and permissions.
*   **[Authentication & Security](./features/AuthSystem.md)**: Details on institutional email validation (`@1.ustp.edu.ph`) and login flow.

## ⚙️ Technical Architecture

*   **[System Architecture](./technical/Architecture.md)**: High-level explanation of the component structure, routing, and state management.
*   **[Tech Stack & Decisions](./technical/TechStackAndDecisions.md)**: Justification for choosing React 19, Vite, TailwindCSS v4, and TypeScript.
*   **[Deployment Guide](./technical/Deployment.md)**: Guide to building and deploying the application on Render.
*   **[Docker Configuration](./technical/DockerDeployment.md)**: Explanation of the multi-stage Dockerfile and Nginx setup.

## 🔮 Future

*   **[Future Roadmap](./FutureRoadmap.md)**: Planned features and improvements for the next phases.
