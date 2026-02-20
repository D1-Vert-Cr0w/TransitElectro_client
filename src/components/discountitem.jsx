import { Link } from "react-router-dom";
import "../styles/discountitem.css";
import { useState } from "react";
function DiscountItem(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <div className="pageContainer">
        <div className="Info-container">
          <img
            className="mainInfo-img"
            src={props.image}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          ></img>
          {!imageLoaded && <div className="skeleton-shimmer"></div>}
          <div className="Info-textWrap">
            <h1 className="Info-header">{props.title}</h1>
            <div className="Info-text">{props.text}</div>
            <Link to={`ditails/${props.title}`}>
              <button className="ditails">Подробнее</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default DiscountItem;
