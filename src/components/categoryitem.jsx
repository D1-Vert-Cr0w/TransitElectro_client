import "../styles/categorycard.css";
import { Link } from "react-router-dom";
function CategoryItem(props) {
  return (
    <>
      <div className="categoryCardWraper">
        <img className="categoryCardImage" src={props.image}></img>
        <p className="categoryProductName">{props.name}</p>
        <Link to={props.src}>
          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default CategoryItem;
