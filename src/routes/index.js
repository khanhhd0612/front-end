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
import ForgotPassword from '../pages/auth/forgotPassword';
import ResetPassword from '../pages/auth/resetPassword';

const routes = [
  {
    path: '/',
    element: <DashBoard />,
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
    path: '/quen-mat-khau',
    element: <ForgotPassword />,
  },
  {
    path: '/bai-thi/:slug/:id',
    element: <CheckLogin><DoExam /></CheckLogin>,
  },
  {
    path: '/tim-kiem',
    element: <Search />,
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
    path: '/reset/password/:token',
    element: <ResetPassword />,
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
    element: <CheckLogin><AddQuestionForm /></CheckLogin>,
  },
  {
    path: '/edit/exam/:examId/section/:sectionId/question/:questionId',
    element: <CheckLogin><UpdateQuestionForm /></CheckLogin>,
  },
  {
    path: '*',
    element: <Error404 />,
  }
];

export default routes;