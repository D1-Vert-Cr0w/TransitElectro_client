import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import Banner from "../assets/i.svg";
import "../styles/about.css";
import infoImg from "../assets/infoimg.jpg";
import IEK from "../assets/iek.png";
import EKF from "../assets/ekf.svg";
import jazzway from "../assets/jazzway.webp";
import DKC from "../assets/dkc.png";
import Arrow from "../assets/arrow.svg";
import { useRef, useState } from "react";
import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Link } from "react-router-dom";
import placemarkIcon from "../assets/mark.svg";
function About() {
  const [isOpen, setOpen] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);

  function toggleAccordion() {
    setOpen(isOpen === "active" ? "" : "active");
    setHeightState(
      isOpen === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
  }
  return (
    <>
      <Header />
      <div className="bannerWrap">
        <img className="aboutBanner" src={Banner} />
        <div className="textOverlay">
          <p className="bannerTitle">О нас</p>
          <p className="bannerSubTitle">
            Tranzit Electro - компания по продаже электрооборудования, ведущая
            свою деятельность с 2023 года
          </p>
        </div>
      </div>
      <div className="infoWrap">
        <p className="infoText">
          Мы предлагаем широкий ассортимент электротехники. Утончённые решения
          для декора интерьера, уличных участков, всё для ремонта и не только.
          Наши партнеры - лидеры рынка, такие как IEK, DKC, Jazz Way и другие. С
          нами ваша жизнь станет ярче
        </p>
        <img src={infoImg} className="infoImg" alt="House" />
      </div>
      <div className="partnersWrap">
        <p className="partnersTitle">Наши партнеры</p>
        <div className="partnersLogosWrap">
          <Link to={"/shop"} state={{ brend: "IEK" }}>
            <img className="partnersLogoElem" src={IEK} alt="iek" />
          </Link>
          <Link to={"/shop"} state={{ brend: "EKF" }}>
            <img className="partnersLogoElem" src={EKF} alt="ekf" />
          </Link>
          <Link to={"/shop"} state={{ brend: "DKC" }}>
            <img className="partnersLogoElem" src={DKC} alt="dkc" />
          </Link>
          <Link to={"/shop"} state={{ brend: "JazzWay" }}>
            <img className="partnersLogoElem" src={jazzway} alt="jazzway" />
          </Link>
        </div>
      </div>
      <div className="contactsWrap">
        <div className="mapContainer" id="map">
          <YMaps>
            <Map
              defaultState={{
                center: [57.93545019811274, 56.20714613310675],
                zoom: 17,
              }}
              style={{ height: "100%" }}
            >
              <Placemark
                geometry={[57.93540597284978, 56.207170272987845]}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: placemarkIcon,
                  iconImageSize: [52, 52],
                  iconImageOffset: [-26, -47],
                }}
              />
            </Map>
          </YMaps>
        </div>
        <div className="contactTextContainer">
          <h1 className="contacnsTitle">Как нас найти</h1>
          <div className="accordion">
            <div className="about-acordion-titleWrap">
              <img
                src={Arrow}
                className={`about-arrowButton ${isOpen ? "arrowActive" : ""}`}
                onClick={toggleAccordion}
              />
              <p className="about-accordionSubtitle">Информация об ООО</p>
            </div>
            <hr className="accordionBorder"></hr>
            <div
              ref={content}
              style={{ maxHeight: `${setHeight}` }}
              className="about-hiddenWrap"
            >
              <p className="about-hiddenText">
                <span className="boldText">Директор:</span> Яковлев Евгений
                Павлович<br></br>
                <span className="boldText">ОГРН:</span> 1235900001633<br></br>
                <span className="boldText">ИНН:</span> 5948067245<br></br>
                <span className="boldText">КПП:</span> 594801001<br></br>
                <span className="boldText">ОКПО:</span> 96015118<br></br>
                <span className="boldText">Дата регистрации:</span> 31 января
                2023 года<br></br>
                <span className="boldText">Юридический адрес:</span>
                <br></br>
                614530, Пермский край, м. о. Пермский, д. Якунчики, ул.
                Подлесная, д. 14
              </p>
              <hr className="about-accordionBorder"></hr>
            </div>
          </div>
          <p className="contactsFooter">
            Пермский край, м. о. Пермский, д. Якунчики, ул. Подлесная, д. 15
            <br></br>
            8-800-555-35-35<br></br>
            tranzitelektro@bk.ru
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
