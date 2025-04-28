import ChangePassword from '../pages/auth/updatePassword';
import Information from '../pages/auth/infomation';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import DashBoard from '../pages/dashboard';
import Search from '../pages/dashboard/search';
import Error404 from '../pages/error/error404';
import AddExam from '../pages/exam/add';
import DoExam from '../pages/exam/doExam';
import ListSection from '../pages/section/listSections';
import ListExam from '../pages/exam/listExam';
import CheckLogin from './privateRoutes';
import ListQuestion from '../pages/question/listQuestions';
import UpdateQuestionForm from '../pages/question/updateQuestion';
import AddQuestionForm from '../pages/question/addQuestion';

const routes = [
  {
    path: '/',
    element: <CheckLogin><DashBoard /></CheckLogin>,
  },
  {
    path: '/dang-nhap',
    element: <Login />,
  },
  {
    path: '/dang-ky',
    element: <Register />,
  },
  {
    path: '/bai-thi/:slug/:id',
    element: <CheckLogin><DoExam /></CheckLogin>,
  },
  {
    path: '/tim-kiem',
    element: <CheckLogin><Search /></CheckLogin>,
  },
  {
    path: '/them-bai-thi',
    element: <CheckLogin><AddExam /></CheckLogin>,
  },
  {
    path: '/danh-sach-bai-thi',
    element: <CheckLogin><ListExam /></CheckLogin>,
  },
  {
    path: '/doi-mat-khau',
    element: <CheckLogin><ChangePassword /></CheckLogin>,
  },
  {
    path: '/thong-tin-nguoi-dung',
    element: <CheckLogin><Information /></CheckLogin>,
  },
  {
    path: '/edit/exam/:examId/sections',
    element: <CheckLogin><ListSection /></CheckLogin>,
  },
  {
    path: '/edit/exam/:examId/section/:sectionId/questions',
    element: <CheckLogin><ListQuestion /></CheckLogin>,
  },
  {
    path: '/edit/exam/:examId/section/:sectionId/question/add',
    element: <AddQuestionForm />,
  },
  {
    path: '/edit/exam/:examId/section/:sectionId/question/:questionId',
    element: <UpdateQuestionForm />,
  },
  {
    path: '*',
    element: <Error404 />,
  }
];

export default routes;