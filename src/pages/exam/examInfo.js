import Header from "../../components/layouts/header"
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../config/axiosConfig";
import nProgress from "nprogress";
import Swal from "sweetalert2";

export default function InfomationExam() {
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()
    const [examTitle, setExamTitle] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const { id } = useParams()
    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`exam/${id}`)
            if (res.status === 200) {
                setExamTitle(res.data.name)
                setCreatedBy(res.data.createdBy.name)
                setCreatedAt(res.data.createdAt)
            }
        } catch (err) {
            if (err.response.status === 500) {
                navigate('/500')
            }
        } finally {
            nProgress.done()
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="position-absolute top-0 right-0 left-0 bottom-0 page-bg w-100">
            <Header />
            <div className="container-fluid">
                <div className="main-content container-fuild">
                    <div className="card">
                        <div className="card-header p-3">
                            <h4>Thông tin đề thi</h4>
                        </div>
                        <div className="card-content p-3">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="my-5 px-3 w-100">
                                        <img className="w-100" src="/assets/images/background-hoc-tap-54.jpg" />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="mt-5 px-3">
                                        <h3>{examTitle}</h3>
                                        <div className="d-flex align-items-center mt-3">
                                            <img className="rounded-circle logo-user-update-exam"
                                                src="/assets/images/user_img.jpg" alt="user" />
                                            <div className="">{createdBy}</div>
                                        </div>
                                        <div className="d-flex align-items-center mt-3">
                                            <span><i className="fa fa-clock-o p-1"></i></span>
                                            {createdAt.slice(0, 10)}
                                        </div>
                                        <div className="d-flex align-items-center mt-3">
                                            <label title="Số câu hỏi" className="badge badge-gradient-warning p-2">
                                                <span><i className="fa fa-question-circle p-1"></i></span>
                                                200
                                            </label>

                                            <label title="Lượt thi" className="badge badge-gradient-success p-2 mx-2">
                                                <span><i className="fa fa-bar-chart-o p-1"></i></span>
                                                200
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="mt-5 px-3">
                                        <h3>Chia sẻ đề thi</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-4 mt-2">
                                    <Link className="btn btn-primary w-100 px-3">
                                        <i className="fa fa-play-circle-o mx-1"></i>
                                        Bắt đầu ôn thi
                                    </Link>
                                </div>
                                <div className="col-lg-4 mt-2">
                                    <Link className="btn btn-primary w-100 px-3">
                                        <i className="fa fa-play-circle-o mx-1"></i>
                                        Thi thử
                                    </Link>
                                </div>
                                <div className="col-lg-4 mt-2 d-none d-lg-block">
                                    <Link className="btn btn-primary w-100 px-3">
                                        <i className="fa fa-download mx-1"></i>
                                        Tải xuống
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}