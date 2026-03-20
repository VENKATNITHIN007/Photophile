import appConfig from "../../config";

// extends default js error class

class ApiError extends Error {
    // types for obj , public and readonly are typescript features 
    public readonly success: boolean = false;
    public readonly statusCode: number;
    public readonly data: null = null;
    public readonly errors: unknown;
    public readonly stack?: string;
    public message = "Something went wrong";

    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors: unknown = "",
        stack = ""
    ) {
        // giving message to js default error object using super so that it attches msg to the front of error 
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors;
        // where the error occured at is stack 
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
    // returns filtered js obj required to convert in json using .json
    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            errors: this.errors,
            // undefined in production stack can cause security issues in prod
            stack: appConfig.debug ? this.stack : undefined,
        }
    }

}

export default ApiError;