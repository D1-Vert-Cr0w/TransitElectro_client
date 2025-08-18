import "../styles/categorycard.css";
import { Link } from "react-router-dom";
function CategoryItem(props) {
  return (
    <>
      <Link to={props.src}>
        <div className="categoryCardWraper">
          <div className="categoryCardImageWrap">
            <img className="categoryCardImage" src={props.image}></img>
          </div>
          <p className="categoryProductName">{props.name}</p>

          <button className="toCart">Подробнее</button>
        </div>
      </Link>
    </>
  );
}
export default CategoryItem;
