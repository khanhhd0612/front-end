import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';

export default function AddExam() {
    const [nameExam, setNameExam] = useState('');
    const [rawInput, setRawInput] = useState('');
    const [results, setResults] = useState(null);
    const [parsedHtml, setParsedHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('token')

    const parseQuestions = (text) => {
        const lines = text.split('\n');
        const result = {
            sections: [],
            validQuestions: [],
            errors: [],
        };

        let currentSection = {
            name: 'Phần thi chung',
            questions: [],
        };
        result.sections.push(currentSection);

        let currentQuestion = null;
        let lineNumber = 0;

        const isQuestionLine = (line) => /^Câu\s*\d+[:\.]/i.test(line);

        for (let i = 0; i < lines.length; i++) {
            lineNumber++;
            const line = lines[i].trim();
            if (line === '') continue;

            if (line.startsWith("'")) {
                const sectionName = line.substring(1).trim();
                if (sectionName === '') {
                    result.errors.push({
                        line: lineNumber,
                        message: 'Tên phần thi không được trống',
                    });
                    continue;
                }
                currentSection = {
                    name: sectionName,
                    questions: [],
                };
                result.sections.push(currentSection);
                continue;
            }

            if (isQuestionLine(line)) {
                if (currentQuestion) {
                    if (validateQuestion(currentQuestion)) {
                        currentSection.questions.push(currentQuestion);
                        result.validQuestions.push(currentQuestion);
                    } else {
                        result.errors.push({
                            line: currentQuestion.startLine,
                            message: 'Câu hỏi thiếu đáp án đúng hoặc không đủ đáp án',
                            question: currentQuestion.text,
                        });
                    }
                }

                currentQuestion = {
                    text: line,
                    answers: [],
                    correctAnswers: [],
                    startLine: lineNumber,
                };
            } else if (currentQuestion) {
                if (line.startsWith('*')) {
                    const answer = line.substring(1).trim();
                    currentQuestion.answers.push(answer);
                    currentQuestion.correctAnswers.push(answer);
                } else {
                    currentQuestion.answers.push(line);
                }
            }
        }

        if (currentQuestion) {
            if (validateQuestion(currentQuestion)) {
                currentSection.questions.push(currentQuestion);
                result.validQuestions.push(currentQuestion);
            } else {
                result.errors.push({
                    line: currentQuestion.startLine,
                    message: 'Câu hỏi thiếu đáp án đúng hoặc không đủ đáp án',
                    question: currentQuestion.text,
                });
            }
        }

        return result;
    };

    const validateQuestion = (q) => q.answers.length >= 2 && q.correctAnswers.length > 0;

    const handleParse = () => {
        const parsed = parseQuestions(rawInput);
        setResults(parsed);
        setParsedHtml(renderResults(parsed));
    };

    const handleExport = async () => {
        if (!results || results.validQuestions.length === 0) {
            alert('Không có câu hỏi hợp lệ để xuất!');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/exam`, {
                name: nameExam,
                sections: results.sections,
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    title: "Thêm đề thi thành công",
                    icon: "success",
                    draggable: true
                });
                setNameExam('')
                setRawInput('')
                setResults('')
                setParsedHtml('')
            } else {
                alert('Có lỗi xảy ra khi xuất đề!');
            }
        } catch (err) {
            console.error(err);
            alert('Không thể kết nối tới máy chủ!');
        } finally {
            setLoading(false);
        }
    };

    const renderResults = (results) => {
        let html = '';

        if (results.errors.length > 0) {
            html += `<div class="alert alert-warning"><h5>${results.errors.length} lỗi cấu trúc</h5><ul>`;
            results.errors.forEach((err) => {
                html += `<li>Dòng ${err.line}: ${err.message}`;
                if (err.question) {
                    html += `<br/><small class="text-muted">"${err.question}"</small>`;
                }
                html += `</li>`;
            });
            html += '</ul></div>';
        }

        let total = 0;
        results.sections.forEach((section) => {
            if (section.questions.length > 0) {
                html += `<div class="card mb-4 border">
          <div class="card-header  bg-secondary text-white">${section.name}</div>
          <div class="card-body">`;

                section.questions.forEach((q) => {
                    total++;
                    html += `<div class="card border question-card mb-3"><div class="card-body">
            <h6>Câu ${total}: ${q.text}</h6><ul class="list-group">`;
                    q.answers.forEach((ans) => {
                        const isCorrect = q.correctAnswers.includes(ans);
                        html += `<li class="list-group-item ${isCorrect ? 'bg-success text-white' : ''}">
              ${isCorrect ? '✅ ' : ''}${ans}
            </li>`;
                    });
                    html += '</ul></div></div>';
                });

                html += '</div></div>';
            }
        });

        if (total === 0) {
            html += `<div class="alert alert-danger">Không có câu hỏi hợp lệ!</div>`;
        } else {
            html = `<div class="alert alert-success">Đã phân tích ${total} câu hỏi hợp lệ</div>` + html;
        }

        return html;
    };

    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">Nhập tên đề thi</div>
                                    <div className="card-body">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập tên đề thi"
                                            value={nameExam}
                                            onChange={(e) => setNameExam(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="card mt-3">
                                    <div className="card-header bg-primary text-white">Nhập dữ liệu câu hỏi</div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="15"
                                            placeholder="Nhập dữ liệu câu hỏi theo quy tắc sau:
                                    Câu 1: câu hỏi số 1:
                                        *a. Đáp án đúng
                                        b. Đáp án 2
                                        c. Đáp án 3
                                        d. Đáp án 4

                                        <dấu cách>
                                        Câu 2:  câu hỏi số 2:
                                        *a. 3
                                        b. 4
                                        c. 2
                                        d. 5

                                        Lưu ý: Câu hỏi hoặc câu trả lời phải viết trên cùng 1 dòng
                                                                        "
                                            value={rawInput}
                                            onChange={(e) => setRawInput(e.target.value)}
                                        ></textarea>
                                        <button className="btn btn-primary w-100 mt-3" onClick={handleParse}>
                                            Phân tích và xem trước
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">Kết quả phân tích</div>
                                    <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <div dangerouslySetInnerHTML={{ __html: parsedHtml }}></div>
                                    </div>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleExport}
                                        disabled={!results || results.validQuestions.length === 0 || loading}
                                    >
                                        {loading ? 'Đang xuất...' : 'Xuất Đề Thi'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}