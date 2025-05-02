import { Link } from "react-router-dom"
import React, { useState, useRef, useEffect } from 'react'
import api from "../../config/axiosConfig"
import Swal from "sweetalert2"
import NProgress from 'nprogress'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
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

        // Noise
        for (let i = 0; i < 6; i++) {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (captchaInput !== captcha) {
            Swal.fire({
                title: "Mã xác thực không đúng",
                icon: "error"
            })
            generateCaptcha()
            setCaptchaInput("")
            return
        }

        NProgress.start()
        try {
            const res = await api.post(`forgot/password/`, { email })
            if (res.status === 200) {
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true,
                })
                setEmail("")
                setCaptchaInput("")
                generateCaptcha()
            }
        } catch (err) {
            Swal.fire({
                title: err.response?.data?.message || "Đã có lỗi xảy ra",
                icon: "error",
                draggable: true,
            })
        } finally {
            NProgress.done()
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
                                <h6 className="font-weight-light">Nhập email của bạn </h6>
                                <form onSubmit={handleSubmit} className="pt-3">
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-lg" placeholder="Email"
                                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>

                                    {/* CAPTCHA */}
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
                                        <button type="submit" className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">Gửi</button>
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
