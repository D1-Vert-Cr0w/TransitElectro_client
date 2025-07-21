import "../styles/dropdown.css";
import Arrow from "../assets/arrow.svg";
import { useEffect, useRef, useState } from "react";
function Dropdown(props) {
  const [isMenuItem, setIsMenuItem] = useState(props.isMobileMenu ?? "");
  const [isOpen, setOpen] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);
  function toggleAccordion() {
    setOpen(isOpen === "active" ? "" : "active");
    setHeightState(isOpen === "active" ? "0px" : `2000px`);
  }
  useEffect(() => {
    if (window.innerWidth > 768) {
      toggleAccordion();
    }
  }, []);
  return (
    <>
      <div className="accordion">
        <div className={` ${isOpen ? "titleWrap" : ""}`}>
          <div className={` ${isMenuItem ? "mobileTranslate" : ""}`}>
            <img
              src={Arrow}
              className={`arrowButton  ${isOpen ? "arrowActive" : ""}`}
              onClick={toggleAccordion}
            />
            <p className="accordionSubtitle">{props.title}</p>
          </div>
        </div>
        <hr className="accordionBorder"></hr>
        <div
          ref={content}
          style={{ maxHeight: `${setHeight}` }}
          className="hiddenWrap"
        >
          {props.content}
        </div>
      </div>
    </>
  );
}
export default Dropdown;
