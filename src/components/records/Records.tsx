import axios from 'axios'
import React, { forwardRef, useEffect, useState } from 'react'
import { useForm, type UseFormRegister, type UseFormSetValue } from 'react-hook-form'
import { CiMedicalCase, CiUser } from 'react-icons/ci'
import { FaEye, FaPlus, FaUser } from 'react-icons/fa'
import { IoClose, IoDocumentTextSharp } from 'react-icons/io5'
import { MdEmergency, MdOutlineDescription, MdOutlinePendingActions } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';

interface Record {
    recordUUID: string,
    diagnosis: string,
    prescription: string,
    visitDate: Date,
    branchID: number,
    patient: {
        uuid: string,
        name: string,
        gender: string,
        birthDate: string,
        phoneNumber: string
    },
    doctor: {
        uuid: string,
        name: string,
        specialization: string
    }
}

interface patients {
    patientUUID: string,
    name: string,
    gender: string,
    birthDate: string,
    phoneNumber: string,
    originBranchID: number,
}

interface Doctor {
    doctorUUID: string;
    fullName: string;
    specialization: string;
    branchID?: number; // لو موجود، هيحدد الفرع (1 للقاهرة، 2 للإسكندرية)
}

export default function Records({ title }: { title: string }) {
    const [addRecord, setAddRecord] = useState(false);
    const [records, setRecords] = useState([] as Record[]);
    const [patients, setPatients] = useState([] as patients[]);
    const [doctors, setDoctors] = useState([] as Doctor[]);
    const [showDetails, setShowDetails] = useState(false);

    function addRecordToggle() {
        setAddRecord(prev => !prev);
    }

    function detailsToggle() {
        setShowDetails(prev => !prev);
    }

    async function getRecords() {
        console.log(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/records`);

        try {
            const response = await axios.get(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/records`);
            setRecords(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch records: ${error.response?.data || error.message}`);
        }
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

    async function getDoctors() {
        console.log(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/doctors`);

        try {
            const response = await axios.get(`https://dbms-backend-tau.vercel.app${title === "central" ? "" : `/${title}`}/doctors`);
            setDoctors(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch doctors: ${error.response?.data || error.message}`);
        }
    }

    useEffect(() => {
        getRecords();
        getPatients();
        getDoctors();
    }, [])
    return (
        <>
            <div className='p-6 space-y-6'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl text-blue-600">
                            <IoDocumentTextSharp />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Records</p>
                            <p className="text-3xl font-bold text-slate-900">{records.length}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-cyan-200 text-cyan-600 text-xl flex items-center justify-center">
                            <SlCalender />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Visits Today</p>
                            <p className="text-3xl font-bold text-slate-900">{records.filter(r => new Date(r.visitDate).toDateString() === new Date().toDateString()).length}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-200 text-indigo-600 text-xl flex items-center justify-center">
                            <MdEmergency />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Critical Cases</p>
                            <p className="text-3xl font-bold text-slate-900">12</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-red-200 text-red-600 text-xl flex items-center justify-center">
                            <MdOutlinePendingActions />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pending Reviews</p>
                            <p className="text-3xl font-bold text-slate-900">38</p>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="mb-1 font-bold">Medical Staff Registry</h3>
                            <p className="text-sm text-gray-600">Manage hospital physicians and clinical staff across {title === "central" ? "all branches" : `${title} Branch`}</p>
                        </div>
                        {title === "central" && <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors cursor-pointer" onClick={getRecords}>
                            Refresh
                        </button>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                            Patient Name
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                            Doctor Name
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                            Disease
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                            Prescription
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                            Visit Date
                                        </div>
                                    </th>
                                    {title === "central" && (
                                        <th className="px-4 py-4 text-left">
                                            <div className="flex items-center gap-2 text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                                Branch
                                            </div>
                                        </th>
                                    )}
                                    <th className="px-4 py-4 text-right text-label-xs text-gray-600 uppercase tracking-wider font-bold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Row 1 */}
                                {records.map((record) => {
                                    const visitDate = new Date(record.visitDate);
                                    const formattedDate = visitDate.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    });

                                    const formateTime = visitDate.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })
                                    return (
                                        <tr className="table-row-hover transition-colors">
                                            <td className="px-4 py-4d">
                                                <p className="text-table-data font-semibold text-slate-900">{record.patient.name}</p>
                                            </td>
                                            <td className="px-4 py-4d">
                                                <p className="text-table-data font-semibold text-slate-900">{record.doctor.name}</p>
                                            </td>
                                            <td className="px-4 py-4d">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{record.diagnosis}</span>
                                            </td>
                                            <td className="px-4 py-4d">
                                                <p className="text-table-data text-slate-600 truncate max-w-xs">{record.prescription}</p>
                                            </td>
                                            <td className="px-4 py-4d">
                                                <p className="text-table-data text-slate-700 font-medium">{formattedDate}</p>
                                                <p className="text-label-xs text-slate-400">{formateTime}</p>
                                            </td>
                                            {title === "central" && (
                                                <td className="px-4 py-4d">
                                                    <p className="text-table-data text-slate-700 font-medium">{record.branchID == 1 ? "cairo" : "alex"}</p>
                                                </td>
                                            )}
                                            <td className="px-4 py-4d text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={detailsToggle} className="p-1.5 text-amber-500 hover:text-amber-700 rounded transition-colors cursor-pointer">
                                                        <FaEye />
                                                    </button>
                                                    {showDetails && <DetailsModule record={record} showDetails={showDetails} detailsToggle={detailsToggle} />}
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
                    <button onClick={addRecordToggle} className="fixed cursor-pointer bottom-10 right-10 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
                        <FaPlus className="text-2xl" />
                    </button>
                )}
                {addRecord && <AddRecordsModal addRecordToggle={addRecordToggle} title={title} getRecords={getRecords} doctors={doctors} patients={patients} />}
            </div>

        </>
    )
}



function AddRecordsModal({ addRecordToggle, title, getRecords, doctors, patients }: { addRecordToggle: () => void, title: string, getRecords: () => void, doctors: Doctor[], patients: patients[] }) {

    const [sending, setSending] = useState(false)

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            diagnosis: "",
            prescription: "",
            patientUUID: "",
            doctorID: "",
        }
    });

    async function onSubmit(data: any) {


        const now = new Date();
        // إضافة ساعتين (فرق توقيت مصر) للميللي ثانية
        const cairoOffset = 3 * 60 * 60 * 1000;
        const cairoDate = new Date(now.getTime() + cairoOffset);

        const formatted = cairoDate.toISOString();

        const newRecord = {
            recordUUID: `${title}-rec-${uuidv4()}`,
            diagnosis: data.diagnosis,
            prescription: data.prescription,
            visitDate: formatted,
            patientUUID: data.patientUUID,
            doctorID: data.doctorID,
            originBranchID: title === "cairo" ? 1 : 2
        };

        console.log("Submitting new record:", newRecord);

        setSending(true);

        try {
            const response = await axios.post(`https://dbms-backend-tau.vercel.app/${title}/records`, newRecord);
            console.log("Success:", response.data);
            toast.success("Record added successfully!");
        } catch (error: any) {
            // السطر ده هيطبع لك الرسالة اللي السيرفر باعتها (زي "name is required")
            console.log("Server Error Message:", error.response?.data);
            console.log("Status Code:", error.response?.status);
            console.error("Error:", error);
            toast.error(`Failed to add record: ${error.response?.data || error.message}`);
        } finally {
            setSending(false);
            addRecordToggle();
            getRecords(); // Call getRecords to refresh the patient list
        }
    }
    return (
        <>
            <div onClick={addRecordToggle} className="fixed inset-0 bg-gray-500/20 backdrop-blur-xs flex items-center justify-center z-50 transition-all">
                <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Add New Patients</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <SuperInput label="Diagnosis" {...register("diagnosis")} required />
                        </div>
                        <div>
                            <SuperInput label="Prescription" {...register("prescription")} required />
                        </div>
                        <div>
                            <SuperDatalist
                                extraKey='phoneNumber'
                                setValue={setValue}
                                label="Select Patient"
                                name="patientUUID"
                                register={register}
                                items={patients}
                                idKey="patientUUID"
                                searchKey="name" // المريض عنده name
                            />
                        </div>
                        <div>
                            <SuperDatalist
                                extraKey='specialization' // عشان يطلع التخصص تحت الاسم في القائمة
                                setValue={setValue}
                                label="Select Doctor"
                                name="doctorID"
                                register={register}
                                items={doctors}
                                idKey="doctorUUID"
                                searchKey="fullName" // الطبيب عنده name
                            />
                        </div>
                        <button disabled={sending} className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline cursor-pointer w-full" type="submit">
                            {sending ? "Adding..." : "Add Record"}
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




interface Props {
    label: string;
    name: string;
    register: any;
    items: any[];
    searchKey: string; // الاسم (للبحث والعرض الأساسي)
    idKey: string;     // الـ ID (للإرسال المخفي)
    extraKey: string;  // الحقل الإضافي (تخصص أو تليفون) للعرض فقط
    setValue: any;
}

const SuperDatalist = ({ label, name, register, items, searchKey, idKey, extraKey, setValue }: Props) => {
    const listId = `list-${name}`;
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative w-full group">
            <div className="relative bg-white rounded-lg transition-all shadow-sm">
                <input
                    type="text"
                    list={listId}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        const val = e.target.value;
                        const selected = items.find((item: any) => String(item[searchKey]) === val);
                        if (selected) {
                            setValue(name, selected[idKey]); // يرسل الـ ID
                        } else {
                            setValue(name, val);
                        }
                    }}
                    className="peer w-full bg-transparent text-slate-800 px-4 py-4 pt-6 outline-none text-sm font-medium transition-all"
                    placeholder=" "
                />

                <input type="hidden" {...register(name)} />

                <label className={`
                    absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-300 ease-in-out
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold
                `}>
                    {label}
                </label>

                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100 overflow-hidden rounded-b-lg">
                    <div className={`
                        h-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 ease-out
                        ${focused ? 'translate-x-0' : '-translate-x-full'}
                    `}></div>
                </div>
            </div>

            <datalist id={listId}>
                {items.map((item: any, index: number) => (
                    // الـ value هو اللي بيظهر فوق (الاسم)
                    // النص داخل الـ option هو اللي بيظهر تحت (التخصص أو التليفون)
                    <option key={index} value={item[searchKey]}>
                        {item[extraKey]}
                    </option>
                ))}
            </datalist>
        </div>
    );
};




