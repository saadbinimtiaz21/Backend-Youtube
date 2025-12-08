//                  API REQUEST ERROR HANDLING CLASS. 

// why we need this file ?
// to create custom error class for handling errors in a better way
// this class will extend the default error class of javascript
// so that we can add more properties to it like status code

// how to handle AApiError with pur own custom properties. 
class ApiError extends Error{
    constructor(
        statuscode,
        message= "something went wrong",
        errors = [],
        statck = ""
    )
    {
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        // if else is only for api error stack trace.
        // nothing to do with other properties.
        if(statck){
            this.stack = statck
        } else{
                Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}