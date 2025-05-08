import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import React, { useState, useRef, useEffect } from 'react'
import nProgress from 'nprogress'
import api from "../../config/axiosConfig"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorLogin, setErrorLogin] = useState('')
    const [successLogin, setSuccessLogin] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsDisabled(true)

        nProgress.start()
        try {
            const response = await api.post(`/login`, { email, password })
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
                setErrorLogin(error.response.data.message)
                setSuccessLogin("")
            }
        } finally {
            nProgress.done()
            setIsDisabled(false)
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
                                    <img src="assets/images/logo.jpg" />
                                </div>
                                <h6 className="font-weight-light">Đăng nhập để tiếp tục</h6>
                                <form onSubmit={handleLogin} className="pt-3">
                                    {errorLogin && <p style={{ color: 'red' }}>{errorLogin}</p>}
                                    {successLogin && <p style={{ color: 'green' }}>{successLogin}</p>}
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-lg" placeholder="Email"
                                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" placeholder="Mật khẩu"
                                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="mt-3 d-grid gap-2">
                                        <button type="submit"
                                            className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                                            disabled={isDisabled}
                                        >
                                            {isDisabled ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                </>
                                            ) : (
                                                "Đăng nhập"
                                            )}
                                        </button>
                                    </div>
                                    <div className="my-2 d-flex justify-content-between align-items-center">
                                        <Link to="/quen-mat-khau" className="auth-link text-primary">Quên mật khẩu?</Link>
                                    </div>
                                    <div className="text-center mt-4 font-weight-light">
                                        Không có tài khoản? <Link to="/dang-ky" className="text-primary">Đăng ký</Link>
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
