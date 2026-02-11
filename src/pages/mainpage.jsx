import { useState, useEffect } from "react";
import Item from "../components/item.jsx";
import "../styles/mainpage.css";
import Footer from "../components/footer.jsx";
import Header from "../components/header.jsx";
import DivideImg from "../assets/dividimg.svg";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AOS from "aos";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
function Main() {
  const [newitems, setNewItems] = useState([]);
  const [bannerItems, setBannerItems] = useState([]);
  const [popitems, setPopItems] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    axios
      .get("https://tranzitelektro.ru/api/colection/new")
      .then((response) => {
        setNewItems(response.data);
      });
    axios
      .get("https://tranzitelektro.ru/api/colection/pop")
      .then((response) => {
        setPopItems(response.data);
      });
    axios.get("https://tranzitelektro.ru/api/banner/list").then((response) => {
      setBannerItems(response.data);
    });
  }, []);
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <>
      {pageLoaded == false ? (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      ) : null}
      <div className="mainHeaderWrap">
        <Header />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div className="banerContentWrap">
          {bannerItems.map((image) => (
            <div
              className="carouselWrap"
              style={{ transform: `translate(${-100 * imageIndex}%)` }}
            >
              {image.url == "-" ? (
                <img className="carouselItem" src={image.image}></img>
              ) : (
                <Link to={image.url}>
                  <img className="carouselItem" src={image.image}></img>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="banerNav">
        <div className="dotContainer">
          {bannerItems.map((_, index) => (
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
          autoplay={5000}
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
            autoplay={5000}
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
                  id={product.id}
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
