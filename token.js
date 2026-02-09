import jwt from 'jsonwebtoken';

const genToken = (userId) => {
    try {
        // Standardize the payload key to 'userId' to match typical middleware
        const token = jwt.sign(
            { userId: userId }, 
            process.env.JWT_SECRET, 
            { expiresIn: "30d" }
        );      
        return token;
    } catch (error) {
        console.log("Token generation failed", error);
        return null;
    }   
};

export default genToken;