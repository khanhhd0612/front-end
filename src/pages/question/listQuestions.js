import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../config/axiosConfig"

export default function ListQuestion() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [nameExam, setNameExam] = useState('')
    const [originalName, setOriginalName] = useState('')
    const { examId, sectionId } = useParams()

    const fetchData = async () => {
        try{
            const res = await api.get(`/question/${examId}/${sectionId}`)
            setNameExam(res.data.section.name)
            setOriginalName(res.data.section.name)
            setData(res.data.section.questions)
        }catch(err){
            if (err.response?.status === 404){
                navigate('/500');
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteSection = async (questionId) => {
        try {
            const res = await api.delete(`/question/${examId}/${sectionId}/${questionId}`)

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

    const handleDelete = (questionId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSection(questionId)
            }
        })
    }
    const handleReNameSection = async () => {
        try {
            if (nameExam.trim() === originalName.trim()) {
                Swal.fire({ title: "Tên chưa thay đổi", icon: "info" })
                return;
            }
            const res = await api.put(`/exam/${examId}/sections/${sectionId}`,
                {
                    name: nameExam
                }
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
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-lg-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Phần thi </h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Đổi tên phần thi</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input className="border p-2 w-100" type="text" value={nameExam} onChange={(e) => { setNameExam(e.target.value) }} /></td>
                                                    <td><label onClick={handleReNameSection} className="badge badge-success btn"><i className="fa fa-save"></i></label></td>
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
                                        <h4 className="card-title">Danh sách câu hỏi </h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Câu hỏi</th>
                                                    <th>Số đáp án </th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.text.slice(0,100)}</td>
                                                        <td>{item.answers.length}</td>
                                                        <td>
                                                            <Link to={`/edit/exam/${examId}/section/${sectionId}/question/${item._id}`}><label className="badge badge-warning mx-1"><i className="fa fa-pencil"></i></label></Link>
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
