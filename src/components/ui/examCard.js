import { useState } from "react";
import FormCard from "./formCard";

export default function ExamCard({ id, name, slug, time, createdBy }) {
    const [showModal, setShowModal] = useState(false)

 

    return (
        <div className="card card-img-holder">
            <img className="p-1" src="/assets/images/background-hoc-tap-54.jpg" alt="default-img" />
            <div className="card-body">
                <div className="border-bottom border-top">
                    <div className="exam-info py-1">
                        <p>{name}</p>
                        <p>{time.slice(0, 10)}</p>
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle logo-user-update-exam"
                                src="/assets/images/user_img.jpg" alt="user" />
                            <div className="">{createdBy}</div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary mt-2" onClick={() => setShowModal(true)}>
                    Ôn tập
                </button>
                {showModal && <FormCard
                    onClose={() => setShowModal(false)}
                    slug={slug}
                    id={id}
                />}
            </div>
        </div>
    )
}