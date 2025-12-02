class ApiResponse{
    constructor(statusCode , message = "success"  , data){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400 
    }
}
export {ApiResponse}
// server has status codes to indicate the status of a request.
// if status code is less than 400 it means request is successful
// if status code is greater than 400 it means request is failed.
// in detailed status codes are as below:
// 1xx - informational responses
// 2xx - successful responses
// 3xx - redirection messages
// 4xx - client error responses
// 5xx - server error responses 

