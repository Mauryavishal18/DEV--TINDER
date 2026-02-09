const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || firstName.length < 5) {
    throw new Error("First name is not valid");
  }

  if (lastName && lastName.length < 3) {
    throw new Error("Last name is not valid");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};
const validateEditProfileData=(req)=>{
  const allowedEditFields=["firstName" ," lastName", "emailId","photoUrl","gender","age","about","skills"];

  const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields,includes(field));

  return true;
};



module.exports = { validateSignUpData ,validateEditProfileData};
