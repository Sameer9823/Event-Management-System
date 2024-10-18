import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userScheme = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        avatar:{
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'organizer', 'participant', 'volunteer'],
            default: 'participant',
            required: true
          },
          eventsParticipated: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event"
            }
        ],
        eventsOrganized: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event"
            }
        ],
        volunteerRoles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Volunteer"
            }
        ],
        refreshToken: {
            type: String
        }
        },

    
    {timestamps:true}
)

userScheme.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)

    next()
})

userScheme.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userScheme.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY

    })
}


userScheme.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY

    })

}

export const User = mongoose.model('User', userScheme)