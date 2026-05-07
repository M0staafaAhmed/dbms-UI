import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState, forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify';






interface Doctor {
    doctorUUID: string;
    fullName: string;
    specialization: string;
    branchID?: number; // لو موجود، هيحدد الفرع (1 للقاهرة، 2 للإسكندرية)
}

export default function Doctors({ title }: { title: string }) {

    const [addDoctor, setAddDoctor] = useState(false);
    const [doctors, setDoctors] = useState([] as Doctor[]);

    function addDoctorToggle() {
        setAddDoctor(prev => !prev);
    }

    async function getDoctors() {
        console.log(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/doctors`);

        try {
            const response = await axios.get(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/doctors`);
            setDoctors(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch doctors: ${error.response?.data || error.message}`);
        }
    }

    async function handleDelete(doctorId : string , branchId : string) {
        console.log(`https://dbms-backend-tau.vercel.app/${branchId == "1" ? "cairo" : "alex"}/doctors/${doctorId}`);
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;

        try {
            await axios.delete(`https://dbms-backend-tau.vercel.app/${branchId == "1" ? "cairo" : "alex"}/doctors/${doctorId}`);
            toast.success("Doctor deleted successfully");
            getDoctors(); // تحديث القائمة بعد الحذف
        } catch (error: any) {
            toast.error(`Failed to delete doctor: ${error.response?.data || error.message}`);
        }
    }

    useEffect(() => {
        getDoctors();
    }, [])

    return (
        <>
            <div className="p-6 space-y-6   ">
                {/* Statistics Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-xl">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-500">Total Doctors</p>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-blue-700">{doctors.length}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-500">Specialties</p>
                        <span className="text-3xl font-bold">{new Set(doctors.map(d => d.specialization)).size}</span>
                    </div>
                </div>
                {/* Table Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="mb-1 font-bold">Medical Staff Registry</h3>
                            <p className="text-sm text-gray-600">Manage hospital physicians and clinical staff across {title === "central" ? "all branches" : `${title} Branch`}</p>
                        </div>
                        {title === "central" && <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors cursor-pointer" onClick={getDoctors}>
                            Refresh
                        </button>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-low border-b border-gray-200">
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</th>
                                    {title === "central" && (
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                                    )}
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {doctors.map((doctor, index) => {
                                    // استخراج أول حرفين من الاسم عشان الدائرة الملونة (اختياري)
                                    const initials = doctor.fullName ? doctor.fullName.substring(0, 2).toUpperCase() : 'DR';

                                    return (
                                        <tr key={doctor.doctorUUID || index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* عرض الحروف الأولى ديناميكياً */}
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        {/* عرض اسم الدكتور الحقيقي */}
                                                        <p className="text-table-data font-semibold text-on-surface">
                                                            {doctor.fullName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {/* عرض التخصص الحقيقي */}
                                                <span className="px-3 py-1 bg-tertiary-fixed text-tertiary rounded-full text-[12px] font-medium">
                                                    {doctor.specialization}
                                                </span>
                                            </td>

                                            {title === "central" && (
                                                <td className="px-5 py-4 text-table-data font-table-data text-gray-500">
                                                    {/* عرض اسم الفرع بناءً على الـ ID (لو متوفر) */}
                                                    {doctor.branchID === 1 ? "Cairo Branch" : "Alexandria Branch"}
                                                </td>
                                            )}

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* هنا نمرر الـ UUID لدالة الحذف */}
                                                    <button
                                                        onClick={() => handleDelete(doctor.doctorUUID , doctor.branchID ? doctor.branchID.toString() : "0")}
                                                        className="p-2 text-red-500 hover:text-red-500/85 cursor-pointer text-xl transition-colors"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {title !== "central" && (
                    <button onClick={addDoctorToggle} className="fixed cursor-pointer bottom-10 right-10 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
                        <FaPlus className="text-2xl" />
                    </button>
                )}
                {addDoctor && <AddDoctorModal addDoctorToggle={addDoctorToggle} title={title} getDoctors={getDoctors} />}
            </div>

        </>
    )
}


function AddDoctorModal({ addDoctorToggle, title, getDoctors }: { addDoctorToggle: () => void, title: string, getDoctors: () => void }) {

    const [sending, setSending] = useState(false)

    const { register, handleSubmit } = useForm({
        defaultValues: {
            fullName: "",
            specialization: ""
        }
    });

    async function onSubmit(data: any) {
        const newDoctor = {
            doctorUUID: `${title}-Doc-${uuidv4()}`,
            fullName: data.fullName,
            specialization: data.specialization
        };

        setSending(true);

        try {
            const response = await axios.post(`https://dbms-backend-tau.vercel.app/${title}/doctors`, newDoctor);
            console.log("Success:", response.data);
            toast.success("Doctor added successfully!");
        } catch (error: any) {
            // السطر ده هيطبع لك الرسالة اللي السيرفر باعتها (زي "name is required")
            console.log("Server Error Message:", error.response?.data);
            console.log("Status Code:", error.response?.status);
            console.error("Error:", error);
            toast.error(`Failed to add doctor: ${error.response?.data || error.message}`);
        } finally {
            setSending(false);
            addDoctorToggle();
            getDoctors(); // Call getDoctors to refresh the doctor list
        }
    }
    return (
        <>
            <div onClick={addDoctorToggle} className="fixed inset-0 bg-gray-500/20 backdrop-blur-xs flex items-center justify-center z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <SuperInput label="Full Name" {...register("fullName")} required />
                        </div>
                        <div>
                            <SuperInput label="Specialization" {...register("specialization")} required />
                        </div>
                            <button disabled={sending} className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline cursor-pointer w-full" type="submit">
                                {sending ? "Adding..." : "Add Doctor"}
                            </button>
                    </form>
                </div>
            </div>
        </>
    )
}









interface SuperInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

// استخدمنا forwardRef عشان نمرر الـ Ref بتاع Hook Form للـ input الحقيقي
const SuperInput = forwardRef<HTMLInputElement, SuperInputProps>(
    ({ label, type = "text", ...props }, ref) => {
        const [focused, setFocused] = useState(false);

        return (
            <div className="relative group w-full">
                <div className="relative bg-white rounded-lg leading-none flex items-center border border-slate-100">
                    <div className="w-full">
                        <input
                            {...props} // نمرر كل الـ props (name, onBlur, onChange)
                            ref={ref}   // نمرر الـ ref
                            type={type}
                            onFocus={(e) => {
                                setFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setFocused(false);
                                props.onBlur?.(e);
                            }}
                            className="peer w-full bg-transparent text-slate-800 px-4 py-4 pt-6 outline-none text-sm font-medium transition-all"
                            placeholder=" "
                        />

                        {/* الـ Label المتحرك - بيعتمد على الـ peer state */}
                        <label className={`
                            absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-300 ease-in-out
                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-bold
                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold
                        `}>
                            {label}
                        </label>

                        {/* الخط السفلي الذكي */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100 overflow-hidden rounded-b-lg">
                            <div className={`
                                h-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 ease-out
                                ${focused ? 'translate-x-0' : '-translate-x-full'}
                            `}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

SuperInput.displayName = "SuperInput";

