import React from 'react'
import { Link } from 'react-router-dom';

const MemberCard = ({item}) => {
    return (
        <Link to={`/member/${item?._id}`} className='bg-titan-dark border border-titan-grey text-white shadow-[0_15px_30px_rgba(0,0,0,0.3)] rounded-[24px] md:rounded-[32px] p-5 md:p-8 hover:border-titan-lime/50 hover:-translate-y-2 cursor-pointer transition-all group overflow-hidden relative' >
            <div className='absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-titan-lime/5 rounded-full blur-3xl -mr-12 md:-mr-16 -mt-12 md:-mt-16 group-hover:bg-titan-lime/10 transition-all'></div>
            
            <div className='w-24 h-24 md:w-32 md:h-32 flex justify-center relative items-center border-2 border-titan-grey p-1 mx-auto rounded-full group-hover:border-titan-lime transition-colors duration-500'>
                <img className='w-full h-full rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700' src={item?.profilePic} alt='Profile Pic' />
                <div className={`absolute top-1 right-1 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] md:border-4 border-titan-dark shadow-lg ${item?.status==="Active"?"bg-titan-lime shadow-titan-lime/20":"bg-red-600 shadow-red-600/20"}`}></div>
            </div>

            <div className='text-center mt-5 md:mt-8'>
                <div className='text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-titan-muted uppercase mb-1.5 md:mb-2 group-hover:text-titan-lime transition-colors'>{item?.memberId}</div>
                <div className='text-xl md:text-2xl font-heading font-black italic uppercase tracking-tighter truncate'>{item?.name}</div>
                <div className='text-[10px] md:text-xs text-titan-muted font-bold tracking-[0.15em] md:tracking-[0.2em] mt-1.5 md:mt-2 uppercase'>{item?.mobileNo}</div>
                
                <div className='flex justify-center mt-4 md:mt-6'>
                    <div className='text-[8px] md:text-[10px] font-black bg-titan-black border border-white/5 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-wider md:tracking-widest shadow-inner group-hover:bg-titan-grey transition-all'>
                        {item?.membership?.months} MONTHS PLAN
                    </div>
                </div>
            </div>

            <div className='mx-auto mt-5 md:mt-8 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-titan-muted border-t border-titan-grey/30 pt-4 md:pt-6 flex justify-between items-center px-1 md:px-2'>
                <span className='opacity-60'>NEXT BILLING</span>
                <span className={item?.status==="Active"?"text-titan-lime":"text-red-500"}>
                    {item?.nextBillDate ? new Date(item.nextBillDate).toLocaleDateString() : 'N/A'}
                </span>
            </div>
        </Link >
    )
}

export default MemberCard