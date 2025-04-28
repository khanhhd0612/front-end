import Cookies from "js-cookie"
import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"

export default function ListSection() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [nameExam, setNameExam] = useState('')
    const [originalName, setOriginalName] = useState('')
    const [nameSection, setNameSection] = useState('')
    const token = Cookies.get('token')
    const { examId } = useParams()

    const fetchData = async () => {
        try{
            const res = await axios.get(`${process.env.REACT_APP_API_URL}api/exam/${examId}/sections`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setNameExam(res.data.exam)
            setOriginalName(res.data.exam)
            setData(res.data.section)
        }catch(err){
            if (err.response?.status === 500){
                navigate('/500');
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteSection = async (sectionId) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}api/exam/${examId}/sections/${sectionId}`,
                { headers: { authorization: `Bearer ${token}` } }
            )

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
            if (nameExam.trim() === originalName.trim()) {
                Swal.fire({ title: "Tên chưa thay đổi", icon: "info" })
                return;
            }
            const res = await axios.put(`${process.env.REACT_APP_API_URL}api/update/exam/${examId}`,
                {
                    name: nameExam
                }, { headers: { authorization: `Bearer ${token}` } }
            )
            if (res.status === 200) {
                Swal.fire({ title: "Đổi tên thành công", icon: "success" })
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
    
            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/exam/${examId}/sections`,
                { name: validateName },
                { headers: { authorization: `Bearer ${token}` } }
            )
    
            if (res.status === 200) {
                Swal.fire({ title: "Thêm phần thi thành công", icon: "success" })
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
                                                    <td><input className="border p-2 w-100" type="text" value={nameExam} onChange={(e) => { setNameExam(e.target.value) }} /></td>
                                                    <td><label onClick={handleReNameExam} className="badge badge-success btn"><i className="fa fa-save"></i></label></td>
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
                                                    <td><input className="border p-2 w-100" type="text" placeholder="Nhập tên phần thi" required value={nameSection} onChange={(e) => { setNameSection(e.target.value) }} /></td>
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
                    </div >
                </div>
            </div>
        </div>
    )
}
