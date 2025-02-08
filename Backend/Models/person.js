const mongoose=require("mongoose");
const { type } = require("os");
const bcrypt=require("bcrypt");
const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        // required:true
    }
});

personSchema.pre("save",async function(next){
    const person=this;
    if(!person.isModified("password")){
        return next();
    }

    try {
        const hashedPassword=await bcrypt.hash(person.password, 10);
        person.password=hashedPassword;
        next();
    } catch (error) {
        return next(error)
    }
})

personSchema.methods.comparePassword=async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}
const person=mongoose.model("person",personSchema);
module.exports=person;
