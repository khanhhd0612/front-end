import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExamCard from "../../components/ui/examCard"
import nProgress from 'nprogress';
import api from '../../config/axiosConfig';

export default function ContentDashBoard() {
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        nProgress.start();
        try {
            const response = await api.get(`/exam?page=${page}&limit=8`);
            const newData = response.data;
            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setData(prevData => [...prevData, ...newData]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            nProgress.done();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                        <i className="mdi mdi-home"></i>
                    </span> Trang chủ
                </h3>
            </div>
            <div id="scrollableDiv" className="page-content p-xs-1">
                <InfiniteScroll style={{ overflowX: 'hidden' }}
                    dataLength={data.length}
                    next={fetchData}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                >
                    {data.length > 0 ? (
                        <div className="row">
                            {
                                data.map((item) => (
                                    <div key={item._id} className=" col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 stretch-card grid-margin">
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
                        <p>Hiện chưa có bài thi nào.</p>
                        <p>Chúng tôi sẽ cập nhật trong thời gian sớm nhất.</p>
                    </div>)}
                </InfiniteScroll>
            </div>
        </div>
    )
}