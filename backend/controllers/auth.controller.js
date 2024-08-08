//Signup function
export const signup = async(req,res) => {
    try {
        
    } catch (error) {
        //Error handling
        console.log(`Error in signup Controller, ${error.message}`);
        return res.status(500).json({});
    }
}

//Login function
export const login = async(req,res) => {
    try {
        
    } catch (error) {
        //Error handling
        console.log(`Error in login Controller, ${error.message}`);
        return res.status(500).json({});
    }
}

//Logout function
export const logout = async(req,res) => {
    try {
        
    } catch (error) {
        //Error handling
        console.log(`Error in logout Controller, ${error.message}`);
        return res.status(500).json({});
    }
}