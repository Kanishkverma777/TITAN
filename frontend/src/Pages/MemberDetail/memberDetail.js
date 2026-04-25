import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const MemberDetail = () => {
    const [status, setStatus] = useState("Pending");
    const [renew, setRenew] = useState(false);
    const [membership, setMembership] = useState([]);
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [planMember, setPlanMember] = useState("");
    const { id } = useParams();

    useEffect(() => {
        fetchData();
        fetchMembership();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMembership = async () => {
        try {
            const response = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/plans/get-membership', { withCredentials: true });
            setMembership(response.data.memberships);
        } catch (err) {
            console.error(err);
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/member-details/${id}`, { withCredentials: true });
            setData(response.data.member);
            setStatus(response.data.member.status);
            setPlanMember(response.data.member.membership?._id || "");
        } catch (err) {
            console.error(err);
            toast.error("Failed to load member details");
        }
    }

    const handleSwitchBtn = async () => {
        const newStatus = status === "Active" ? "Pending" : "Active";
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/members/change-status/${id}`, { status: newStatus }, { withCredentials: true });
            setStatus(newStatus);
            toast.success(`Status changed to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    }

    const handleDeleteMember = async () => {
        if (window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/members/delete-member/${id}`, { withCredentials: true });
                if (response.status === 200) {
                    toast.success("Member Deleted successfully");
                    setTimeout(() => {
                        navigate('/member');
                    }, 1500);
                }
            } catch (err) {
                toast.error("Failed to delete member");
            }
        }
    }

    const isDateInPast = (inputDate) => {
        if (!inputDate) return false;
        const today = new Date();
        const givenDate = new Date(inputDate);
        return givenDate < today;
    };

    const handleOnChangeSelect = (event) => {
        setPlanMember(event.target.value);
    }

    const handleRenewSaveBtn = async () => {
        if (!planMember) {
            toast.warning("Please select a plan");
            return;
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/members/update-plan/${id}`, { membership: planMember }, { withCredentials: true });
            if (response.status === 200) {
                toast.success("Membership Renewed!");
                setRenew(false);
                fetchData();
            }
        } catch (err) {
            toast.error("Failed to renew membership");
        }
    }

    return (
        <div className='w-full bg-titan-black text-white p-6 md:p-10 h-screen overflow-y-auto custom-scrollbar uppercase tracking-tighter pb-24 md:pb-10'>
            <div className='flex justify-between items-center mb-8 md:mb-12'>
                <div onClick={() => { navigate(-1) }} className='bg-titan-grey border border-white/5 text-white px-5 md:px-8 py-3 md:py-4 rounded-full cursor-pointer hover:bg-titan-lime hover:text-black transition-all font-black text-[10px] md:text-xs flex items-center gap-2'>
                    <ArrowBackIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} /> GO BACK
                </div>
                <div onClick={handleDeleteMember} className='bg-red-600/10 border border-red-600/20 text-red-500 p-3 md:p-4 px-5 md:px-8 rounded-full cursor-pointer hover:bg-red-600 hover:text-white transition-all font-black text-[10px] md:text-xs flex items-center gap-2'>
                    <DeleteIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} /> <span className='hidden sm:inline'>DELETE MEMBER</span><span className='sm:hidden'>DELETE</span>
                </div>
            </div>
            
            <div className='bg-titan-dark border border-titan-grey p-6 md:p-10 rounded-[24px] md:rounded-[40px] shadow-2xl relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-titan-lime/5 rounded-full blur-[100px] -mr-24 md:-mr-48 -mt-24 md:-mt-48'></div>
                
                <div className='flex flex-col lg:flex-row gap-8 md:gap-16 items-start relative z-10'>
                    <div className='w-full lg:w-1/3'>
                        <div className='relative group'>
                            <img src={data?.profilePic} className='w-full max-w-[280px] mx-auto lg:max-w-none aspect-square object-cover rounded-[24px] md:rounded-[32px] border-4 border-titan-grey shadow-2xl group-hover:border-titan-lime transition-all duration-500' alt='Profile' />
                            <div className={`absolute top-3 md:top-4 right-3 md:right-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-black text-[8px] md:text-[10px] tracking-widest uppercase border-4 border-titan-dark shadow-xl ${status === "Active" ? "bg-titan-lime text-black" : "bg-red-600 text-white"}`}>
                                {status}
                            </div>
                        </div>
                    </div>
                    
                    <div className='w-full lg:w-2/3'>
                        <div className='text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-titan-lime uppercase mb-3 md:mb-4 py-1 md:py-1.5 px-3 md:px-4 bg-titan-lime/10 border border-titan-lime/20 rounded-full w-fit'>{data?.memberId}</div>
                        <h1 className='text-3xl md:text-6xl font-heading font-black tracking-tighter mb-3 md:mb-4 italic uppercase'>{data?.name}</h1>
                        <p className='text-sm md:text-xl text-titan-muted font-bold tracking-[0.05em] md:tracking-[0.1em] mb-6 md:mb-10 flex flex-col sm:flex-row gap-2 sm:gap-6 italic'>
                            <span>{data?.mobileNo}</span> 
                            <span className='opacity-30 hidden sm:inline'>|</span> 
                            <span>{data?.address}</span>
                        </p>
                        
                        <div className='grid grid-cols-2 gap-4 md:gap-8 border-y border-titan-grey/30 py-6 md:py-10 mb-6 md:mb-10'>
                            <div className='space-y-1'>
                                <p className='text-[8px] md:text-[10px] font-black text-titan-muted tracking-[0.2em] md:tracking-[0.3em]'>CURRENT PLAN</p>
                                <p className='text-base md:text-2xl font-black italic'>{data?.membership?.months} MONTHS ({data?.membership?.price} INR)</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-[8px] md:text-[10px] font-black text-titan-muted tracking-[0.2em] md:tracking-[0.3em]'>EXPERIENCE START</p>
                                <p className='text-base md:text-2xl font-black italic'>{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-[8px] md:text-[10px] font-black text-titan-muted tracking-[0.2em] md:tracking-[0.3em]'>LAST TRANSACTION</p>
                                <p className='text-base md:text-2xl font-black italic'>{data?.lastPayment ? new Date(data.lastPayment).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-[8px] md:text-[10px] font-black text-red-500 tracking-[0.2em] md:tracking-[0.3em]'>NEXT RENEWAL</p>
                                <p className='text-base md:text-2xl font-black italic text-red-500'>{data?.nextBillDate ? new Date(data.nextBillDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex flex-wrap items-center gap-6 md:gap-12'>
                            <div className='flex items-center gap-3 md:gap-4'>
                                <span className='text-[8px] md:text-[10px] font-black text-titan-muted tracking-[0.2em] md:tracking-[0.3em]'>STATUS CONTROL</span>
                                <Switch 
                                    onColor='#B4FF00'
                                    offColor='#222'
                                    onHandleColor='#000'
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    height={24}
                                    width={48}
                                    checked={status === "Active"} 
                                    onChange={handleSwitchBtn} 
                                />
                            </div>

                            {isDateInPast(data?.nextBillDate) && (
                                <button 
                                    onClick={() => setRenew(prev => !prev)} 
                                    className={`px-6 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] transition-all uppercase border-2 ${renew ? 'bg-white text-black border-white' : 'border-titan-lime text-titan-lime hover:bg-titan-lime hover:text-black shadow-[0_0_20px_rgba(180,255,0,0.1)]'}`}
                                >
                                    {renew ? 'CANCEL RENEWAL' : 'RENEW STATUS'}
                                </button>
                            )}
                        </div>

                        {renew && (
                            <div className='mt-6 md:mt-10 p-6 md:p-8 bg-titan-black border border-titan-grey rounded-[24px] md:rounded-[32px] flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-6'>
                                <div className='flex-grow w-full'>
                                    <label className='block text-[8px] md:text-[10px] font-black text-titan-muted tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4'>SELECT UPGRADE PLAN</label>
                                    <select 
                                        value={planMember} 
                                        onChange={handleOnChangeSelect} 
                                        className='w-full p-3 md:p-4 bg-titan-dark border border-titan-grey rounded-xl md:rounded-2xl text-white outline-none focus:border-titan-lime transition-all appearance-none font-bold text-sm'
                                    >
                                        {membership.map((item, index) => (
                                            <option key={index} value={item._id}>{item.months} MONTHS — {item.price} INR</option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    onClick={handleRenewSaveBtn} 
                                    className='bg-titan-lime text-black px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] hover:bg-white transition-all shadow-xl w-full md:w-auto'
                                >
                                    CONFIRM RENEWAL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer theme="dark" />
        </div>
    )
}

export default MemberDetail