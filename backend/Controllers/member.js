const Member = require('../Modals/member');
const Membership = require('../Modals/membership')

exports.getAllMember = async(req,res)=>{
    try{
        const {skip,limit} = req.query;
        const members = await Member.find({gym:req.gym._id})
            .populate('membership')
            .skip(parseInt(skip) || 0)
            .limit(parseInt(limit) || 100)
            .sort({createdAt: -1});
            
        const totalMember = await Member.countDocuments({gym:req.gym._id});

        res.status(200).json({
            members,
            totalMember
        });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}


function addMonthsToDate(months,joiningDate) {
    let today = new Date(joiningDate);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 
    const currentDay = today.getDate();
  
    const futureMonth = currentMonth + parseInt(months);
    const futureYear = currentYear + Math.floor(futureMonth / 12);
    const adjustedMonth = futureMonth % 12;
  
    const futureDate = new Date(futureYear, adjustedMonth, 1);
    const lastDayOfFutureMonth = new Date(futureYear, adjustedMonth + 1, 0).getDate();
    const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);
  
    futureDate.setDate(adjustedDay);
    return futureDate;
}

exports.registerMember = async(req,res)=>{
    try{
        const {name,mobileNo,address,membership,profilePic,joiningDate} = req.body;
        
        // Basic validation
        if (!name || !mobileNo || !membership) {
            return res.status(400).json({ error: 'Missing required fields: name, mobileNo, or membership' });
        }

        const existingMember = await Member.findOne({gym:req.gym._id,mobileNo});
        if(existingMember){
            return res.status(409).json({ error: 'Already registered with this Mobile No' });
        }

        // Try to find membership, handle potential CastError
        let memberShip;
        try {
            memberShip = await Membership.findOne({_id:membership,gym:req.gym._id});
        } catch (idErr) {
            return res.status(400).json({ error: 'Invalid Membership ID format' });
        }

        if(memberShip){
            const totalMembers = await Member.countDocuments({gym:req.gym._id});
            const memberId = `GYM-${totalMembers + 101}`; 
            
            const nextBillDate = addMonthsToDate(memberShip.months, joiningDate || new Date());
            
            const newMember = new Member({
                name,
                memberId,
                mobileNo,
                address,
                membership,
                gym: req.gym._id,
                profilePic,
                nextBillDate,
                lastPayment: joiningDate || new Date()
            });

            await newMember.save();
            res.status(201).json({message: "Member registered successfully", member: newMember});

        }else{
            return res.status(404).json({error:"No such Membership found"})
        }

    }catch(err){
        console.error("REGISTRATION ERROR:", err); // This will show in Render Logs
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
}

exports.searchMember = async(req,res)=>{
    try{
        const {searchTerm} = req.query;
        if (!searchTerm) {
            return res.status(200).json({ members: [] });
        }
        const members = await Member.find({
            gym: req.gym._id,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { mobileNo: { $regex: searchTerm, $options: 'i' } },
                { memberId: { $regex: searchTerm, $options: 'i' } }
            ]
        }).populate('membership').limit(20);

        res.status(200).json({members});

    }catch(err){
        console.error("Search Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}


exports.monthlyMember = async(req,res)=>{
    try{
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const member = await Member.find({gym:req.gym._id,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).populate('membership').sort({ createdAt: -1 });

        res.status(200).json({
            message:member.length?"Fetched Members SuccessFully":"No Such Member Registered yet",
            members:member,
            totalMembers:member.length
        })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.expiringWithin3Days= async(req,res)=>{
    try{
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);

        const members = await Member.find({
            gym: req.gym._id,
            nextBillDate: { $gte: today, $lte: nextThreeDays }
        }).populate('membership');

        res.status(200).json({members});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.expiringWithIn4To7Days = async(req,res)=>{
    try{
        const today = new Date();
        const next4Days = new Date();
        next4Days.setDate(today.getDate()+4);
        const next7Days = new Date();
        next7Days.setDate(today.getDate()+7);

        const members = await Member.find({
            gym: req.gym._id,
            nextBillDate: { $gte: next4Days, $lte: next7Days }
        }).populate('membership');

        res.status(200).json({members});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.expiredMember = async(req,res)=>{
    try{
        const today = new Date();
        const members = await Member.find({
            gym: req.gym._id,
            nextBillDate: { $lt: today }
        }).populate('membership');

        res.status(200).json({members});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}


exports.inActiveMember = async(req,res)=>{
    try{
        const members = await Member.find({
            gym: req.gym._id,
            status: "Pending"
        }).populate('membership');

        res.status(200).json({members});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getMemberDetails = async(req,res)=>{
    try{
        const {id} = req.params;
        const member = await Member.findOne({_id:id,gym:req.gym._id}).populate('membership');
        if(!member){
            return res.status(404).json({error: "Member not found"});
        }
        res.status(200).json({member});
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.changeStatus = async(req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        const member = await Member.findOneAndUpdate(
            {_id:id,gym:req.gym._id},
            {status},
            {new: true}
        );
        res.status(200).json({message: "Status updated", member});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}


exports.updateMemberPlan=async(req,res)=>{
    try{
        const {membership} = req.body;
        const {id} = req.params;
        const memberShip = await Membership.findOne({gym:req.gym._id,_id:membership});
        if(memberShip){
            let getMonth = memberShip.months;
            let today = new Date();
            let nextBillDate = addMonthsToDate(getMonth,today);
            
            const member = await Member.findOneAndUpdate(
                {gym:req.gym._id,_id:id},
                {
                    membership,
                    nextBillDate,
                    lastPayment: today,
                    status: "Active"
                },
                {new: true}
            );

            res.status(200).json({message: "Plan updated successfully", member});

        }else{
            return res.status(409).json({error:"No such Membership found"})
        }

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findOneAndDelete({ _id: id, gym: req.gym._id });
        if (!member) {
            return res.status(404).json({ error: "Member not found or unauthorized" });
        }
        res.status(200).json({ message: "Member deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
}