import { useState } from "react";

export default function ImageService() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  const [error, setError] = useState("");

  // SPRING BOOT BACKEND URL

  const BASE_URL = "http://localhost:8080";

  const generateImage = async () => {

    if (!prompt.trim()) {

      setError("Please enter a prompt");

      return;
    }

    setLoading(true);

    setError("");

    try {

      // CALL SPRING BOOT BACKEND

      const response = await fetch(
        `${BASE_URL}/image?prompt=${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {

        throw new Error(
          `Backend Error: ${response.status}`
        );
      }

      // BACKEND RETURNS HTML

      const htmlData =
        await response.text();

      // EXTRACT IMAGE URLs FROM <img> TAGS

      const imgRegex =
        /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

                const response = await fetch(
                  `${API_URL}/image?prompt=${encodeURIComponent(prompt)}`
                );
      if (matches.length === 0) {

        throw new Error(
          "No image found in backend response"
        );
      }

      // CONVERT IMAGE URLs TO DATA URLs

      const newImages = await Promise.all(

        matches.map(async (match, index) => {

          let imageUrl = match[1];

          let dataUrl = imageUrl;

          // If external URL, fetch as blob through proxy

          if (
            imageUrl.includes("http") &&
            !imageUrl.includes("data:")
          ) {

            try {

              const proxyUrl =
                `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;

              const imgResponse =
                await fetch(proxyUrl);

              const blob =
                await imgResponse.blob();

              const reader =
                new FileReader();

              dataUrl = await new Promise(
                (resolve) => {

                  reader.onload = () =>
                    resolve(reader.result);

                  reader.readAsDataURL(blob);

                }
              );

            } catch (err) {

              console.warn(
                "Could not load image:",
                imageUrl,
                err
              );

              dataUrl = imageUrl;

            }

          }

          return {

            id: Date.now() + index,

            url: dataUrl,

            prompt,

            timestamp:
              new Date().toLocaleString(),

          };

        })

      );

      setImages((prev) => [
        ...newImages,
        ...prev,
      ]);

      setPrompt("");

    } catch (err) {

      console.error(err);

      setError(
        `Failed to generate image: ${err.message}`
      );

    } finally {

      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      generateImage();
    }
  };

  const deleteImage = (id) => {

    setImages(
      images.filter(
        (img) => img.id !== id
      )
    );
  };

  const clearAll = () => {

    setImages([]);

    setError("");
  };

  return (

    <div className="card">

      <div className="card-title">
        🎨 AI Image Generator
      </div>

      <p className="card-subtitle">
        Generate AI images using Spring AI backend
      </p>

      {/* ERROR */}

      {
        error && (

          <div className="alert alert-error">

            {error}

          </div>

        )
      }

      {/* INPUT */}

      <div className="form-group">

        <label className="form-label">

          Enter Prompt:

        </label>

        <textarea
          className="form-textarea"
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          onKeyPress={handleKeyPress}
          placeholder="Enter image prompt..."
          disabled={loading}
        ></textarea>

      </div>

      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >

        <button
          className="btn btn-primary"
          onClick={generateImage}
          disabled={
            loading ||
            !prompt.trim()
          }
        >

          {
            loading ? (

              <>
                <span className="spinner"></span>
                {" "}Generating...
              </>

            ) : (

              <>✨ Generate Image</>

            )
          }

        </button>

        <button
          className="btn btn-secondary"
          onClick={clearAll}
          disabled={
            images.length === 0
          }
        >

          🗑️ Clear All

        </button>

      </div>

      {/* IMAGE GALLERY */}

      {
        images.length > 0 && (

          <div>

            <h3
              style={{
                marginBottom: "1rem",
              }}
            >

              Generated Images (
              {images.length}
              )

            </h3>

            <div className="image-gallery">

              {
                images.map((image) => (

                  <div
                    key={image.id}
                    className="image-card"
                  >

                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="image-preview"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error(
                          "Image load failed:",
                          image.url,
                          e
                        );
                      }}
                    />

                    <div className="image-info">

                      <div className="image-name">

                        {image.prompt}

                      </div>

                      <div
                        style={{
                          fontSize: "0.85rem",
                          marginBottom: "0.5rem",
                        }}
                      >

                        {image.timestamp}

                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                        }}
                      >

                        <a
                          href={image.url}
                          download={`image-${image.id}.png`}
                          className="btn btn-primary btn-small"
                        >

                          ⬇️ Download

                        </a>

                        <button
                          onClick={() =>
                            deleteImage(image.id)
                          }
                          className="btn btn-secondary btn-small"
                        >

                          ❌

                        </button>

                      </div>

                    </div>

                  </div>

                ))
              }

            </div>

          </div>

        )
      }

    </div>
  );
}