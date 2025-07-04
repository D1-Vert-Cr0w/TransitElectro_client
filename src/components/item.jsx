import "../styles/item.css";
import { Link } from "react-router-dom";
function Item(props) {
  return (
    <>
      <div
        className={`${
          props.status == "extraItem" ? "cardWraper extraItem" : "cardWraper"
        }`}
      >
        <div className="cardImageContainer">
          <img className="cardImage" src={props.image}></img>
        </div>
        <p className="productName">{props.name}</p>
        <Link to={`/product/${props.name}`}>
          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default Item;
