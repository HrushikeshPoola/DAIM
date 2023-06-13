
import React from 'react'
import styles from '../styles/Header.module.css';


const Header = () => {
    return (
        <div id='appHeader' className={styles.HeaderContainer}>
            {'DAIM (Digital Asset Investment Management)'}
        </div>
    );
}

export default Header;