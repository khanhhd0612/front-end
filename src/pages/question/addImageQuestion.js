import React, { useState } from 'react';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../config/axiosConfig';

export default function AddQuestionImage() {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [correctAnswer, setCorrectAnswer] = useState('')
    const [image, setImage] = useState(null)
    const token = Cookies.get('token')
    const { examId, sectionId } = useParams()

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);

        if (correctAnswer === answers[index]) {
            setCorrectAnswer(value);
        }
    };

    const addAnswer = () => {
        setAnswers([...answers, '']);
    };

    const removeAnswer = (index) => {
        const removed = answers[index];
        if (answers.length === 1) {
            Swal.fire("Lỗi", 'Câu hỏi phải có ít nhất 1 đáp án', "error")
            return
        }
        const newAnswers = answers.filter((_, i) => i !== index);
        setAnswers(newAnswers);

        if (correctAnswer === removed) {
            setCorrectAnswer('');
        }
    };

    const addQuestion = async () => {
        if (!questionText.trim()) {
            Swal.fire("Lỗi", 'Bạn chưa nhập câu hỏi!', "error")
            return;
        }

        if (answers.some(ans => !ans.trim())) {
            Swal.fire("Lỗi", 'Không được để trống đáp án!', "error")
            return;
        }

        if (!correctAnswer.trim()) {
            Swal.fire("Lỗi", 'Bạn chưa chọn đáp án đúng!', "error")
            return;
        }
        const formData = new FormData()
        formData.append("text", questionText)
        formData.append("answers", JSON.stringify(answers))
        formData.append("correctAnswers", correctAnswer)
        if (image) {
            formData.append('image', image);
        } else {
            Swal.fire({
                title: "Ảnh đề thi không được để trống",
                icon: "warning"
            })
            return
        }
        try {
            const res = await api.post(`/question/image/${examId}/${sectionId}`, formData,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            )
            if (res.status === 201) {
                Swal.fire({
                    title: "Thêm câu hỏi thành công",
                    icon: "success",
                    draggable: true
                });
                setQuestionText('');
                setAnswers(['']);
                setImage(null)
                setCorrectAnswer('');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            }
        }

    };
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Thêm câu hỏi </h4>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputName1">Câu hỏi </label>
                                            <textarea
                                                placeholder="Nhập câu hỏi"
                                                className="form-control"
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                            ></textarea>
                                            <div className="my-3">
                                                <label htmlFor="formFileDisabled" className="form-label">Ảnh</label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="formFileDisabled"
                                                    accept="image/*"
                                                    onChange={(e) => setImage(e.target.files[0])}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div><label>Đáp án </label></div>
                                            {answers.map((answer, index) => (
                                                <div key={index} className="input-group mb-2 mt-2">
                                                    <div className="input-group-text">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={correctAnswer === answer}
                                                            onChange={() => setCorrectAnswer(answer)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={`Đáp án ${index + 1}`}
                                                        value={answer}
                                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                    />
                                                    <button className="btn btn-danger" onClick={() => removeAnswer(index)}>X</button>
                                                </div>
                                            ))}
                                            <button onClick={addAnswer} className="btn btn-gradient-primary me-2">Thêm đáp án</button>
                                        </div>

                                        <button className="btn btn-primary mt-2" onClick={addQuestion}>Thêm câu hỏi</button>
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
