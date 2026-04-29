import { useState } from "react";
import Chatbot from "./components/Chatbot";
import ImageService from "./components/ImageService";
import RecipeCreator from "./components/RecipeCreator";
import "./App.css";

function App() {

  // Active tab state
  const [activeTab, setActiveTab] = useState("chatbot");

  // Spring Boot Backend URL
  const BASE_URL = "http://localhost:8080";

  // Render Components
  const renderContent = () => {

    switch (activeTab) {

      case "chatbot":
        return <Chatbot baseUrl={BASE_URL} />;

      case "image":
        return <ImageService baseUrl={BASE_URL} />;

      case "recipe":
        return <RecipeCreator baseUrl={BASE_URL} />;

      default:
        return <Chatbot baseUrl={BASE_URL} />;
    }
  };

  return (

    <div className="app-container">

      {/* Header */}

      <header className="app-header">

        <div className="header-content">

          <h1 className="app-title">
            🤖 Spring AI Assistant
          </h1>

          <p className="app-subtitle">
            Your intelligent companion for chat, images, and recipes
          </p>

        </div>

      </header>

      {/* Navigation */}

      <nav className="app-navigation">

        <button
          className={`nav-button ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => setActiveTab("chatbot")}
        >

          <span className="nav-icon">💬</span>

          <span>Chatbot</span>

        </button>

        <button
          className={`nav-button ${activeTab === "image" ? "active" : ""}`}
          onClick={() => setActiveTab("image")}
        >

          <span className="nav-icon">🎨</span>

          <span>Image Service</span>

        </button>

        <button
          className={`nav-button ${activeTab === "recipe" ? "active" : ""}`}
          onClick={() => setActiveTab("recipe")}
        >

          <span className="nav-icon">👨‍🍳</span>

          <span>Recipe Creator</span>

        </button>

      </nav>

      {/* Main Content */}

      <main className="app-main">

        <div className="content-wrapper">

          {renderContent()}

        </div>

      </main>

      {/* Footer */}

      <footer className="app-footer">

        <p>
          © 2024 Spring AI Frontend. Powered by React & Spring AI.
        </p>

      </footer>

    </div>
  );
}

export default App;