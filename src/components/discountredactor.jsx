import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/discountredactor.css";
function DiscountRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [discountList, setDiscountList] = useState([]);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [discountDitails, setDiscountDitails] = useState(null);
  const [dataForServer, setDataForServer] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      axios
        .get("/api/discount/list", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          setDiscountList(response.data);
        });
    }
    if (componentState == "viewing") {
      fetchData();
    }
  }, [componentState]);

  function addDiscount() {
    setDataForServer({
      title: "",
      text: "",
      image: null,
    });
    setImagePreview(null);
    setDiscountDitails([{ title: "", text: "" }]);
    setComponentState("adding");
    setError(null);
  }
  function changeDitail(id) {
    const elementForChange = discountList.find((element) => element._id == id);
    setDataForServer({
      id: elementForChange._id,
      title: elementForChange.title,
      text: elementForChange.text,
      image: elementForChange.image,
    });
    setImagePreview(elementForChange.image);
    setDiscountDitails(elementForChange.ditails);
    setComponentState("changing");
    setError(null);
  }
  function removeDitail(id) {
    axios
      .delete(`/api/discount/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const newData = discountList.filter((element) => element._id !== id);
        setDiscountList(newData);
      });
  }

  function addDetail() {
    setDiscountDitails((prev) => [...prev, { title: "", text: "" }]);
  }
  const removeDiscount = (indexToRemove) => {
    setDiscountDitails((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleDiscountChange = (fieldName, value, index) => {
    setDiscountDitails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [fieldName]: value,
      };
      return updated;
    });
  };
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
    let isDitaisInfoFull = true;
    try {
      const data = {
        title: dataForServer.title,
        text: dataForServer.text,
        image1: dataForServer.image,
        ditails: discountDitails,
      };
      data.ditails.map((ditail) => {
        if (ditail.text == "" || ditail.title == "") {
          isDitaisInfoFull = false;
          console.log(isDitaisInfoFull);
        }
      });
      if (
        data.title != "" &&
        data.text != "" &&
        data.image1 != null &&
        isDitaisInfoFull == true
      ) {
        const response = await axios.post("/api/discount/add", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setPrevData(data);
        if (error != null) {
          setError(null);
        }
      } else {
        setError("*заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  }
  async function updateData() {
    let isDitaisInfoFull = true;
    try {
      const data = {
        id: dataForServer.id,
        title: dataForServer.title,
        text: dataForServer.text,
        image1: dataForServer.image,
        ditails: discountDitails,
      };
      data.ditails.map((ditail) => {
        if (ditail.text == "" || ditail.title == "") {
          isDitaisInfoFull = false;
          console.log(isDitaisInfoFull);
        }
      });
      if (
        data.title != "" &&
        data.text != "" &&
        data.image1 != null &&
        isDitaisInfoFull == true
      ) {
        const response = await axios.put("/api/discount/update", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setPrevData(data);
        if (error != null) {
          setError(null);
        }
      } else {
        setError("*заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  }
  return (
    <div className="discountMainWrap">
      <div className="discountControllButtonContainer headerDorder">
        <button
          className="changeDiscount"
          onClick={() => setComponentState("viewing")}
        >
          Список
        </button>
        <button className="changeDiscount" onClick={() => addDiscount()}>
          Добавить
        </button>
      </div>
      {componentState == "viewing"
        ? discountList.map((discount) => (
            <div className="categoryItem">
              <h1 className="categoryName">{discount.title}</h1>
              <div className="discountControllButtonContainer">
                <button
                  className="changeDiscount"
                  onClick={() => changeDitail(discount._id)}
                >
                  Изменить
                </button>
                <button
                  className="deleteDiscount"
                  onClick={() => removeDitail(discount._id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        : ""}
      {componentState == "adding" ? (
        <>
          {imagePreview && <img className="imagePreview" src={imagePreview} />}
          <input
            className="imageInput"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button type="button" className="deleteDiscount" onClick={cleanFile}>
            Удалить файл
          </button>
          <p className="discountDitails-text">Название акции</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          <p className="discountDitails-text">Текст акции</p>
          <textarea
            type="text"
            name="text"
            className="textInput"
            value={dataForServer.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
          />

          <div className="discountDitails-header">
            <p className="discountDitails-text">Детали акции</p>
            <button className="changeDiscount" onClick={addDetail}>
              Добавить
            </button>
          </div>
          {discountDitails.map((discount, index) => (
            <div className="inputContainer" key={index}>
              <p className="discountDitails-title">Заголовок детали</p>
              <textarea
                className="titleInput"
                value={discount.title}
                onChange={(e) =>
                  handleDiscountChange("title", e.target.value, index)
                }
              />
              <p className="discountDitails-text">Текст детали</p>
              <textarea
                className="textInput"
                value={discount.text}
                onChange={(e) =>
                  handleDiscountChange("text", e.target.value, index)
                }
              />
              <button
                className="deleteDiscount"
                onClick={() => removeDiscount(index)}
              >
                Удалить
              </button>
            </div>
          ))}
          {error != null ? <p>{error}</p> : ""}

          <button className="changeDiscount" onClick={sendData}>
            Загрузить данные
          </button>
        </>
      ) : (
        ""
      )}
      {componentState == "changing" ? (
        <>
          {imagePreview && <img className="imagePreview" src={imagePreview} />}
          <input
            className="imageInput"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button type="button" className="deleteDiscount" onClick={cleanFile}>
            Удалить файл
          </button>
          <p className="discountDitails-text">Название акции</p>
          <input
            type="text"
            name="name"
            placeholder="Название"
            value={dataForServer.title}
            className="titleInput"
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          <p className="discountDitails-text">Текст акции</p>
          <textarea
            type="text"
            name="name"
            placeholder="Описание"
            value={dataForServer.text}
            className="textInput"
            onChange={(e) => handleInputChange("text", e.target.value)}
          />

          <div className="discountDitails-header">
            <p className="discountDitails-text">Детали акции</p>
            <button className="changeDiscount" onClick={addDetail}>
              Добавить
            </button>
          </div>
          {discountDitails.map((discount, index) => (
            <div className="inputContainer" key={index}>
              <div className="ditailContainer">
                <p className="discountDitails-title">Заголовок детали</p>
                <textarea
                  className="ditailTitleInput"
                  value={discount.title}
                  onChange={(e) =>
                    handleDiscountChange("title", e.target.value, index)
                  }
                />
                <p className="discountDitails-text">Текст детали</p>
                <textarea
                  className="ditailTextInput"
                  value={discount.text}
                  onChange={(e) =>
                    handleDiscountChange("text", e.target.value, index)
                  }
                />
              </div>
              <button
                className="deleteDiscount"
                onClick={() => removeDiscount(index)}
              >
                Удалить
              </button>
            </div>
          ))}
          {error != null ? <p>{error}</p> : ""}
          <button className="changeDiscount " onClick={updateData}>
            Загрузить данные
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default DiscountRedactor;
