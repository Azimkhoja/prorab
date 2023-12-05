export const response = {
    NotFound (message: string) {
        return {
            status: 404,
            success: false,
            message: message
        }     
    },
    Ok ( statusCode:number, message?: string, payload?: object) { 
        return {
            status: statusCode,
            success: true,
            message: message,
            data: payload
        }
    },
    AlreadyExists (statusCode:number, message?: string){
        return {
            status: statusCode,
            success: false,
            message
        }
    }
}