import logo from "../assets/logo.svg";
import "../styles/header.css";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Menu from "../assets/menu.svg";
import Dropdown from "./dropdown";
function Header() {
  const [categoryData, setMacroCategoryData] = useState([]);
  useEffect(() => {
    axios.get(`/api/categories/list`).then((response) => {
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
  return (
    <>
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
        </div>
        <div className="wraper contacts">
          <p>+7(342)247-77-37</p>
          <p>пн-пт 9:00-18:00</p>
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
      </div>
    </>
  );
}
export default Header;
