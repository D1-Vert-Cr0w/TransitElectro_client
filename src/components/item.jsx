import "../styles/item.css";
import { Link } from "react-router-dom";
function Item(props) {
  return (
    <>
      <Link to={`/product/${props.name}`}>
        <div
          className={`${
            props.status == "extraItem" ? "cardWraper extraItem" : "cardWraper"
          }`}
        >
          <div className="cardImageContainer">
            <img className="cardImage" src={props.image}></img>
          </div>
          <p className="productName">{props.name}</p>

          <button className="toCart">Подробнее</button>
        </div>
      </Link>
    </>
  );
}
export default Item;
