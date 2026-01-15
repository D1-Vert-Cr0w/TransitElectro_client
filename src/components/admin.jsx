import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/admin.css";
import CategoryRedactor from "./categoryredactor.jsx";
import SubCategoryRedactor from "./subcategoryredactor.jsx";
import DiscountRedactor from "./discountredactor.jsx";
import OrderCheck from "./ordercheck.jsx";
import ExtraSubCategoryRedactor from "./extrasubcategoryredactor.jsx";
import ProductRedactor from "./productredactor.jsx";
import UserRedactor from "./userredactor.jsx";
function AdminDashboard() {
  const [redactor, setRedactor] = useState("Просмотр заказов");
  const navigate = useNavigate();
  async function logout() {
    await axios.delete("https://tranzitelektro.ru/api/user/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
  return (
    <div className="admin-mainContainer">
      <div className="redactorMenu-container">
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Просмотр заказов")}
        >
          Просмотр заказов
        </div>
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Категории")}
        >
          Категории
        </div>
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Подкатегории 1")}
        >
          Подкатегории 1
        </div>
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Подкатегории 2")}
        >
          Подкатегории 2
        </div>
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Товары")}
        >
          Товары
        </div>
        <div className="redactorMenu-item" onClick={() => setRedactor("Акции")}>
          Акции
        </div>
        <div
          className="redactorMenu-item"
          onClick={() => setRedactor("Пользователи")}
        >
          Пользователи
        </div>
      </div>
      <div className="mainRedactor-container">
        <div className="admin-logoutContainer">
          <h1 className="mainHeader">{redactor}</h1>
          <button
            className="logoutButton"
            onClick={() => {
              logout();
            }}
          >
            Выйти
          </button>
        </div>
        {redactor == "Просмотр заказов" ? <OrderCheck></OrderCheck> : ""}
        {redactor == "Категории" ? <CategoryRedactor></CategoryRedactor> : ""}
        {redactor == "Подкатегории 1" ? (
          <SubCategoryRedactor></SubCategoryRedactor>
        ) : (
          ""
        )}
        {redactor == "Подкатегории 2" ? (
          <ExtraSubCategoryRedactor></ExtraSubCategoryRedactor>
        ) : (
          ""
        )}
        {redactor == "Товары" ? <ProductRedactor></ProductRedactor> : ""}
        {redactor == "Акции" ? <DiscountRedactor></DiscountRedactor> : ""}
        {redactor == "Пользователи" ? <UserRedactor></UserRedactor> : ""}
      </div>
    </div>
  );
}
export default AdminDashboard;
