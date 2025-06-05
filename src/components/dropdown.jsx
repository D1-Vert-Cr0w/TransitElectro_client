import "../styles/dropdown.css";
import Arrow from "../assets/arrow.svg";
import { useEffect, useRef, useState } from "react";
function Dropdown(props) {
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
      <div className="accordion">
        <div className={` ${isOpen ? "titleWrap" : ""}`}>
          <img
            src={Arrow}
            className={`arrowButton ${isOpen ? "arrowActive" : ""}`}
            onClick={toggleAccordion}
          />
          <p className="accordionSubtitle">{props.title}</p>
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
