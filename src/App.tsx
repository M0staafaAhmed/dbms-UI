import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import Doctors from './components/doctors/Doctors'
import { ToastContainer } from 'react-toastify'
import Patients from './components/patients/Patients'
import Records from './components/records/Records'



function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout title="central" />, // الأب هنا فيه Outlet
      children: [
        { path: "", element: <Doctors title="central" /> },
        { path: "patients", element: <Patients title="central" /> },
        { path: "doctors", element: <Doctors title="central" /> },
        { path: "records", element: <Records title="central" /> }
      ]
    },
    {
      path: '/cairo',
      element: <Layout title="cairo" />, // الأب هنا فيه Outlet
      children: [
        { path: "", element: <Doctors title="cairo" /> },
        { path: "patients", element: <Patients title="cairo" /> },
        { path: "doctors", element: <Doctors title="cairo" /> },
        { path: "records", element: <Records title="cairo" /> }
      ]
    },
    {
      path: '/alex',
      element: <Layout title="alex" />, // الأب هنا فيه Outlet
      children: [
        { path: "", element: <Doctors title="alex" /> },
        { path: "patients", element: <Patients title="alex" /> },
        { path: "doctors", element: <Doctors title="alex" /> },
        { path: "records", element: <Records title="alex" /> }
      ]
    },
  ])

  return (
  <>
  
  <ToastContainer />
  <RouterProvider router={router} />

  </>
  )
}

export default App