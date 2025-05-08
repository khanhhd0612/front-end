import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../config/axiosConfig"
import nProgress from 'nprogress';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [agree, setAgree] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const handleRegister = (e) => {
        e.preventDefault()
        setIsDisabled(true)
        setErrors({});
        if (!agree) {
            Swal.fire({
                title: "Bạn phải đồng ý với điều khoản sử dụng !",
                icon: "error",
                draggable: true
            });
            return
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu không trùng khớp!');
            return;
        } else {
            setError('');
        }
        register()
    }
    const register = async () => {
        try {
            nProgress.start()
            const response = await api.post(`/register`, {
                name,
                email,
                password,
            });
            if (response.data.user) {
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setErrors('')
                setAgree(false)
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
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
                                <h6 className="font-weight-light">Đăng ký để sử dụng dịch vụ !</h6>
                                <form onSubmit={handleRegister} className="pt-3">
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                                    {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                                    {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" id="exampleInputUsername1" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="exampleInputPassword2" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            className="form-check-input mx-1"
                                            type="checkbox"
                                            checked={agree}
                                            onChange={() => setAgree(!agree)}
                                        />
                                        <label className="form-check-label text-muted" htmlFor="autoNextCheckbox">
                                            Tôi đồng ý với điều khoản sử dụng
                                        </label>
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
                                                "Đăng ký"
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