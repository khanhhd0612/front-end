import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';
import ExamCard from '../../components/ui/examCard';
import NProgress from 'nprogress';



export default function Search() {
    const [data, setData] = useState([]);
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        const fetchData = async () => {
            try {
                const q = new URLSearchParams(location.search).get("q") || "";
                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/search`, {
                    params: { q: q }
                });
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                NProgress.done();
            }
        };

        fetchData();
    }, [location.search]);


    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-content p-xs-1">
                            {data.length > 0 ? (
                                <div className="row">
                                    {
                                        data.map((item) => (
                                            <div key={item.id} className=" col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3 stretch-card grid-margin">
                                                <ExamCard
                                                    id={item._id}
                                                    name={item.name}
                                                    slug={item.slug}
                                                    time={item.createdAt}
                                                    createdBy={item.createdBy.name || "Không rõ"}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (<div className="fx-1">
                                <p>Không có kết quả nào khớp với yêu cầu tìm kiếm của bạn.</p>
                                <p>Đề xuất:</p>
                                <ul>
                                    <li>Thử nhập từ khóa khác</li>
                                    <li>Bạn đang tìm bài thi theo tên ?</li>
                                </ul>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
