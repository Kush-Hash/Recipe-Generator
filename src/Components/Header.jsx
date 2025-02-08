import React from 'react'
import cheflogo from '../assets/logo.png'

const Header = () => {
    return (
        <>
            <nav>
                <img className='logo' src={cheflogo} alt="logo" />
                <p className='logo'>Chef GPT</p>
            </nav>
        </>
    )
}

export default Header
