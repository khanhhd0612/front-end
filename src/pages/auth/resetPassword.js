import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../config/axiosConfig"
import nProgress from 'nprogress';

export default function ResetPassword() {
    const { token } = useParams()
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Mật khẩu không trùng khớp!');
            return;
        }
        resetPassword()
    }
    const resetPassword = async () => {
        setIsDisabled(true)

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
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (err) {
            if (err.response?.status === 404) {
                Swal.fire({
                    title: err.response.data.message,
                    icon: "error",
                    draggable: true
                });
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
                                <h6 className="font-weight-light">Lấy lại mật khẩu</h6>
                                <form onSubmit={handleSubmit} className="pt-3">
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword2" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
                                                "Lưu mật khẩu"
                                            )}
                                        </button>
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