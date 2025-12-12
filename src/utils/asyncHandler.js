const asyncHandler = (requestHandler) =>{
    return (req , res , next) => {
        Promise.resolve(requestHandler(req, res,next)).catch
        ((error)=> next(error))
    }
}

export{ asyncHandler , }
// try catch block method and second is promises method.
// ()=>{} is the higher order function that returns another function.
// syntax of higher order function is as below.
// const Asynhandler = (fn)=> async(error , req ,res, next)=>{
 // above is the wrapper function that takes another function as parameter   
//     try {
//         await fn(error , req , res , next)
//     } catch (error) {
//         res.status(error.code || 500).json({ // 500 means internal server error
//             success: false, // for frontend to know whether request is successful or not
//             message: error.message || "Internal Server Error"
//         })
//     }
// }





// reason to create this file ?
// asynchandle us to avoid try catch block in every controller
//  and to reuse whole code.
// when we need we simply import this file and wrap our
//  controller with this function.
