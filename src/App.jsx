import { useState } from "react";
import Chatbot from "./components/Chatbot";
import ImageService from "./components/ImageService";
import RecipeCreator from "./components/RecipeCreator";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("chatbot");
  const BASE_URL = import.meta.env.VITE_API_URL;

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
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Spring AI Assistant</h1>
          <p className="app-subtitle">
            Your intelligent companion for chat, images, and recipes
          </p>
        </div>
      </header>
      <nav className="app-navigation">
        <button
          className={`nav-button ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => setActiveTab("chatbot")}
        >
          <span>Chatbot</span>
        </button>
        <button
          className={`nav-button ${activeTab === "image" ? "active" : ""}`}
          onClick={() => setActiveTab("image")}
        >
          <span>Image Service</span>
        </button>
        <button
          className={`nav-button ${activeTab === "recipe" ? "active" : ""}`}
          onClick={() => setActiveTab("recipe")}
        >
          <span>Recipe Creator</span>
        </button>
      </nav>
      <main className="app-main">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
      <footer className="app-footer">
        <p>2024 Spring AI Frontend. Powered by React and Spring AI.</p>
      </footer>
    </div>
  );
}

export default App;
