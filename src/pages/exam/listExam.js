import Cookies from "js-cookie"
import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Link, useSearchParams } from "react-router-dom"
import ReactPaginate from "react-paginate"

export default function ListExam() {
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get("page")) || 1    
    const token = Cookies.get('token')

    const fetchData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}api/get/exam/of/user?page=${page}&limit=8`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        setData(res.data.exam)
        setTotalPages(res.data.totalPages)
    }

    useEffect(() => {
        fetchData()
    }, [page])

    const deleteExam = async (examId) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}api/exam/delete/${examId}`,
                { headers: { authorization: `Bearer ${token}` } }
            )

            if (res.status === 200) {
                Swal.fire({ title: "Xóa thành công", icon: "success" })
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error");
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa bài thi", "error");
            }
        }
    }

    const handleDelete = (examId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteExam(examId)
            }
        })
    }

    const handlePageClick = (pageNum) => {
        setSearchParams({ page: pageNum })
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
                                        <h4 className="card-title">Danh sách bài thi</h4>
                                        {data.length > 0 ? (
                                            <>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên bài thi</th>
                                                            <th>Số phần thi</th>
                                                            <th>Tạo lúc</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map((item) => (
                                                            <tr key={item._id}>
                                                                <td>{item.name}</td>
                                                                <td>{item.sections.length}</td>
                                                                <td>{item.createdAt.slice(0, 10)}</td>
                                                                <td>
                                                                    <Link to={`/edit/exam/${item._id}/sections/`}><label className="badge badge-warning mx-1"><i className="fa fa-pencil"></i></label></Link>
                                                                    <label onClick={() => handleDelete(item._id)} className="badge badge-danger"><i className="fa fa-trash-o"></i></label>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <ReactPaginate
                                                    previousLabel={"←"}
                                                    nextLabel={"→"}
                                                    breakLabel={"..."}
                                                    pageCount={totalPages}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={3}
                                                    onPageChange={(selectedItem) => handlePageClick(selectedItem.selected + 1)}
                                                    containerClassName={"pagination justify-content-end mt-4"}
                                                    pageClassName={"page-item"}
                                                    pageLinkClassName={"page-link"}
                                                    previousClassName={"page-item"}
                                                    previousLinkClassName={"page-link"}
                                                    nextClassName={"page-item"}
                                                    nextLinkClassName={"page-link"}
                                                    breakClassName={"page-item"}
                                                    breakLinkClassName={"page-link"}
                                                    activeClassName={"active"}
                                                    forcePage={page - 1}
                                                />
                                            </>
                                        ) : (
                                            <div className="fx-1">
                                                <p>Bạn chưa có bài thi nào.</p>
                                            </div>
                                        )}
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
