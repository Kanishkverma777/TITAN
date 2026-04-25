import React, { useState, useEffect } from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../Components/Modal/modal';
import EditGym from '../../Components/EditGym/editGym';
import Loader from '../../Components/Loader/loader';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyMembers: 0,
    expiring3Days: 0,
    expiring7Days: 0,
    expiredMembers: 0
  });

  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/auth/overview', { withCredentials: true });
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }
    fetchStats();
  }, [])

  const handleOnClickMenu = (value) => {
    sessionStorage.setItem('func', value);
  }

  const gymDetails = JSON.parse(localStorage.getItem('gymDetails') || '{}');

  return (
    <div className='w-full bg-titan-black text-white p-6 md:p-10 relative h-screen overflow-y-auto custom-scrollbar uppercase tracking-tighter pb-24 md:pb-10'>
      {/* Header */}
      <div className='w-full flex justify-between items-end mb-10 md:mb-16'>
        <div>
            <h1 className='text-3xl md:text-5xl font-heading font-black tracking-tighter'>COMMAND CENTRE</h1>
        </div>
        <div className='flex items-center gap-4 md:gap-6 cursor-pointer hover:opacity-80 transition-all group' onClick={() => setEditProfile(true)}>
            <div className='text-right hidden md:block'>
                <div className='font-black text-xl leading-tight group-hover:text-titan-lime transition-colors'>{gymDetails.gymName || 'TITAN CLUB'}</div>
                <div className='text-[10px] text-titan-muted font-bold tracking-widest'>{gymDetails.email}</div>
            </div>
            <div className='relative'>
                <img 
                    className='w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-titan-grey object-cover group-hover:border-titan-lime transition-all' 
                    src={gymDetails.profilePic || 'https://i.pravatar.cc/150'} 
                    alt='Profile' 
                />
                <div className='absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-titan-lime rounded-full border-4 border-titan-black'></div>
            </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      {loading ? (
        <div className='w-full h-60 md:h-96 flex items-center justify-center bg-titan-dark/30 rounded-[24px] md:rounded-[32px] border border-titan-grey/20'>
            <Loader />
        </div>
      ) : (
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-20'>
        
        {/* Total Members */}
        <Link to={'/member'} onClick={() => handleOnClickMenu("allMembers")} className='group relative bento-card p-6 md:p-10 flex flex-col justify-between transition-all duration-500 hover:border-titan-lime hover:scale-[1.02]'>
            <div className='flex justify-between items-start'>
                <div className='w-10 h-10 md:w-14 md:h-14 bg-titan-black rounded-xl md:rounded-2xl flex items-center justify-center border border-titan-grey group-hover:bg-titan-lime group-hover:text-black transition-all'>
                    <PeopleAltIcon sx={{ fontSize: { xs: "20px", md: "28px" } }} />
                </div>
            </div>
            <div className='mt-6 md:mt-12'>
                <p className='text-titan-muted font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] mb-1 md:mb-2'>Total Members</p>
                <p className='text-4xl md:text-6xl font-heading font-black tracking-tighter italic'>{stats.totalMembers}</p>
            </div>
        </Link>

        {/* Monthly Joined */}
        <Link to={'/specific/monthly'} onClick={() => handleOnClickMenu("monthlyJoined")} className='group relative bento-card p-6 md:p-10 flex flex-col justify-between transition-all duration-500 hover:border-titan-lime hover:scale-[1.02]'>
            <div className='flex justify-between items-start'>
                <div className='w-10 h-10 md:w-14 md:h-14 bg-titan-black rounded-xl md:rounded-2xl flex items-center justify-center border border-titan-grey group-hover:bg-titan-lime group-hover:text-black transition-all'>
                    <SignalCellularAltIcon sx={{ fontSize: { xs: "20px", md: "28px" } }} />
                </div>
            </div>
            <div className='mt-6 md:mt-12'>
                <p className='text-titan-muted font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] mb-1 md:mb-2'>New This Month</p>
                <p className='text-4xl md:text-6xl font-heading font-black tracking-tighter italic'>{stats.monthlyMembers}</p>
            </div>
        </Link>

        {/* Expiring (Warning style) */}
        <Link to={'/specific/threeDayExpire'} onClick={() => handleOnClickMenu("threeDayExpire")} className='group relative bg-titan-lime text-black border border-titan-lime rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col justify-between transition-all duration-500 hover:scale-[1.05] shadow-[0_0_50px_rgba(180,255,0,0.2)]'>
            <div className='flex justify-between items-start'>
                <div className='w-10 h-10 md:w-14 md:h-14 bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-titan-lime'>
                    <AccessAlarmIcon sx={{ fontSize: { xs: "20px", md: "28px" } }} className='animate-pulse' />
                </div>
            </div>
            <div className='mt-6 md:mt-12'>
                <p className='font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] mb-1 md:mb-2 opacity-60'>Urgent Expiring</p>
                <p className='text-4xl md:text-6xl font-heading font-black tracking-tighter italic leading-none'>{stats.expiring3Days}</p>
            </div>
        </Link>

        {/* Expired / Other */}
        <div className='grid grid-rows-2 gap-4 md:gap-6'>
            <Link to={'/specific/expired'} onClick={() => handleOnClickMenu("expired")} className='group relative bento-card p-4 md:p-6 flex justify-between items-center transition-all hover:border-titan-lime'>
                <div>
                    <p className='text-titan-muted font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] mb-1'>Expired</p>
                    <p className='text-2xl md:text-4xl font-heading font-black leading-none'>{stats.expiredMembers}</p>
                </div>
                <div className='w-8 h-8 md:w-10 md:h-10 bg-titan-grey rounded-full flex items-center justify-center text-sm group-hover:bg-titan-lime group-hover:text-black transition-all'>✕</div>
            </Link>
            
            <Link to={'/member'} className='group relative bg-white text-black rounded-[24px] md:rounded-[32px] p-4 md:p-6 flex items-center justify-center gap-3 md:gap-4 transition-all hover:bg-titan-lime'>
                <span className='font-black text-sm md:text-lg uppercase tracking-tighter'>Add Member</span>
                <div className='w-7 h-7 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-lg md:text-xl'>+</div>
            </Link>
        </div>

      </div>
      )}

      {editProfile && (
        <Modal 
            header="Edit Gym Profile" 
            handleClose={() => setEditProfile(false)} 
            content={<EditGym handleClose={() => setEditProfile(false)} />} 
        />
      )}
    </div>
  )
}

export default Dashboard