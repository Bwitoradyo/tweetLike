//================================================================================
// Import Mongoose and password Encrypt ==========================================
//================================================================================
let mongoose = require ('mongoose');
let bcrypt = require ('bcrypt-nodejs');

//================================================================================
//Define the Schema for user model ===============================================
//================================================================================
let userSchema = mongoose.Schema({
//Using local for Local Strategy Passport ========================================
    local: {
        name:String,
        email:String,
        password: String,
    }
});

//================================================================================
//Encrypt the password here by generating Hash ===================================
//================================================================================
userSchema.methods.generateHash = function (password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//================================================================================
//Verify if password is valid ====================================================
//================================================================================
userSchema.methods.validPassword = function (password)  {
    return bcrypt.compareSync(password, this.local.password);
};

//================================================================================
//Create the model for users and expose it to our app=============================
//================================================================================
module.exports = mongoose.model('User', userSchema);