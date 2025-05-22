import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../config/axiosConfig"

export default function ListSection() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [isPublic, setIsPublic] = useState(true)
    const [timeLimit, setTimeLimit] = useState(1)
    const [nameExam, setNameExam] = useState('')
    const [nameSection, setNameSection] = useState('')
    const { examId } = useParams()

    const fetchData = async () => {
        try {
            const res = await api.get(`/exam/${examId}/sections`)
            setNameExam(res.data.exam)
            setData(res.data.section)
        } catch (err) {
            if (err.response?.status === 500) {
                navigate('/500');
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteSection = async (sectionId) => {
        try {
            const res = await api.delete(`/exam/${examId}/sections/${sectionId}`)

            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa bài thi", "error")
            }
        }
    }

    const handleDelete = (sectionId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSection(sectionId)
            }
        })
    }
    const handleReNameExam = async () => {
        try {
            const res = await api.put(`/update/exam/${examId}`,
                {
                    name: nameExam,
                    isPublic: isPublic,
                    timeLimit: timeLimit
                }
            )
            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi đổi tên bài thi", "error")
            }
        }
    }

    const addSection = async () => {
        try {
            const validateName = nameSection.trim()

            if (!validateName) {
                Swal.fire({ title: "Tên phần thi không được để trống", icon: "warning" })
                return
            }

            const res = await api.post(`/exam/${examId}/sections`,
                { name: validateName }
            )

            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
                setNameSection('')
                fetchData()
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi thêm phần thi", "error")
            }
        }
    }
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-lg-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Bài thi</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Đổi tên bài thi</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input className="border rounded p-2 w-100" type="text" value={nameExam} onChange={(e) => { setNameExam(e.target.value) }} /></td>
                                                    <td><label onClick={handleReNameExam} className="badge badge-success btn"><i className="fa fa-save"></i></label></td>
                                                </tr>
                                                <tr>
                                                    <td><div className="input-group mb-3 mt-3">
                                                        <label className="input-group-text" htmlFor="inputGroupSelect01">Quyền riêng tư </label>
                                                        <select
                                                            value={isPublic.toString()}
                                                            onChange={(e) => setIsPublic(e.target.value === 'true')}
                                                            className="form-select"
                                                            id="inputGroupSelect01"
                                                        >
                                                            <option value="true">Công khai</option>
                                                            <option value="false">Chỉ mình tôi </option>
                                                        </select>
                                                    </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="input-group mb-3 mt-3">
                                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Giới hạn thời gian </label>
                                                            <select
                                                                value={timeLimit}
                                                                onChange={(e) => setTimeLimit(e.target.value)}
                                                                className="form-select"
                                                                id="inputGroupSelect01"
                                                            >
                                                                <option value="10">10 phút</option>
                                                                <option value="15">15 phút</option>
                                                                <option value="30">30 phút</option>
                                                                <option value="60">60 phút</option>
                                                                <option value="90">90 phút</option>
                                                                <option value="120">120 phút</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Thêm phần thi </h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Tên phần thi </th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input className="border rounded p-2 w-100" type="text" placeholder="Nhập tên phần thi" required value={nameSection} onChange={(e) => { setNameSection(e.target.value) }} /></td>
                                                    <td><label onClick={addSection} className="badge badge-success btn"><i className="fa fa-save"></i></label></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Danh sách phần thi</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Tên phần thi</th>
                                                    <th>Số câu hỏi</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.questions?.length}</td>
                                                        <td>
                                                            <Link to={`/edit/exam/${examId}/section/${item._id}/question/add`}><label className="badge badge-success mx-1"><i className="fa fa-plus-square-o"></i></label></Link>
                                                            <Link to={`/edit/exam/${examId}/section/${item._id}/questions`}><label className="badge badge-warning mx-1"><i className="fa fa-pencil"></i></label></Link>
                                                            <label onClick={() => handleDelete(item._id)} className="badge badge-danger"><i className="fa fa-trash-o"></i></label>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
