# Email AI Assistant

## Project Overview

The Email AI Assistant is a web application designed to help users manage and compose emails more efficiently using AI capabilities. It features a chat-like interface for interacting with an AI model, allowing for intelligent assistance in email drafting, summarization, and other related tasks.

## Features

*   **AI-Powered Email Assistance**: Leverage a Large Language Model (LLM) for various email-related tasks.
*   **Interactive Chat Interface**: A user-friendly chat interface for seamless interaction with the AI.
*   **Customizable Settings**: Adjust application settings, potentially including AI model parameters or user preferences.
*   **Local Storage Integration**: Persist user settings or chat history using local storage.
*   **Responsive Design**: Built with modern web technologies for a smooth experience across devices.

## Technologies Used

*   **Frontend**:
    *   React (with TypeScript)
    *   Vite (for fast development and bundling)
    *   Tailwind CSS (for styling)
*   **Backend/Services**:
    *   LLM Service (for AI interactions)
*   **State Management**:
    *   `useState` hook (React)
    *   `useLocalStorage` custom hook
*   **Containerization**:
    *   Docker

## Setup

To get the project up and running locally, follow these steps:

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or Yarn
*   Docker (if using Docker for deployment/development)

### Installation

**Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Dockerization

You can also run this application using Docker.

### Building the Docker Image

To build the Docker image, navigate to the root directory of the project (where the `Dockerfile` is located) and run:

```bash
docker build -t email-ai-assistant .
```

### Running the Docker Container

Once the image is built, you can run the container:

```bash
docker run -p 80:80 email-ai-assistant
```

The application will then be accessible in your browser at `http://localhost`.

## Usage

Once the application is running, you can:

1.  **Interact with the AI**: Use the chat input to send prompts and receive AI-generated responses for email assistance.
2.  **Adjust Settings**: Navigate to the settings section to configure preferences.

## Project Structure

```
.
├── public/
├── src/
│   ├── components/         # Reusable UI components (ChatInput, Header, Settings, etc.)
│   ├── hooks/              # Custom React hooks (e.g., useLocalStorage)
│   ├── services/           # API interaction and LLM service logic
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point for the React application
│   └── index.css           # Global styles
├── Dockerfile              # Docker configuration for containerization
├── .gitignore
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```