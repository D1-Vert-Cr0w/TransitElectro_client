import logo from "../assets/logo.svg";
import "../styles/header.css";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Menu from "../assets/menu.svg";
function Header() {
  const [isOpen, setOpen] = useState("");
  const [setHeight, setHeightState] = useState("0px");

  const content = useRef(null);

  function toggleAccordion() {
    setOpen(isOpen === "" ? "active" : "");
    setHeightState(
      isOpen === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
  }
  return (
    <>
      <div className="headerContainer">
        <div className="wraper logoWrap">
          <img src={logo} alt="logo" className="logoImg" />
          <p className="logoLable">
            <Link to="/">Tranzit Electro</Link>
          </p>
        </div>
        <div className="wraper links">
          <Link to="/about" className="linkDecor">
            О нас
          </Link>
          <span className="mrgnlft">
            <Link to="/categories" className="linkDecor">
              Каталог
            </Link>
          </span>
        </div>
        <div className="wraper contacts">
          <p>8-800-555-35-35</p>
          <p>пн-пт 9:00-22:00</p>
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
        <Link to="/categories">
          <h1 className="mobileMenuItem ">
            <span className="linkDecor">Каталог</span>
          </h1>
        </Link>
      </div>
    </>
  );
}
export default Header;
