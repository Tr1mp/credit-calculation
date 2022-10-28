import { slide as Menu } from 'react-burger-menu'

import './hamburger.scss';


const Hamburger = (props) =>  {
    // constructor (props) {
    //     super();
    //     this.props = props
    // }
    // const showSettings = (event) => {
    //     event.preventDefault();

    // }
        
        return (
            <Menu right width={'250px'}>
                {props.elem}
                {/* <a id="contact" className="menu-item" href="/contact">Contact</a> */}
                {/* <a onClick={ showSettings } className="menu-item--small" href="">Settings</a> */}
            </Menu>
        );

}

export default Hamburger