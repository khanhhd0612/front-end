import { Link } from "react-router-dom"
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorLogin, setErrorLogin] = useState('')
    const [successLogin, setSuccessLogin] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/login`,
                { email, password, })
            if (response.data.message) {
                setEmail('')
                setPassword('')
                setErrorLogin('')
                Cookies.set('token', response.data.token, { expires: 7 })
                setSuccessLogin(response.data.message)
                window.location = "/"
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorLogin('Sai tên đăng nhập hoặc mật khẩu!')
            }
        }
    }
    return (
        <div className="container-scroller">
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="content-wrapper d-flex align-items-center auth">
                    <div className="row flex-grow">
                        <div className="col-lg-4 mx-auto">
                            <div className="auth-form-light text-left p-5">
                                <div className="brand-logo">
                                    <img src="assets/images/logo.svg" />
                                </div>
                                <h6 className="font-weight-light">Đăng nhập để tiếp tục</h6>
                                <form onSubmit={handleLogin} className="pt-3">
                                    {errorLogin && <p style={{ color: 'red' }}>{errorLogin}</p>}
                                    {successLogin && <p style={{ color: 'green' }}>{successLogin}</p>}
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="mt-3 d-grid gap-2">
                                        <button type="submit" className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">Đăng nhập</button>
                                    </div>
                                    <div className="my-2 d-flex justify-content-between align-items-center">

                                        <a href="#" className="auth-link text-primary">Quên mật khẩu ?</a>
                                    </div>
                                    {/* <div className="mb-2 d-grid gap-2">
                                        <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                                            <i className="mdi mdi-facebook me-2"></i>Connect using facebook </button>
                                    </div> */}
                                    <div className="text-center mt-4 font-weight-light">Không có tài khoản? <Link to="/dang-ky" className="text-primary">Đăng ký</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}