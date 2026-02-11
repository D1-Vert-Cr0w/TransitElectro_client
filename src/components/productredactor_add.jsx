import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/productredactor.css";

function ProductRedactorAdd(props) {
  const fileInputRef = useRef(null);
  const drawingsInputRef = useRef(null); // Реф для чертежей
  const [imagePreview, setImagePreview] = useState(props.dataForChange.image);
  const [isLoading, setIsLoading] = useState(false);
  const [drawingsPreviews, setDrawingsPreviews] = useState([]); // Превью чертежей
  const [productDitails, setProductDitails] = useState(
    props.dataForChange.features,
  );
  const [dataForServer, setDataForServer] = useState({
    ...props.dataForChange,
    drawings: [], // Добавляем поле для чертежей
  });
  const [error, setError] = useState(null);

  function addProductDitail() {
    setProductDitails((prev) => [...prev, { title: "", text: "" }]);
  }

  const removeProductDitail = (indexToRemove) => {
    setProductDitails((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleDitailChange = (fieldName, value, index) => {
    setProductDitails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [fieldName]: value,
      };
      return updated;
    });
  };

  // Обработка загрузки основного изображения
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDataForServer((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка загрузки чертежей
  const handleDrawingsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Добавляем новые файлы к существующим
      setDataForServer((prev) => ({
        ...prev,
        drawings: [...prev.drawings, ...files],
      }));

      // Создаем превью для новых файлов
      const newPreviews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          // Обновляем состояние когда все превью созданы
          if (newPreviews.length === files.length) {
            setDrawingsPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeDrawing = (indexToRemove) => {
    setDataForServer((prev) => ({
      ...prev,
      drawings: prev.drawings.filter((_, index) => index !== indexToRemove),
    }));
    setDrawingsPreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    if (drawingsInputRef.current) {
      drawingsInputRef.current.value = "";
      const event = new Event("change", { bubbles: true });
      drawingsInputRef.current.dispatchEvent(event);
    }
  };
  const cleanDrawings = () => {
    setDataForServer((prev) => ({
      ...prev,
      drawings: [],
    }));
    setDrawingsPreviews([]);
    if (drawingsInputRef.current) {
      drawingsInputRef.current.value = "";
      const event = new Event("change", { bubbles: true });
      drawingsInputRef.current.dispatchEvent(event);
    }
  };

  function handleInputChange(name, value) {
    setDataForServer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const cleanFile = () => {
    setDataForServer((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function sendData() {
    if (isLoading) return; // Предотвращаем повторные отправки

    setIsLoading(true);
    setError(null);

    try {
      // Формируем features — массив строк
      const features = productDitails.map(
        (item) => `${item.name.trim()}: ${item.value.trim()}`,
      );

      // Создаем FormData
      const formData = new FormData();

      // Добавляем обычные текстовые поля
      formData.append("name", dataForServer.name);
      formData.append("articul", dataForServer.articul);
      formData.append("category", dataForServer.category);
      formData.append("subcategory", dataForServer.subcategory);
      formData.append("extrasubcategory", dataForServer.extrasubcategory);
      formData.append("type", dataForServer.type);
      formData.append("purpose", dataForServer.purpose);
      formData.append("price", dataForServer.price);
      formData.append("scale", dataForServer.scale);
      formData.append("description", dataForServer.description);
      formData.append("features", JSON.stringify(features));
      formData.append("image1", dataForServer.image);

      if (dataForServer.drawings && dataForServer.drawings.length > 0) {
        for (let i = 0; i < dataForServer.drawings.length; i++) {
          formData.append("drawings", dataForServer.drawings[i]);
        }
      }
      console.log(dataForServer);
      if (
        dataForServer.name != "" &&
        dataForServer.articul != "" &&
        dataForServer.scale != "" &&
        dataForServer.type != "" &&
        dataForServer.description != "" &&
        dataForServer.price != "" &&
        dataForServer.purpose != "" &&
        dataForServer.image != null &&
        dataForServer.drawings != null
      ) {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/colection/add",
          formData,
          {
            withCredentials: true,
          },
        );
      } else {
        setError("*Заполните все поля");
      }
      console.log("Ответ сервера:", response.data);
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="ditails-text">Название</h1>
      <input
        type="text"
        name="name"
        className="titleInput"
        value={dataForServer.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />

      <div className="image-upload-section">
        <h2 className="ditails-text">Основное изображение товара</h2>
        {imagePreview && (
          <img className="productImagePreview" src={imagePreview} />
        )}
        <input
          className="imageInput"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button type="button" className="deleteProduct" onClick={cleanFile}>
          Удалить
        </button>
      </div>

      <div className="drawings-upload-section">
        <h2 className="ditails-text">Чертежи и схемы</h2>
        <div className="drawings-previews-container">
          {drawingsPreviews.map((preview, index) => (
            <div key={index} className="drawing-preview-item">
              <img
                src={preview}
                alt={`Чертеж ${index + 1}`}
                className="drawing-preview"
              />
              <button
                type="button"
                className="deleteProduct"
                onClick={() => removeDrawing(index)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <input
          className="imageInput"
          type="file"
          accept="image/*,.pdf,.dwg,.dxf"
          ref={drawingsInputRef}
          onChange={handleDrawingsChange}
          multiple
        />
        <div className="drawings-buttons">
          {drawingsPreviews.length > 0 && (
            <button
              type="button"
              className="deleteProduct"
              onClick={cleanDrawings}
            >
              Удалить все
            </button>
          )}
        </div>
      </div>

      <h1 className="ditails-text">Категория: {dataForServer.category}</h1>
      <h1
        className="ditails-text"
        style={{
          display: `${dataForServer.subcategory != "-" ? "block" : "none"}`,
        }}
      >
        Подкатегория 1: {dataForServer.subcategory}
      </h1>
      <h1
        className="ditails-text"
        style={{
          display: `${
            dataForServer.extrasubcategory != "-" ? "block" : "none"
          }`,
        }}
      >
        Подкатегория 2: {dataForServer.extrasubcategory}
      </h1>

      <h1 className="ditails-text">Артикул</h1>
      <input
        type="text"
        name="articul"
        className="titleInput"
        value={dataForServer.articul}
        onChange={(e) => handleInputChange("articul", e.target.value)}
      />

      <h1 className="ditails-text">Тип</h1>
      <input
        type="text"
        name="type"
        className="titleInput"
        value={dataForServer.type}
        onChange={(e) => handleInputChange("type", e.target.value)}
      />

      <h1 className="ditails-text">Размер</h1>
      <input
        type="text"
        name="title"
        className="titleInput"
        value={dataForServer.scale}
        onChange={(e) => handleInputChange("scale", e.target.value)}
      />

      <h1 className="ditails-text">Применение</h1>
      <input
        type="text"
        name="title"
        className="titleInput"
        value={dataForServer.purpose}
        onChange={(e) => handleInputChange("purpose", e.target.value)}
      />

      <h1 className="ditails-text">Цена</h1>
      <input
        type="text"
        name="title"
        className="titleInput"
        value={dataForServer.price}
        onChange={(e) => handleInputChange("price", e.target.value)}
      />

      <h1 className="ditails-text">Описание</h1>
      <textarea
        type="text"
        name="title"
        className="ditails-text-description"
        value={dataForServer.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
      />

      <div className="discountDitails-header">
        <p className="discountDitails-text">Свойства товара</p>
        <button className="changeProduct" onClick={addProductDitail}>
          Добавить
        </button>
      </div>

      <h1>Свойства товара</h1>
      {productDitails.map((ditail, index) => (
        <div className="productInputContainer" key={index}>
          <div>
            <p className="ditails-text">Свойство</p>
            <p className="ditails-text">Значение</p>
          </div>
          <div className="">
            <input
              className="ditailInput"
              value={ditail.name}
              onChange={(e) =>
                handleDitailChange("name", e.target.value, index)
              }
            />
            <input
              className="ditailInput"
              value={ditail.value}
              onChange={(e) =>
                handleDitailChange("value", e.target.value, index)
              }
            />
          </div>
          <button
            className="deleteProduct margin-top"
            onClick={() => removeProductDitail(index)}
          >
            Удалить
          </button>
        </div>
      ))}
      {error != null ? <p className="errorText">{error}</p> : ""}
      <div className="productButtonContainer">
        <button className="changeProduct" onClick={() => addProductDitail()}>
          Добавить свойство
        </button>

        <button
          className={isLoading ? "dataLoading" : "changeProduct"}
          onClick={sendData}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка данных..." : "Загрузить данные"}
        </button>
      </div>
    </>
  );
}

export default ProductRedactorAdd;
