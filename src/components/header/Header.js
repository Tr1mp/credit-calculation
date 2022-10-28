import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/windowDimensions";

import ggwp from "./logo.png"


import "./header.scss";
import Hamburger from "../hamburger/Hamburger";

const Header = () => {
    const {width} = useWindowDimensions();

    const menu = () => {
        const elem = (
            <>
                <Link to="/credit">Расчитай кредит</Link>
                <Link to="/contacts">Контакты</Link>
            </>
        )
        if (width <= 600) {
            return (
                <div className="header-wrapper">
                    <Hamburger elem={elem}/>
                </div>
                
            )
        } else {
            return (
                <>
                    {elem}
                </>
            )
        }

    }

    const elements = menu()
    return (
        <div className="header">
            <img className="header-img" src={ggwp} alt="logo"/>
            {elements}
        </div>
    )
}

export default Header;