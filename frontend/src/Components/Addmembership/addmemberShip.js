import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const AddmemberShip = ({ handleClose }) => {

    const [inputField, setInputField] = useState({ months: "", price: "" });
    const [membership, setMembership] = useState([]);

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value })
    }

    const fetchMembership = async () => {
        try {
            const response = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/plans/get-membership', { withCredentials: true });
            setMembership(response.data.memberships || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchMembership()
    }, [])

    const handleAddmembership = async () => {
        if (!inputField.months || !inputField.price) {
            toast.warning("Fill all fields");
            return;
        }
        try {
            const response = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/plans/add-membership', inputField, { withCredentials: true });
            if (response.status === 201) {
                toast.success("Membership Plan added");
                setInputField({ months: "", price: "" });
                fetchMembership();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to add plan");
        }
    }

    const handleRemovePlan = async (id) => {
        if (window.confirm("Are you sure you want to remove this plan?")) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/plans/delete-membership/${id}`, { withCredentials: true });
                if (response.status === 200) {
                    toast.success("Plan removed successfully");
                    fetchMembership();
                }
            } catch (err) {
                toast.error("Failed to remove plan");
            }
        }
    }

    return (
        <div className='p-10'>
            <div className='flex flex-wrap gap-4 items-center justify-center mb-10'>
                {membership.length > 0 ? (
                    membership.map((item, index) => (
                        <div key={index} className='p-4 bg-titan-dark border border-titan-grey rounded-[24px] font-heading flex items-center gap-6 group relative shadow-xl hover:border-titan-lime/30 transition-all'>
                            <div className='flex flex-col'>
                                <span className='font-black text-white italic uppercase text-sm tracking-tighter'>{item.months} MONTHS</span>
                                <span className='text-[10px] text-titan-lime font-black tracking-widest'>{item.price} INR</span>
                            </div>
                            <div 
                                onClick={() => handleRemovePlan(item._id)} 
                                className='w-8 h-8 bg-titan-black text-titan-muted border border-titan-grey cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 rounded-full flex items-center justify-center transition-all'
                                title="Decommission Plan"
                            >
                                <DeleteIcon sx={{ fontSize: '16px' }} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-titan-muted font-black text-[10px] tracking-widest py-8 uppercase opacity-30'>— NO PROTOCOLS DEFINED —</div>
                )}
            </div>

            <div className='bg-titan-dark/50 border border-titan-grey/30 p-8 rounded-[32px]'>
                <div className='text-[10px] text-titan-lime font-black tracking-[0.4em] mb-6 uppercase'>Define New Protocol</div>
                <div className='flex flex-col md:flex-row gap-6 items-end'>
                    <div className='w-full'>
                        <label className='block text-[10px] font-black text-titan-muted tracking-[0.3em] mb-2 uppercase'>DURATION (MONTHS)</label>
                        <input value={inputField.months} onChange={(event) => handleOnChange(event, "months")} className='w-full bg-titan-black border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' type='number' placeholder="00" />
                    </div>
                    <div className='w-full'>
                        <label className='block text-[10px] font-black text-titan-muted tracking-[0.3em] mb-2 uppercase'>PRICE (INR)</label>
                        <input value={inputField.price} onChange={(event) => handleOnChange(event, "price")} className='w-full bg-titan-black border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' type='number' placeholder="0.00" />
                    </div>
                    <button onClick={handleAddmembership} className='w-full md:w-auto bg-titan-lime text-black px-10 h-[52px] rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-xl uppercase active:scale-95'>Initialize</button>
                </div>
            </div>
            <ToastContainer theme="dark" />
        </div >
    )
}

export default AddmemberShip