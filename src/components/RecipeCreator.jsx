import { useState } from "react";

export default function RecipeCreator() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/recipe-creator?ingredients=${encodeURIComponent(ingredients)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      const data = await response.text();
      const newRecipe = {
        id: Date.now(),
        ingredients,
        recipe: data,
        timestamp: new Date().toLocaleString(),
      };
      setRecipes([newRecipe, ...recipes]);
      setIngredients("");
    } catch (err) {
      setError(
        `Failed to create recipe: ${err.message}. Make sure the backend is running on http://localhost:8080`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createRecipe();
    }
  };

  const downloadRecipe = (recipe, ingredients) => {
    const element = document.createElement("a");
    const content = `RECIPE FOR: ${ingredients}\n\n${recipe}`;
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `recipe-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    setRecipes([]);
    setError("");
  };

  return (
    <div className="card">
      <div className="card-title">👨‍🍳 AI Recipe Creator</div>
      <p className="card-subtitle">
        Generate delicious recipes from your available ingredients
      </p>

      {/* Error Message */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Input Section */}
      <div className="form-group">
        <label className="form-label">Enter Your Ingredients:</label>
        <textarea
          className="form-textarea"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter ingredients separated by commas (e.g., chicken, rice, garlic, onion, tomato)..."
          disabled={loading}
        ></textarea>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          💡 Tip: Separate multiple ingredients with commas
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          className="btn btn-primary"
          onClick={createRecipe}
          disabled={loading || !ingredients.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Creating...
            </>
          ) : (
            <>🍳 Generate Recipe</>
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={clearAll}
          disabled={recipes.length === 0}
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Recipes List */}
      {recipes.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "var(--primary)" }}>
            Generated Recipes ({recipes.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {recipes.map((recipeItem) => (
              <div
                key={recipeItem.id}
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ color: "var(--primary)", fontWeight: "600", marginBottom: "0.25rem" }}>
                    📝 Ingredients: {recipeItem.ingredients}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {recipeItem.timestamp}
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    maxHeight: "300px",
                    overflowY: "auto",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {recipeItem.recipe}
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => downloadRecipe(recipeItem.recipe, recipeItem.ingredients)}
                    className="btn btn-primary btn-small"
                  >
                    ⬇️ Download
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipeItem.id)}
                    className="btn btn-secondary btn-small"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recipes.length === 0 && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-secondary)",
          }}
        >
          <p>🍽️ No recipes created yet. Start by entering your ingredients above!</p>
        </div>
      )}
    </div>
  );
}
