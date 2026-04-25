import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/auth/logout', {}, { withCredentials: true });
            localStorage.clear();
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.error(err);
            localStorage.clear();
            navigate('/');
        }
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className='hidden md:flex w-72 h-screen bg-titan-black text-white p-8 flex-col border-r border-titan-grey'>
                <div className='mb-16 mt-4'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='text-3xl font-heading font-black tracking-tighter uppercase'>.TITAN</div>
                    </div>
                </div>

                <div className='flex-grow flex flex-col gap-4'>
                    <Link to='/dashboard' className={`flex items-center gap-4 font-bold text-[10px] uppercase tracking-[0.2em] p-5 rounded-3xl transition-all ${location.pathname === "/dashboard" ? 'bg-titan-lime text-black shadow-[0_0_30px_rgba(180,255,0,0.2)]' : 'text-titan-muted hover:bg-titan-grey hover:text-white'}`}>
                        <HomeIcon fontSize="small" />
                        <span>Dashboard</span>
                    </Link>

                    <Link to='/member' className={`flex items-center gap-4 font-bold text-[10px] uppercase tracking-[0.2em] p-5 rounded-3xl transition-all ${location.pathname === "/member" ? 'bg-titan-lime text-black shadow-[0_0_30px_rgba(180,255,0,0.2)]' : 'text-titan-muted hover:bg-titan-grey hover:text-white'}`}>
                        <GroupIcon fontSize="small" />
                        <span>Members</span>
                    </Link>
                </div>

                <div className='mt-auto pt-8 border-t border-titan-grey'>
                    <div onClick={handleLogout} className='flex items-center gap-4 font-bold text-[10px] uppercase tracking-[0.2em] p-5 rounded-3xl cursor-pointer hover:bg-titan-grey hover:text-titan-lime transition-all text-titan-muted'>
                        <LogoutIcon fontSize="small" />
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-titan-black border-t border-titan-grey flex justify-around items-center py-3 px-4'>
                <Link to='/dashboard' className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${location.pathname === "/dashboard" ? 'text-titan-lime' : 'text-titan-muted'}`}>
                    <HomeIcon fontSize="small" />
                    <span className='text-[8px] font-black tracking-wider'>HOME</span>
                </Link>

                <Link to='/member' className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${location.pathname === "/member" ? 'text-titan-lime' : 'text-titan-muted'}`}>
                    <GroupIcon fontSize="small" />
                    <span className='text-[8px] font-black tracking-wider'>MEMBERS</span>
                </Link>

                <div onClick={handleLogout} className='flex flex-col items-center gap-1 px-4 py-2 rounded-2xl cursor-pointer text-titan-muted active:text-red-500 transition-all'>
                    <LogoutIcon fontSize="small" />
                    <span className='text-[8px] font-black tracking-wider'>LOGOUT</span>
                </div>
            </div>
        </>
    )
}

export default Sidebar