import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../config/axiosConfig"
import nProgress from 'nprogress';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams()
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [captcha, setCaptcha] = useState('')
    const [captchaInput, setCaptchaInput] = useState('')
    const canvasRef = useRef(null)

    const generateCaptcha = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setCaptcha(code)
    }
    const drawCaptcha = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = "24px Arial"
        ctx.fillStyle = "#000"
        for (let i = 0; i < captcha.length; i++) {
            const angle = (Math.random() - 0.5) * 0.4
            ctx.save()
            ctx.translate(20 + i * 22, 30)
            ctx.rotate(angle)
            ctx.fillText(captcha[i], 0, 0)
            ctx.restore()
        }

        for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
            ctx.strokeStyle = "rgba(0,0,0,0.1)"
            ctx.stroke()
        }
    }

    useEffect(() => {
        generateCaptcha()
    }, [])

    useEffect(() => {
        if (captcha) drawCaptcha()
    }, [captcha])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Mật khẩu không trùng khớp!');
            return;
        }
        if (captchaInput !== captcha) {
            setError("Mã xác thực không đúng")
            generateCaptcha()
            setCaptchaInput("")
            return
        }
        resetPassword()
    }
    const resetPassword = async () => {
        try {
            nProgress.start()
            const res = await api.put(`/reset/password/`,
                {
                    token,
                    password,
                });
            if (res.status === 200) {
                setError('')
                setPassword('')
                setConfirmPassword('')
                setCaptchaInput("")
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (err) {
            if (err.response?.status === 404) {
                generateCaptcha()
                setCaptchaInput("")
                Swal.fire({
                    title: err.response.data.message,
                    icon: "error",
                    draggable: true
                });
            }
        } finally {
            nProgress.done()
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
                                <h6 className="font-weight-light">Lấy lại mật khẩu</h6>
                                <form onSubmit={handleSubmit} className="pt-3">
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword2" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <canvas ref={canvasRef} width={150} height={40} style={{ border: '1px solid #ccc', display: 'block', marginBottom: '10px' }} />
                                        <div className="d-flex">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã CAPTCHA"
                                                value={captchaInput}
                                                onChange={(e) => setCaptchaInput(e.target.value)}
                                                required
                                            />
                                            <button type="button" className="btn btn-light ms-2" onClick={generateCaptcha}><i className="fa fa-history"></i></button>
                                        </div>
                                    </div>
                                    <div className="mt-3 d-grid gap-2">
                                        <button type='submit' className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">Lưu mật khẩu</button>
                                    </div>
                                    <div className="text-center mt-4 font-weight-light">Đã có tài khoản ? <Link to="/dang-nhap" className="text-primary">Đăng nhập</Link>
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