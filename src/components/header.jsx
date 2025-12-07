import logo from "../assets/logo.svg";
import cart from "../assets/cart.svg";
import "../styles/header.css";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Menu from "../assets/menu.svg";
import Dropdown from "./dropdown";
import LogInForm from "../components/logInForm.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function Header() {
  const { openLoginForm, isLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [categoryData, setMacroCategoryData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    axios.get(`api/categories/list`).then((response) => {
      setMacroCategoryData(response.data);
    });
  }, []);
  const [isOpen, setOpen] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);
  function toggleAccordion() {
    setOpen(isOpen === "" ? "active" : "");
    setHeightState(isOpen === "active" ? "0px" : `1000px`);
  }
  function toCart() {
    if (localStorage.getItem("user") != null) {
      navigate("/cart", { replace: true });
    } else {
      openLoginForm("/cart");
    }
  }
  return (
    <>
      {!isMobile ? (
        <div className="headerContainer">
          <div className="wraper">
            <Link to="/" className="logoWrap">
              <img src={logo} alt="logo" className="logoImg" />
              <p className="logoLable">Транзит Электро</p>
            </Link>
          </div>

          <div className="wraper links">
            <Link to="/about" className="linkDecor">
              О нас
            </Link>
            <div className="mrgnlft">
              <Link to="/categories" className="linkDecor">
                Каталог
              </Link>
              <div className="subMenuContainer">
                {categoryData.map((category) => (
                  <Link to={category.src} className="subMenuLink">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mrgnlft">
              <Link to="/discount" className="linkDecor">
                Акции
              </Link>
            </div>
          </div>

          <div className="crossButtonContainer">
            <LogInForm></LogInForm>
            <div className="cartImage" onClick={() => toCart()}>
              <img src={cart} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="headerContainer">
            <div className="wraper">
              <Link to="/" className="logoWrap">
                <img src={logo} alt="logo" className="logoImg" />
                <p className="logoLable">Транзит Электро</p>
              </Link>
            </div>

            <img src={Menu} className={`openMenu `} onClick={toggleAccordion} />
          </div>
          <div
            ref={content}
            style={{ maxHeight: `${setHeight}` }}
            className="mobileMenu"
          >
            <Link to="/about">
              <h1 className="mobileMenuItem">
                <span className="linkDecor">О нас</span>
              </h1>
            </Link>
            <Link to="/discount" className="linkDecor">
              <h1 className="mobileMenuItem">
                <span className="linkDecor">Акции</span>
              </h1>
            </Link>
            <h1 className="mobileMenuItem">
              <span className="linkDecor" onClick={() => toCart()}>
                Корзина
              </span>
            </h1>
            <h1 className="mobileMenuItem ">
              <Dropdown
                isMobileMenu={true}
                title={
                  <Link to="/categories" className="dropdownLink">
                    Каталог
                  </Link>
                }
                content={
                  <ul className="subMenuContainerMobile">
                    {categoryData.map((category) => (
                      <li className="subMenuLink">
                        <Link to={category.src}>{category.name}</Link>
                      </li>
                    ))}
                  </ul>
                }
              />
            </h1>
            <LogInForm></LogInForm>
          </div>
        </>
      )}
    </>
  );
}
export default Header;
