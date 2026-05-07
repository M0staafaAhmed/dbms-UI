import axios from 'axios';
import React, { forwardRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BiTrendingUp } from 'react-icons/bi';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { MdDelete, MdEmergency, MdOutlineAnalytics } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


interface patients {
    patientUUID: string,
    name: string,
    gender: string,
    birthDate: string,
    phoneNumber: string,
    originBranchID: number,
}


export default function Patients({ title }: { title: string }) {


    const [addPatients, setAddPatients] = useState(false);
    const [patients, setPatients] = useState([] as patients[]);

    function addPatientsToggle() {
        setAddPatients(prev => !prev);
    }

    async function getPatients() {
        console.log(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/patients`);

        try {
            const response = await axios.get(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/patients`);
            setPatients(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch patients: ${error.response?.data || error.message}`);
        }
    }

    async function handleDelete(patientId: string, branchId: string) {
        console.log(`https://dbms-backend-tau.vercel.app/${branchId == "1" ? "cairo" : "alex"}/patients/${patientId}`);
        if (!window.confirm("Are you sure you want to delete this patient?")) return;

        try {
            await axios.delete(`https://dbms-backend-tau.vercel.app/${branchId == "1" ? "cairo" : "alex"}/patients/${patientId}`);
            toast.success("Patient deleted successfully");
            getPatients(); // تحديث القائمة بعد الحذف
        } catch (error: any) {
            toast.error(`Failed to delete patient: ${error.response?.data || error.message}`);
        }
    }

    useEffect(() => {
        getPatients();
    }, [])

    return (
        <>
            <div className='p-6'>
                {/* Dashboard Stats Summary (Bento-style layout) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 font-xs uppercase">Total Patients</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FaUsers className="text-lg" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
                        <div className="text-[12px] text-emerald-600 font-semibold flex items-center mt-2">
                            <BiTrendingUp className="text-lg mr-1" />
                            12% from last month
                        </div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 font-xs uppercase">Admitted Today</span>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <MdEmergency className="text-lg" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">45</div>
                        <div className="text-[12px] text-slate-500 font-semibold flex items-center mt-2">
                            Average wait: 14 mins
                        </div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 font-xs uppercase">Avg Age</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <MdOutlineAnalytics className="text-lg" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{Math.round(patients.reduce((sum, p) => sum + ((Math.floor((new Date().getTime() - new Date(p.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))) || 0), 0) / patients.length * 10) / 10 || 0}</div>
                        <div className="text-[12px] text-slate-500 font-semibold flex items-center mt-2">
                            Stable demographic
                        </div>
                    </div>
                </div>
                {/* Data Table Section */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="mb-1 font-bold">Medical Staff Registry</h3>
                            <p className="text-sm text-gray-600">Manage hospital physicians and clinical staff across {title === "central" ? "all branches" : `${title} Branch`}</p>
                        </div>
                        {title === "central" && <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors cursor-pointer" onClick={getPatients}>
                            Refresh
                        </button>}  
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider">Age</th>
                                    <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider">Phone Number</th>
                                    {title === "central" && <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider">Branch</th>}
                                    <th className="px-6 py-3 text-slate-500 font-label-xs uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Row 1 */}
                                {patients.map((patient) => {
                                    const age = Math.floor((new Date().getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
                                    const initials = patient.name ? patient.name.substring(0, 2).toUpperCase() : 'PT';
                                    return (
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">{initials}</div>
                                                    <div>
                                                        <div className="text-table-data font-semibold text-slate-900">{patient.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-table-data text-slate-700">{patient.gender}</td>
                                            <td className="px-6 py-4 text-table-data text-slate-700">{age}</td>
                                            <td className="px-6 py-4 text-table-data text-slate-700">{patient.phoneNumber}</td>
                                            {title === "central" && <td className="px-6 py-4 text-table-data text-slate-700">{patient.originBranchID == 1 ? "Cairo" : "Alex"}</td>}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(patient.patientUUID, patient.originBranchID ? patient.originBranchID.toString() : "0")}
                                                        className="p-2 text-red-500 hover:text-red-500/85 cursor-pointer text-xl transition-colors"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {title !== "central" && (
                    <button onClick={addPatientsToggle} className="fixed cursor-pointer bottom-10 right-10 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
                        <FaPlus className="text-2xl" />
                    </button>
                )}
                {addPatients && <AddPatientsModal addPatientsToggle={addPatientsToggle} title={title} getPatients={getPatients} />}
            </div>

        </>
    )
}



function AddPatientsModal({ addPatientsToggle, title, getPatients }: { addPatientsToggle: () => void, title: string, getPatients: () => void }) {

    const [sending, setSending] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            gender: "",
            birthDate: "",
            phoneNumber: ""
        }
    });

    async function onSubmit(data: any) {
        const newPatient = {
            patientUUID: `${title}-${uuidv4()}`,
            name: data.name,
            gender: data.gender,
            birthDate: data.birthDate,
            phoneNumber: data.phoneNumber,
            originBranchID: title === "cairo" ? 1 : 2
        };

        console.log("Submitting new patient:", newPatient);

        setSending(true);

        try {
            const response = await axios.post(`https://dbms-backend-tau.vercel.app/${title}/patients`, newPatient);
            console.log("Success:", response.data);
            toast.success("Patient added successfully!");
        } catch (error: any) {
            // السطر ده هيطبع لك الرسالة اللي السيرفر باعتها (زي "name is required")
            console.log("Server Error Message:", error.response?.data);
            console.log("Status Code:", error.response?.status);
            console.error("Error:", error);
            toast.error(`Failed to add patient: ${error.response?.data || error.message}`);
        } finally {
            setSending(false);
            addPatientsToggle();
            getPatients(); // Call getPatients to refresh the patient list
        }
    }
    return (
        <>
            <div onClick={addPatientsToggle} className="fixed inset-0 bg-gray-500/20 backdrop-blur-xs flex items-center justify-center z-50 transition-all">
                <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Add New Patients</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <SuperInput label="Full Name" {...register("name")} required />
                        </div>
                        <div>
                            <SuperInput type="date" label="Birth Date" {...register("birthDate")} required />
                        </div>
                        <div>
                            <SuperInput label="Phone Number" {...register("phoneNumber", {
                                    pattern: {
                                        value: /^[0-9]{11}$/,
                                        message: "Please enter a valid 11-digit phone number"
                                    }
                            })} required />
                            <p className="text-red-500 text-sm">{errors.phoneNumber?.message}</p>
                        </div>
                        <div>
                            <div className='text-center mb-1 font-semibold text-lg'>Gender</div>
                            <div className="flex items-center justify-evenly gap-2">
                                {/* الاختيار الأول: القاهرة */}
                                <label className="relative block cursor-pointer group">
                                    {/* الراديو بوتن المخفي */}
                                    <input type="radio" {...register("gender")} defaultValue="male" className="peer sr-only" />
                                    {/* الكارد الأساسي */}
                                    <div className="flex items-center justify-between py-3 px-5 bg-white border border-slate-100 rounded-xl transition-all duration-300 
                                                        peer-checked:border-blue-600 peer-checked:bg-blue-50/50 peer-checked:ring-1 peer-checked:ring-blue-600">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-slate-600 transition-colors duration-300 
                                                            peer-checked:group-[]:text-blue-700">
                                                male
                                            </span>
                                        </div>
                                    </div>
                                </label>

                                <label className="relative block cursor-pointer group">
                                    {/* الراديو بوتن المخفي */}
                                    <input type="radio" {...register("gender")} defaultValue="female" className="peer sr-only" />
                                    {/* الكارد الأساسي */}
                                    <div className="flex items-center justify-between py-3 px-5 bg-white border border-slate-100 rounded-xl transition-all duration-300 
                                                        peer-checked:border-blue-600 peer-checked:bg-blue-50/50 peer-checked:ring-1 peer-checked:ring-blue-600">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-slate-600 transition-colors duration-300 
                                                            peer-checked:group-[]:text-blue-700">
                                                female
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                            <button disabled={sending} className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline cursor-pointer w-full" type="submit">
                                {sending ? "Adding..." : "Add patient"}
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




