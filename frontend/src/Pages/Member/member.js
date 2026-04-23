import React, { useState, useEffect } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Modal from '../../Components/Modal/modal';
import MemberCard from '../../Components/MemberCard/memberCard';
import AddmemberShip from '../../Components/Addmembership/addmemberShip';
import Addmembers from '../../Components/Addmembers/addmembers';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Member = () => {
    const [addMembership, setAddmemberShip] = useState(false);
    const [addMember, setAddmember] = useState(false)
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isSearchModeOn, setIsSearchModeOn] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [limit] = useState(9);

    const noOfPage = Math.ceil(totalData / limit);
    const startFrom = (currentPage - 1) * limit;

    useEffect(() => {
        fetchData(startFrom, limit);
    }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async (skip, limits) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/all-member?skip=${skip}&limit=${limits}`, { withCredentials: true });
            setData(response.data.members);
            setTotalData(response.data.totalMember);
            setIsSearchModeOn(false);
        } catch (err) {
            toast.error("Error fetching members");
            console.error(err);
        }
    }

    const handleMemberShip = () => {
        setAddmemberShip(prev => !prev);
    }

    const handleMembers = () => {
        setAddmember(prev => !prev);
    }

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }

    const handleNext = () => {
        if (currentPage < noOfPage) {
            setCurrentPage(prev => prev + 1);
        }
    }

    const handleSearchData = async () => {
        if (!search) {
            fetchData(0, limit);
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/search?searchTerm=${search}`, { withCredentials: true });
            setData(response.data.members);
            setTotalData(response.data.members.length);
            setIsSearchModeOn(true);
        } catch (err) {
            toast.error("Search failed");
            console.error(err);
        }
    }

    return (
        <div className='w-full bg-titan-black text-white p-10 relative h-screen overflow-y-auto custom-scrollbar uppercase tracking-tighter'>

            <div className='bg-titan-dark border border-titan-grey flex flex-col md:flex-row shadow-2xl justify-between w-full rounded-[32px] p-8 gap-8 items-center'>
                <div className='flex gap-4 w-full md:w-auto'>
                    <div className='bg-titan-lime text-black px-8 py-4 rounded-full cursor-pointer hover:scale-105 transition-all font-black text-xs flex items-center gap-2 shadow-lg shadow-titan-lime/20' onClick={() => handleMembers()}>
                        <FitnessCenterIcon fontSize="small" /> ADD MEMBER 
                    </div>
                    <div className='bg-titan-grey border border-white/5 text-white px-8 py-4 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all font-bold text-xs flex items-center gap-2' onClick={() => handleMemberShip()}>
                        <AddIcon fontSize="small" /> NEW PLAN 
                    </div>
                </div>
                
                <div className='flex gap-2 bg-titan-black border border-titan-grey rounded-2xl overflow-hidden focus-within:border-titan-lime transition-all w-full md:w-[450px] p-2'>
                    <input 
                        type='text' 
                        value={search} 
                        onChange={(e) => { setSearch(e.target.value) }} 
                        className='bg-transparent w-full px-4 outline-none text-xs font-black placeholder-titan-muted tracking-widest' 
                        placeholder='SEARCH BY NAME OR MOBILE...' 
                    />
                    <button onClick={() => { handleSearchData() }} className='bg-titan-grey w-12 h-12 rounded-xl hover:bg-titan-lime hover:text-black transition-all flex items-center justify-center'>
                        <SearchIcon fontSize="small" />
                    </button>
                </div>
            </div>

            <div className='mt-12 mb-8'>
                <Link to={'/dashboard'} className='text-titan-muted hover:text-titan-lime transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2'>
                    <ArrowBackIcon fontSize="small" /> BACK TO PERFORMANCE
                </Link>
            </div>

            <div className='text-4xl font-heading font-black flex justify-between items-end text-white border-b border-titan-grey pb-8 mb-12 uppercase tracking-tighter'>
                <div>MEMBER BASE <span className='text-titan-lime ml-2 text-2xl'>{totalData}</span></div>
                {!isSearchModeOn && (
                    <div className='flex gap-6 items-center text-[10px] font-black tracking-[0.3em] text-titan-muted'>
                        <div>{startFrom + 1}—{Math.min(startFrom + limit, totalData)} OF {totalData}</div>
                        <div className='flex gap-3'>
                            <div className={`w-12 h-12 cursor-pointer border border-titan-grey flex items-center justify-center rounded-2xl hover:bg-titan-lime hover:text-black hover:border-titan-lime transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`} onClick={handlePrev}><ChevronLeftIcon /></div>
                            <div className={`w-12 h-12 cursor-pointer border border-titan-grey flex items-center justify-center rounded-2xl hover:bg-titan-lime hover:text-black hover:border-titan-lime transition-all ${currentPage === noOfPage ? 'opacity-20 cursor-not-allowed' : ''}`} onClick={handleNext}><ChevronRightIcon /></div>
                        </div>
                    </div>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24'>
                {data.map((item) => (
                    <MemberCard key={item._id} item={item} />
                ))}
            </div>

            {data.length === 0 && (
                <div className='flex flex-col items-center justify-center mt-32 text-titan-muted'>
                    <div className='text-8xl mb-6 opacity-20'>.T</div>
                    <div className='text-2xl font-black uppercase tracking-widest italic opacity-50'>No operatives found</div>
                </div>
            )}

            {addMembership && <Modal header="Titan Membership Plan" handleClose={handleMemberShip} content={<AddmemberShip handleClose={handleMemberShip} />} />}
            {addMember && <Modal header={"Register New Operative"} handleClose={handleMembers} content={<Addmembers handleClose={handleMembers} />} />}
            <ToastContainer theme="dark" />
        </div>
    )
}

export default Member