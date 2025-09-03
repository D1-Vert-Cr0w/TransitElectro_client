import { useState, useEffect } from "react";
import Item from "../components/item.jsx";
import "../styles/mainpage.css";
import Footer from "../components/footer.jsx";
import Header from "../components/header.jsx";
import DivideImg from "../assets/dividimg.svg";
import ProdCarousel from "../components/prodCarousel.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
function Main() {
  const [newitems, setNewItems] = useState([]);
  const [popitems, setPopItems] = useState([]);
  useEffect(() => {
    axios.get("/api/colection/new").then((response) => {
      setNewItems(response.data);
    });
  }, []);
  useEffect(() => {
    axios.get("api/colection/pop").then((response) => {
      setPopItems(response.data);
    });
  }, []);

  const images = [
    {
      id: 1,
      title: "",
      text: "",
      compsrc: "main-banner-photo-1.jpg",
      mobsrc: "main-banner-photo-1.jpg",
      src: "",
    },
  ];
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <>
      <div className="mainHeaderWrap">
        <Header />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div className="banerContentWrap">
          {images.map((image) => (
            <div
              className="carouselWrap"
              style={{ transform: `translate(${-100 * imageIndex}%)` }}
            >
              <picture className="carouselItem">
                <source
                  media="(max-width:576px)"
                  srcSet={`./${image.mobsrc}`}
                />
                <img className="carouselItem" src={`./${image.compsrc}`}></img>
              </picture>
              <div className="banerContainer">
                <p className="banerMainTitle">{image.title}</p>
                <p className="banerMainText">{image.text}</p>
                {image.src != "" ? (
                  <Link to={image.src}>
                    <div className="banerButton">Подробнее</div>
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="banerNav">
        <div
          style={{ display: `${images.length != 1 ? "block" : "none"}` }}
          className="dotContainer"
        >
          {images.map((_, index) => (
            <div
              className={`circle ${index === imageIndex ? "activeDot" : ""}`}
              onClick={() => setImageIndex(index)}
            ></div>
          ))}
        </div>
      </div>
      <h1 className="itemsLable">Новинки</h1>
      <div className="swiper-pos-wrapper">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={true}
          slidesPerView={1}
          navigation={true}
          breakpoints={{
            690: {
              slidesPerView: 2,
            },
            1090: {
              slidesPerView: 3,
            },
            1360: {
              slidesPerView: 4,
            },
          }}
        >
          {newitems.map((product) => (
            <SwiperSlide>
              <Item
                key={product.id}
                name={product.name}
                price={product.price}
                code={product.code}
                image={product.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="divideContainer">
        <hr className="dividHr"></hr>
        <img className="dividImg" src={DivideImg} />
        <hr className="dividHr"></hr>
      </div>
      <h1 className="itemsLable">Популярные товары</h1>
      <div className="footerPos">
        <div className="swiper-pos-wrapper">
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={true}
            slidesPerView={1}
            navigation={true}
            breakpoints={{
              690: {
                slidesPerView: 2,
              },
              1090: {
                slidesPerView: 3,
              },
              1360: {
                slidesPerView: 4,
              },
            }}
          >
            {popitems.map((product) => (
              <SwiperSlide>
                <Item
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  code={product.code}
                  image={product.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
export default Main;
