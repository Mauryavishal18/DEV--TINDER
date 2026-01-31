const adminAuth = (req, res, next) => {
    console.log('Admin middleware executed');
    const token="xyz";
    const isAdminAuthorized = token ==="xyz"; // Example check
    if (!isAdminAuthorized) {
        return res.status(401).send('Unauthorized Access ');
    }else{
        next();
    }
    
};

const userAuth = (req, res, next) => {
    console.log('User middleware executed');
    const token="xyzt";
    const isUserAuthorized = token ==="xyzt"; // Example check
    if (!isUserAuthorized) {
        return res.status(403).send('Unauthorized Access ');
    }else{
        next();
    }
    
};

module.exports = {
    adminAuth,
    userAuth
}