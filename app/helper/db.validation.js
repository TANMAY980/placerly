const joi=require('joi')

class userInfoValid{
    async register_data(data){
        try {
            const registerSchema=joi.object({
                firstName:joi.string().pattern(/^[A-Za-z\s]+$/).min(2).max(30).required().messages({
                    "string.empty":"First name cannot be empty",
                    "any.required": "First name is required",
                    "string.min":"First name must have at least  2 characters",
                    "string.max":"First name must not exceed 30 characters",
                    "string.pattern.base": "First name must only contain letters and spaces"
                }),
                lastName:joi.string().pattern(/^[A-Za-z\s]+$/).min(2).max(30).required().messages({
                    "string.empty":"Last name is required",
                    "any.required": "Last name is required",
                    "string.min":"Last name must have at least  2 characters",
                    "string.max":"Last name must not exceed 30 characters",
                    "string.pattern.base": "Last name must only contain letters and spaces"
                }),
                email:joi.string().email().required().messages({
                    "string.email":"Please enter a valid email address",
                    "string.empty":"Email cannot be empty",
                    "any.required":"Email is required",

                }),
                contactNumber:joi.string().pattern(/^[0-9]{10}$/).required().messages({
                    "string.pattern.base":"Contact number must be exactly 10 digits",
                    "any.required":"Contact number is required",
                    "string.empty":"Contact cannot be empty",
                }),
                desiredPassword:joi.string().min(6).pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/).required().messages({
                    "string.min":"Password must be 6 charachters long",
                    "string.pattern.base":"Password must include at least one uppercase letter, one number, and one special character",
                    "any.required":"Password is required"
                }),
                confirmPassword:joi.string().valid(joi.ref('desiredPassword')).required().messages({
                    "any.only":"Confirm password must match desired password",
                    "any.required": "Confirm password is required"
                }),
                terms_conditon:joi.boolean().valid(true).required().messages({
                    "any.only":"You must accept the Terms and Conditions to process",
                    "any.required":"Terms and Conditions acceptance is required",
                    "boolean.base":"Invalid value for Terms and Conditons"
                }),
            })
            const { error, value } = registerSchema.validate(data, { abortEarly: false });
            return { error, value };
        }
         catch (error) {
            throw error
        }
    };
    
    async login(data){
        try {
            const loginSchema=joi.object({
            email:joi.string().email().required().messages({
                "string.email":"Please enter a valid email address",
                "string.empty":"Email cannot be empty",
                "any.required":"Email is required",
            }),
            password:joi.string().min(6).required().messages({
                    "string.min":"Password must be 6 charachters long",
                    "string.empty":"Password cannot be empty",
                    "any.required":"Password is required"
            }),

        });
        const {error,value}=loginSchema.validate(data,{abortEarly:false});
        return {error,value};
        } catch (error) {
            throw error
        }
    };

    async verify_email_data(data){
        try {
            const veriy_email_Schema=joi.object({
            email:joi.string().email().required().messages({
                "string.email":"Please enter a valid email address",
                "string.empty":"Email cannot be empty",
                "any.required":"Email is required",
            }),
            otp:joi.string().pattern(/^[0-9]{6}$/).required().messages({
                "string.pattern.base":"Contact number must be exactly 6 digits",
                "any.required":"Contact number is required",
                "string.empty":"Contact cannot be empty",
            })
        })
        const { error, value } =veriy_email_Schema.validate(data, { abortEarly: false });
        return { error, value };
        } catch (error) {
            throw error
        }
    };

    async update_password_data(data){
        try {
            const update_password_schema=joi.object({
                password:joi.string().min(6).required().messages({
                    "string.min":"Password must be 6 charachters long",
                    "string.empty":"Password cannot be empty",
                    "any.required":"Password is required"
            }),
            })
            const{error,value}=update_password_schema.validate(data,{abortEarly:false});
            return {error,value};
        } catch (error) {
            throw error
        }
    }
}
module.exports= new userInfoValid()
