// FilterEditor.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FilterEditor.css";

const FilterEditor = () => {
  const [data, setData] = useState({
    category: [],
    feature: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [newFeature, setNewFeature] = useState({
    name: "",
    values: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !data.category.includes(newCategory.trim())) {
      setData({
        ...data,
        category: [...data.category, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setData({
      ...data,
      category: data.category.filter((cat) => cat !== categoryToRemove),
    });
  };

  const handleAddFeature = () => {
    if (newFeature.name.trim() && newFeature.values.trim()) {
      const valuesArray = newFeature.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);

      const newFeatureObj = {
        name: newFeature.name.trim(),
        value: valuesArray,
      };

      setData({
        ...data,
        feature: [...data.feature, newFeatureObj],
      });

      setNewFeature({ name: "", values: "" });
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...data.feature];
    updatedFeatures.splice(index, 1);
    setData({
      ...data,
      feature: updatedFeatures,
    });
  };

  const handleAddValueToFeature = (featureIndex, newValue) => {
    if (newValue.trim()) {
      const updatedFeatures = [...data.feature];
      if (!updatedFeatures[featureIndex].value.includes(newValue.trim())) {
        updatedFeatures[featureIndex].value.push(newValue.trim());
        setData({
          ...data,
          feature: updatedFeatures,
        });
      }
    }
  };

  const handleRemoveValueFromFeature = (featureIndex, valueToRemove) => {
    const updatedFeatures = [...data.feature];
    updatedFeatures[featureIndex].value = updatedFeatures[
      featureIndex
    ].value.filter((v) => v !== valueToRemove);
    setData({
      ...data,
      feature: updatedFeatures,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("Данные успешно сохранены!");
      console.log("Отправленные данные:", data);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      setMessage("Ошибка при сохранении данных");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData({
      category: [],
      feature: [],
    });
    setMessage("");
  };

  if (loading && !data.feature.length) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="filter-editor">
      <div className="container">
        <h1 className="mb-4">Редактор фильтров свойств категорий</h1>

        {/* Секция категорий */}
        <div className="section mb-4">
          <h3>Категории</h3>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Введите название категории"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Добавить категорию
            </button>
          </div>

          <div className="categories-list">
            {data.category.map((cat, index) => (
              <div key={index} className="category-tag">
                {cat}
                <button
                  className="btn-close"
                  onClick={() => handleRemoveCategory(cat)}
                  aria-label="Удалить"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Секция свойств */}
        <div className="section mb-4">
          <h3>Свойства фильтров</h3>

          <div className="feature-form mb-4">
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Название свойства (например, Ширина, мм)"
                  value={newFeature.name}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Значения через запятую (например, 50, 100, 150)"
                  value={newFeature.values}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, values: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddFeature}
                  disabled={
                    !newFeature.name.trim() || !newFeature.values.trim()
                  }
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>

          {/* Список свойств */}
          <div className="features-list">
            {data.feature.map((feature, featureIndex) => (
              <div key={featureIndex} className="feature-card">
                <div className="feature-header">
                  <h5>{feature.name}</h5>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveFeature(featureIndex)}
                  >
                    Удалить свойство
                  </button>
                </div>

                <div className="feature-values">
                  <div className="values-list">
                    {feature.value.map((val, valIndex) => (
                      <span key={valIndex} className="value-tag">
                        {val}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() =>
                            handleRemoveValueFromFeature(featureIndex, val)
                          }
                          aria-label="Удалить значение"
                        />
                      </span>
                    ))}
                  </div>

                  <div className="add-value-input">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Добавить значение"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddValueToFeature(featureIndex, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons mb-4">
          <button
            className="btn btn-success me-3"
            onClick={handleSubmit}
            disabled={
              loading || (!data.category.length && !data.feature.length)
            }
          >
            {loading ? "Сохранение..." : "Сохранить на сервер"}
          </button>
          <button className="btn btn-secondary me-3" onClick={handleReset}>
            Очистить все
          </button>
          <button
            className="btn btn-info"
            onClick={() => console.log("Текущие данные:", data)}
          >
            Показать в консоли
          </button>
        </div>

        {/* Сообщения */}
        {message && (
          <div
            className={`alert ${
              message.includes("успешно") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        {/* Предварительный просмотр JSON */}
        <div className="preview-section">
          <h4>Предварительный просмотр данных:</h4>
          <pre className="preview-json">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default FilterEditor;