const DetailsModule = ({ record, showDetails, detailsToggle }: { record: Record, showDetails: boolean, detailsToggle: () => void }) => {

    // إذا كان المودال مغلقاً، لا تظهر شيئاً
    if (!showDetails) return null;

    const visitDate = new Date(record.visitDate);
    const formattedDate = visitDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const age = record?.patient?.birthDate
        ? Math.floor((new Date().getTime() - new Date(record.patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : "N/A";

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div onClick={detailsToggle} className="absolute inset-0 bg-gray-600/10 backdrop-blur-xs" />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-800">Medical Record Details</h3>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" onClick={detailsToggle}>
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-8 text-left"> {/* أضفنا text-left هنا لضمان الاتجاه */}

                    {/* Section 1: Patient Information */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <CiUser size={24} />
                            <h4 className="font-bold uppercase tracking-widest text-sm">Patient Information</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-slate-900">{record?.patient?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Branch</p>
                                <p className="text-sm font-semibold text-slate-900">{record.branchID == 1 ? "cairo" : "alex"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Age / Gender</p>
                                <p className="text-sm font-semibold text-slate-900">{age} yrs / {record?.patient?.gender || "N/A"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Doctor Information */}
                    <section className="pt-2">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <CiMedicalCase size={24} />
                            <h4 className="font-bold uppercase tracking-widest text-sm">Attending Physician</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border border-slate-100 p-4 rounded-xl">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Doctor Name</p>
                                <p className="text-sm font-semibold text-slate-900">Dr. {record?.doctor?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Specialty</p>
                                <p className="text-sm font-semibold text-slate-900">{record?.doctor?.specialization || "N/A"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Record Details */}
                    <section className="pt-2">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <MdOutlineDescription size={24} />
                            <h4 className="font-bold uppercase tracking-widest text-sm">Record Details</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50/50 rounded-lg">
                                    <p className="text-[10px] text-blue-400 uppercase font-bold">Primary Diagnosis</p>
                                    <p className="text-sm font-semibold text-slate-900">{record?.diagnosis}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Visit Date</p>
                                    <p className="text-sm font-semibold text-slate-900">{formattedDate}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Prescription</p>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
                                    {record?.prescription || "No prescription provided."}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                    <button className="px-5 py-2 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer" onClick={detailsToggle}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};