import status_code from '../../common/utils/statusCodes';

const isAuth = async (req,res,next)=>{
    // if(req.session.isAuth){
    //     next();
    // }
    // else{
    //     req.session.destroy();
    //     return res.status(status_code.UNAUTHORISED).json({message:"account session expired",status:status_code.UNAUTHORISED}) 
    // }
}
export default isAuth