import { FaStethoscope } from 'react-icons/fa'
import { FiUsers } from 'react-icons/fi'
import { IoDocumentText } from 'react-icons/io5'
import { NavLink, Outlet } from 'react-router-dom'

export default function Layout({ title }: { title: string }) {

    // دالة مساعدة عشان متكررش الكود كتير
    const linkClasses = ({ isActive } : { isActive: boolean }) => 
        `flex items-center gap-3 px-3 md:px-6 py-4 transition-all duration-200 ${
            isActive 
                ? "bg-blue-600/10 text-white border-l-4 border-blue-600 translate-x-1" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;
    return (
        <>
        <aside className="fixed left-0 top-0 h-screen w-15 md:w-50 lg:w-65 bg-slate-900 flex flex-col pt-8 pb-4 border-r border-slate-800 z-50 overflow-hidden">
            <div className="px-3 md:px-6 mb-10 flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white" data-icon="stethoscope"><FaStethoscope /></span>
                </div>
                <div className='hidden md:block'>
                    <h1 className="text-white text-lg font-black leading-none">MedCore</h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Clinical Precision</p>
                </div>
            </div>
            <nav className="flex-1 space-y-1">
                <NavLink end className={linkClasses} to="">
                    <FaStethoscope />
                    <span className="font-inter text-sm tracking-wide hidden md:block">Doctors</span>
                </NavLink>
                <NavLink className={linkClasses} to="patients">
                    <FiUsers />
                    <span className="font-inter text-sm tracking-wide hidden md:block">Patients</span>
                </NavLink>
                <NavLink className={linkClasses} to="records">
                    <IoDocumentText />
                    <span className="font-inter text-sm tracking-wide hidden md:block">Medical Records</span>
                </NavLink>
            </nav>
        </aside>
        <main className="ml-15 md:ml-50 lg:ml-65 bg-gray-50 min-h-screen">
            <header className="py-4 px-2 border-b border-gray-200 bg-white text-center">
                <h1 className="text-2xl font-bold uppercase">{title}</h1>
            </header>
            <Outlet />
        </main>
</>
    )
}
