import { Link } from "react-router-dom";

export default function ExamCard(props) {
    return (
        <div className="card card-img-holder">
            <img className="p-1" src="/assets/images/background-hoc-tap-54.jpg" alt="default-img" />
            <div className="card-body">
                <div className="border-bottom border-top">
                    <div className="exam-info py-1">
                        <p>{props.name}</p>
                        <p>{props.time.slice(0,10)}</p>
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle logo-user-update-exam"
                                src="assets/images/user_img.jpg" alt="user" />
                            <div className="">{props.createdBy}</div>
                        </div>
                    </div>
                </div>
                <Link to={`/bai-thi/${props.slug}/${props.id}`} className="btn btn-primary mt-2">Ôn tập</Link>
            </div>
        </div>
    )
}