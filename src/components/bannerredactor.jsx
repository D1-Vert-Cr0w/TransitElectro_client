import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/productredactor.css";
import cross from "../assets/cross.png";
function BannerRedactor() {
  const fileInputRef = useRef(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState(null);
  const [discountData, setDiscountData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  async function loadImages() {
    axios
      .get("https://tranzitelektro.ru/api/banner/list", {
        withCredentials: true,
      })
      .then((response) => {
        setImagesPreview(response.data);
      });
  }
  useEffect(() => {
    loadImages();
    axios
      .get("https://tranzitelektro.ru/api/discount/list")
      .then((response) => setDiscountData(response.data));
  }, []);
  async function handleFileUpload() {
    const file = fileInputRef.current.files[0];
    console.log(file);
    setError(null);
    setIsLoading(true);
    try {
      await sendGetRequestWithFiles(file);
      loadImages();
    } catch (err) {
      setError(`Ошибка при загрузке файлов: ${err.message}`);
      console.error("Ошибка загрузки:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const sendGetRequestWithFiles = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("url", `http://localhost:5173/discount/ditails/${url}`);
      const response = await axios.post(
        "https://tranzitelektro.ru/api/banner/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          validateStatus: () => true,
        },
      );
      if (response.status == 500) {
        setError("Изображение с такой ссылкой уже существует");
      }
    } catch (err) {
      console.error(`Ошибка при загрузке ${file}:`, err);
    }
  };

  async function removeDrawing(index, id) {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
    const deletereq = await axios.delete(
      `https://tranzitelektro.ru/api/banner/delete/${id}`,
      { withCredentials: true },
    );
  }
  return (
    <>
      <div className="image-upload-section">
        <div className="drawings-upload-section">
          <h2 className="ditails-text">
            Изображения главной страницы:{" "}
            {imagesPreview.length !== 0 ? "" : "Отсутствуют"}
          </h2>

          <div className="drawings-previews-container">
            {imagesPreview.length !== 0
              ? imagesPreview.map((preview, index) => (
                  <div key={index} className="drawing-preview-item">
                    <img
                      src={preview.image}
                      alt={`Баннер ${index + 1}`}
                      className="bannerDrawing"
                    />
                    <button
                      type="button"
                      className="deleteDrawing"
                      onClick={() => removeDrawing(index, preview._id)}
                    >
                      <img src={cross} className="crossButton" />
                    </button>
                  </div>
                ))
              : null}
          </div>

          <h2 className="ditails-text">Добавить новые</h2>

          <input
            className="imageInput"
            type="file"
            accept="image/*"
            multiple
            disabled={isLoading}
            ref={fileInputRef}
          />
          <select
            className="selectSrcOption"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          >
            <option value={"-"}>-</option>
            {discountData.map((discount) => (
              <option value={discount.title}>{discount.title}</option>
            ))}
          </select>
          {isLoading && <p className="loading-text">Загрузка...</p>}
        </div>
      </div>

      {error != null ? <p className="errorText">{error}</p> : ""}
      <button
        className={isLoading ? "dataLoading" : "changeProduct"}
        onClick={handleFileUpload}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка данных..." : "Загрузить данные"}
      </button>
      <div className="productButtonContainer"></div>
    </>
  );
}

export default BannerRedactor;
