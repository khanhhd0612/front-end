import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
export default function Header() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('')
    const handleSearch = async (e) => {
        e.preventDefault()
        if (query) {
            navigate(`/tim-kiem?q=${query}`);
        }
    }
    const handleLogout = () => {
        Cookies.remove('token')
        window.location = "/dang-nhap"
    }
    const handleClickFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Lỗi khi bật full screen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    const body = document.getElementsByTagName('body')[0]
    const toggleClick = () => {
        body.classList.toggle('sidebar-icon-only');
    };

    const handleClickUser = () => {
        const profileDropdown = document.getElementById('profileDropdown')
        const navbarDropdown = document.getElementById('navbar-dropdown')
        if(profileDropdown || navbarDropdown){
            profileDropdown.classList.toggle('show')
            navbarDropdown.classList.toggle('show')
        }
    }

    const handleClickNavBar = () => {
        const navBar = document.getElementById('sidebar')
        if (navBar) {
            navBar.classList.toggle('active')
        }
    }
    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
                <Link to="/" className="navbar-brand brand-logo"><img src={process.env.PUBLIC_URL + "/assets/images/logo.svg"} alt="logo" /></Link>
                <Link to="/" className="navbar-brand brand-logo-mini"><img src={process.env.PUBLIC_URL + "/assets/images/logo-mini.svg"}
                    alt="logo" /></Link>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={toggleClick}>
                    <span className="mdi mdi-menu"></span>
                </button>
                <div className="search-field d-none d-md-block">
                    <form className="d-flex align-items-center h-100" onSubmit={handleSearch}>
                        <div className="input-group">
                            <div className="input-group-prepend bg-transparent">
                                <i className="input-group-text border-0 mdi mdi-magnify"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control bg-transparent border-0"
                                placeholder="Tìm kiếm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                required
                            />
                        </div>
                    </form>
                </div>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-profile dropdown" onClick={handleClickUser}>
                        <a className="nav-link dropdown-toggle" id="profileDropdown">
                            <div className="nav-profile-img">
                                <img src={process.env.PUBLIC_URL + "/assets/images/user_img.png"} alt="image" />
                                <span className="availability-status online"></span>
                            </div>
                        </a>
                        <div id="navbar-dropdown" className="dropdown-menu navbar-dropdown">
                            <Link to='/thong-tin-nguoi-dung' className="dropdown-item">
                                <i className="mdi mdi-cached me-2 text-success"></i> Hồ sơ</Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item">
                                <i className="mdi mdi-logout me-2 text-primary"></i>Đăng xuất</button>
                        </div>
                    </li>
                    <li className="nav-item d-none d-lg-block full-screen-link">
                        <a className="nav-link">
                            <i className="mdi mdi-fullscreen" onClick={handleClickFullScreen}></i>
                        </a>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button"
                    onClick={handleClickNavBar}>
                    <span className="mdi mdi-menu"></span>
                </button>
            </div>
        </nav>
    )
}