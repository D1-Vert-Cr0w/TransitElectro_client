import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/discountdetails.css";
import { useParams } from "react-router-dom";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import AOS from "aos";
function DiscountDitails() {
  const [discountData, setDiscountData] = useState([]);
  const params = useParams();
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    axios
      .get(`https://tranzitelektro.ru/api/discount/single/${params.title}`)
      .then((response) => {
        setDiscountData(response.data);
        console.log(response.data);
        document.documentElement.scrollTo(0, 0);
      });
  }, []);
  return (
    <>
      {pageLoaded == true ? (
        <>
          <div className="headerWrap">
            <Header />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div className="pageContainer">
              <div className="mainInfo-container">
                <div className="mainInfo-textWrap">
                  <h1 className="mainInfo-header">{discountData.title}</h1>
                  <div className="mainInfo-text">{discountData.text}</div>
                </div>
                <img className="mainInfo-img" src={discountData.image} />
              </div>
              {discountData.ditails && discountData.ditails.length > 0 && (
                <div className="details-container">
                  {discountData.ditails.map((detail) => (
                    <>
                      <h1 className="ditailsTitle">{detail?.title}</h1>
                      <p className="ditailsText">{detail?.text}</p>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="prodFooterWrap">
            <Footer />
          </div>
        </>
      ) : (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      )}
    </>
  );
}
export default DiscountDitails;
