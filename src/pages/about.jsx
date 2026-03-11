import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import Banner from "../assets/i.svg";
import "../styles/about.css";
import infoImg from "../assets/infoimg.jpg";
import IEK from "../assets/iek.png";
import EKF from "../assets/ekf.svg";
import jazzway from "../assets/jazzway.webp";
import chint from "../assets/chint.svg";
import tokovElectric from "../assets/tokovElectric.svg";
import leadvance from "../assets/leadvance.svg";
import navigator from "../assets/navigator.svg";
import systemElectric from "../assets/system-electric.svg";
import DKC from "../assets/dkc.png";
import Arrow from "../assets/arrow.svg";
import universal from "../assets/universal.svg";
import arlight from "../assets/arlight.svg";
import bailu from "../assets/bailu.svg";
import era from "../assets/era.svg";
import delta from "../assets/delta.svg";
import keaz from "../assets/keaz.svg";
import lighttecknologies from "../assets/lighttecknologies.svg";
import inHome from "../assets/inhome.svg";
import dekraft from "../assets/dekraft.svg";
import { useRef, useState, useEffect } from "react";
import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Link } from "react-router-dom";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import placemarkIcon from "../assets/mark.svg";
import AOS from "aos";
function About() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isOpen, setOpen] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);

  function toggleAccordion() {
    setOpen(isOpen === "active" ? "" : "active");
    setHeightState(
      isOpen === "active" ? "0px" : `${content.current.scrollHeight}px`,
    );
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animOnScroll");
          }
        });
      }, {});
      const elementsToAnimate = document.querySelectorAll(".animFlag");
      elementsToAnimate.forEach((el) => observer.observe(el));
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {pageLoaded == false ? (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      ) : null}
      <Header />
      <div className="bannerWrap">
        <img className="aboutBanner" src={Banner} />
        <div className="textOverlay">
          <p className="bannerTitle animFlag">О нас</p>
          <p className="bannerSubTitle animFlag">
            «Транзит Электро» — динамично развивающаяся компания на рынке. Мы
            зарекомендовали себя как ответственный партнер, готовый предложить
            оптимальные решения для вашего бизнеса.
          </p>
        </div>
      </div>
      <div className="infoWrap">
        <p className="infoText animFlag">
          Мы предлагаем комплексные электротехнические решения для проектов
          любой сложности. В нашем ассортименте — всё: от надежных базовых
          компонентов для монтажа до элегантных систем интерьерного и
          ландшафтного освещения. Мы работаем только с признанными лидерами
          отрасли, такими как IEK, DKC, Jazz Way, гарантируя высочайшее
          качество, безопасность и безупречную эстетику каждого элемента.
        </p>
        <img src={infoImg} className="infoImg  animFlag" alt="House" />
      </div>
      <div className="partnersWrap">
        <p className="partnersTitle animFlag">Наши партнеры</p>
        <div className="partnersLogosWrap animFlag">
          <Link to={"https://www.iek.ru/?ysclid=mizxhpzs9d239586578"}>
            <img className="partnersLogoElem" src={IEK} alt="iek" />
          </Link>
          <Link to={"https://ekf.market/"}>
            <img className="partnersLogoElem" src={EKF} alt="ekf" />
          </Link>
          <Link to={"https://www.dkc.ru/ru/"}>
            <img className="partnersLogoElem" src={DKC} alt="dkc" />
          </Link>
          <Link to={"https://jazz-way.com/?ysclid=mizxlylih4554349065"}>
            <img className="partnersLogoElem" src={jazzway} alt="jazzway" />
          </Link>
          <Link to={"https://systeme.ru/"}>
            <img
              className="partnersLogoElem"
              src={systemElectric}
              alt="SystemElectric"
            />
          </Link>
          <Link to={"https://navigator-light.ru/?ysclid=mmj8rm5wa0423022137"}>
            <img
              className="partnersLogoElem"
              src={navigator}
              alt="navigator-light"
            />
          </Link>
          <Link to={"https://tokov.pro/"}>
            <img
              className="partnersLogoElem"
              src={tokovElectric}
              alt="TokovElectric"
            />
          </Link>
          <Link to={"https://www.ledvance.com/en-int/professional-lighting"}>
            <img className="partnersLogoElem" src={leadvance} alt="leadcance" />
          </Link>
          <Link to={"https://chint.ru/"}>
            <img className="partnersLogoElem" src={chint} alt="chint" />
          </Link>

          <Link
            to={
              "https://univ.su/index.php/katalog-mob/elektroustanovochnye-izdeliya"
            }
          >
            <img className="partnersLogoElem" src={universal} alt="universal" />
          </Link>
          <Link to={"https://arlight.ru/?ysclid=mmm44pyrq9155976504"}>
            <img className="partnersLogoElem" src={arlight} alt="arlight" />
          </Link>
          <Link to={"https://www.ballu.ru/"}>
            <img className="partnersLogoElem" src={bailu} alt="bailu" />
          </Link>
          <Link to={"https://www.eraworld.ru/?ysclid=mmm45h2i22872225559"}>
            <img className="partnersLogoElem" src={era} alt="era" />
          </Link>
          <Link to={"https://www.delta-battery.ru/?ysclid=mmm46sz6dp883156515"}>
            <img className="partnersLogoElem" src={delta} alt="delta" />
          </Link>
          <Link to={"https://keaz.ru/catalog?ysclid=mmm47bus3y178777686"}>
            <img className="partnersLogoElem" src={keaz} alt="keaz" />
          </Link>
          <Link to={"https://in-home.ru/?ysclid=mmm48wpkj4966795684"}>
            <img className="partnersLogoElem" src={inHome} alt="inhome" />
          </Link>
          <Link to={"https://www.ltcompany.com/"}>
            <img
              className="partnersLogoElem"
              src={lighttecknologies}
              alt="lighttecknologies"
            />
          </Link>
          <Link to={"https://chint.ru/"}>
            <img className="partnersLogoElem" src={dekraft} alt="dekraft" />
          </Link>
        </div>
      </div>
      <div className="contactsWrap animFlag">
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
              <p className="about-accordionSubtitle">Реквизиты компании</p>
            </div>
            <hr className="accordionBorder"></hr>
            <div
              ref={content}
              style={{ maxHeight: `${setHeight}` }}
              className="about-hiddenWrap"
            >
              <p className="about-hiddenText">
                <span className="boldText">
                  Директор:<br></br>
                </span>{" "}
                Яковлев Евгений Павлович<br></br>
                <span className="boldText">ОГРН:</span> 1235900001633
                <br></br>
                <span className="boldText">ИНН:</span> 5948067245<br></br>
                <span className="boldText">КПП:</span> 594801001<br></br>
                <span className="boldText">ОКПО:</span> 96015118<br></br>
                <span className="boldText">Дата регистрации:</span> 31 января
                2023 года<br></br>
                <span className="boldText">Юридический адрес:</span>
                <br></br>
                614530, Пермский край, м. о. Пермский, д. Якунчики, ул.
                Подлесная, д. 15
              </p>
              <hr className="about-accordionBorder"></hr>
            </div>
          </div>
          <p className="contactsFooter">
            Пермский край, м. о. Пермский, д. Якунчики, ул. Подлесная, д. 15
            <br></br>
            +7 (950) 469-12-98<br></br>
            tranzitelektro@bk.ru
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
