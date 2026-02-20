import "../styles/categorycard.css";
import { Link } from "react-router-dom";
import CogScreen from "../assets/cogscreen.svg";
import { useState } from "react";
function CategoryItem(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <div className="categoryCardWraper">
        <Link to={props.src}>
          <div className="categoryCardImageWrap">
            {!imageLoaded && <div className="skeleton-shimmer-small"></div>}
            <img
              className="categoryCardImage"
              src={props.image}
              alt={CogScreen}
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            ></img>
          </div>
          <p className="categoryProductName">{props.name}</p>
          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default CategoryItem;
