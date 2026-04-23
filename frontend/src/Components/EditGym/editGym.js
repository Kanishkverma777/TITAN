import React, { useState } from 'react'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import LinearProgress from '@mui/material/LinearProgress';

const EditGym = ({ handleClose }) => {
    const initialData = JSON.parse(localStorage.getItem('gymDetails') || '{}');
    const [inputField, setInputField] = useState({
        gymName: initialData.gymName || "",
        email: initialData.email || "",
        profilePic: initialData.profilePic || "",
        address: initialData.address || "",
        contact: initialData.contact || ""
    });
    const [loader, setLoader] = useState(false);

    const handleOnChange = (e, name) => {
        setInputField({ ...inputField, [name]: e.target.value });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            setLoader(true);
            reader.onloadend = () => {
                setInputField({ ...inputField, profilePic: reader.result });
                setLoader(false);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await axios.put((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/auth/update-gym', inputField, { withCredentials: true });
            if (response.status === 200) {
                toast.success("Gym Details Updated!");
                localStorage.setItem('gymDetails', JSON.stringify(response.data.gym));
                setTimeout(() => {
                    handleClose();
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            toast.error("Failed to update gym details");
        }
    }

    return (
        <div className='p-10'>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-col items-center gap-6'>
                    <div className='relative group'>
                        <div className='absolute -inset-1 bg-titan-lime rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
                        <img src={inputField.profilePic} className='relative w-32 h-32 rounded-full border-4 border-titan-dark object-cover shadow-2xl' alt='Gym Profile' />
                        {loader && <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full'><LinearProgress sx={{ width: '60%' }} color="success" /></div>}
                    </div>
                    <div className='w-full max-w-xs'>
                        <label className='block text-[10px] text-center text-titan-muted font-black uppercase tracking-[0.3em] mb-3'>Update Identification</label>
                        <input 
                            type='file' 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className='w-full text-center text-[10px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-titan-grey file:text-white hover:file:bg-white hover:file:text-black file:transition-all cursor-pointer' 
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-1'>
                        <label className='text-[10px] text-titan-muted font-black uppercase tracking-widest ml-1'>Gym Name</label>
                        <input 
                            value={inputField.gymName} 
                            onChange={(e) => handleOnChange(e, "gymName")} 
                            type='text' 
                            className='w-full bg-titan-dark border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' 
                        />
                    </div>

                    <div className='space-y-1'>
                        <label className='text-[10px] text-titan-muted font-black uppercase tracking-widest ml-1'>Email</label>
                        <input 
                            value={inputField.email} 
                            onChange={(e) => handleOnChange(e, "email")} 
                            type='email' 
                            className='w-full bg-titan-dark border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' 
                        />
                    </div>

                    <div className='space-y-1'>
                        <label className='text-[10px] text-titan-muted font-black uppercase tracking-widest ml-1'>Contact</label>
                        <input 
                            value={inputField.contact} 
                            onChange={(e) => handleOnChange(e, "contact")} 
                            placeholder="+0 000 000 000" 
                            type='text' 
                            className='w-full bg-titan-dark border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' 
                        />
                    </div>

                    <div className='space-y-1'>
                        <label className='text-[10px] text-titan-muted font-black uppercase tracking-widest ml-1'>Address</label>
                        <input 
                            value={inputField.address} 
                            onChange={(e) => handleOnChange(e, "address")} 
                            placeholder="Gym Address" 
                            type='text' 
                            className='w-full bg-titan-dark border border-titan-grey rounded-2xl p-4 text-white text-sm focus:border-titan-lime outline-none transition-all placeholder:opacity-20' 
                        />
                    </div>
                </div>

                <button 
                    onClick={handleUpdate} 
                    className='w-full bg-titan-lime text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl text-xs hover:bg-white transition-all shadow-xl active:scale-95'
                >
                    COMMIT UPDATES
                </button>
            </div>
            <ToastContainer theme="dark" />
        </div>
    )
}

export default EditGym;
