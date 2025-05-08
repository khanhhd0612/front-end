import React, { useState } from 'react'
import api from "../../config/axiosConfig"
import Swal from "sweetalert2"
import NProgress from 'nprogress'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsDisabled(true)

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
            }
        } catch (err) {
            Swal.fire({
                title: err.response?.data?.message || "Đã có lỗi xảy ra",
                icon: "error",
                draggable: true,
            })
        } finally {
            setIsDisabled(false)
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
                                                "Gửi"
                                            )}
                                        </button>
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
