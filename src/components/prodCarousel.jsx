import "../styles/prodCarousel.css";
import Arrow from "../assets/arrow.svg";
import { useEffect, useState } from "react";
function ProdCarousel(props) {
  const [itemIndex, setItemIndex] = useState(0);
  const [scrollMax, setScrollMax] = useState(0);
  const mbl = window.matchMedia("(max-width: 576px)");
  const tblt = window.matchMedia("(max-width: 840px)");
  const desc = window.matchMedia("(max-width: 1080px)");
  useEffect(() => {
    if (itemIndex > scrollMax) {
      setItemIndex(scrollMax);
    }
  }, [scrollMax]);
  function showWidth() {
    if (window.innerWidth > 1080) {
      setScrollMax(props.content.length - 4);
      return;
    }
    if (window.innerWidth > 840) {
      setScrollMax(props.content.length - 3);
      return;
    }
    if (window.innerWidth > 576) {
      setScrollMax(props.content.length - 2);
      return;
    } else {
      setScrollMax(props.content.length - 1);
      return;
    }
  }
  desc.addEventListener("change", () => {
    showWidth();
  });
  tblt.addEventListener("change", () => {
    showWidth();
  });
  mbl.addEventListener("change", () => {
    showWidth();
  });
  useEffect(() => {
    showWidth();
  }, []);
  return (
    <>
      <div className="itemPosWrap">
        <div className="arrowCircle">
          <img
            src={Arrow}
            style={{ display: `${itemIndex != 0 ? "block" : "none"}` }}
            className={"btnArrow left_arrow"}
            onClick={() => setItemIndex(itemIndex != 0 ? itemIndex - 1 : 0)}
          />
        </div>
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div
            className="itemsContentWrap"
            style={{
              marginLeft: `${itemIndex != 0 ? "0px" : "40px"}`,
              marginRight: `${itemIndex != scrollMax ? "0px" : "40px"}`,
            }}
          >
            {props.content.map((item) => (
              <div
                className="itemCarouselWrap"
                style={{
                  transform: `translate(${
                    window.innerWidth > 1080
                      ? -275 * itemIndex
                      : -255 * itemIndex
                  }px)`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="arrowCircle">
          <img
            src={Arrow}
            style={{ display: `${itemIndex != scrollMax ? "block" : "none"}` }}
            className="btnArrow right_arrow"
            onClick={() => setItemIndex(itemIndex + 1)}
          />
        </div>
      </div>
    </>
  );
}
export default ProdCarousel;
