import "../styles/item.css";
import { Link } from "react-router-dom";
import CogScreen from "../assets/cogscreen.svg";
import { useState } from "react";
function Item(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <div className={"cardWraper"}>
        <Link to={`/product/${props.name}`}>
          <div className="cardImageContainer">
            {!imageLoaded && <div className="skeleton-shimmer-small"></div>}
            <img
              className="cardImage"
              src={props.image}
              alt={CogScreen}
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            ></img>
          </div>
          <p className="productName">{props.name}</p>

          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default Item;
