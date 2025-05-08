import React, { useEffect, useState } from 'react';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../config/axiosConfig';

export default function UpdateQuestionForm() {
    const navigate = useNavigate();
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const { examId, sectionId, questionId } = useParams()


    const fetchData = async () => {
        try {
            const res = await api.get(`/question/${examId}/${sectionId}/${questionId}`)
            const question = res.data.question
            setQuestionText(question.text)
            setAnswers(question.answers)
            setCorrectAnswer(question.correctAnswers[0])
        } catch (err) {
            if (err.response?.status === 404) {
                navigate('/500');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
    const handleUpdateQuestion = () => {
        Swal.fire({
            title: "Bạn muốn lưu thay đổi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Lưu",
            denyButtonText: "Không lưu",
        }).then((result) => {
            if (result.isConfirmed) {
                updateQuestion()
            } else if (result.isDenied) {
                Swal.fire("Dữ liệu chưa được thay đổi", "", "info")
            }
        })
    }
    const updateQuestion = async () => {
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
        try {
            const res = await api.put(`/question/${examId}/${sectionId}/${questionId}`,
                {
                    text: questionText,
                    answers: answers,
                    correctAnswers: correctAnswer
                }
            )
            if (res.status === 200) {
                Swal.fire({
                    title: "Cập nhật câu hỏi thành công",
                    icon: "success",
                    draggable: true
                });
                fetchData()
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
                                        <h4 className="card-title">Cập nhật câu hỏi </h4>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                placeholder="Nhập câu hỏi"
                                                className="form-control"
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                            />
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

                                        <button className="btn btn-primary mt-2" onClick={handleUpdateQuestion}>Lưu thay đổi </button>
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
