import mongoose, {Schema} from "mongoose";

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String
        },
        location: {
            type: String,
            required: true
        },
        organizer: [
            {
                 type: Schema.Types.ObjectId,
                 ref: "User"
            }
        ]
           
        ,
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        volunteers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Volunteer"
            }
        ],
        maxParticipants: {
            type: Number,
            default: 100
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "canceled"],
            default: "upcoming"
        },
        image: {
            type: String
        }
    }, 
    
    {timestamps:true})

export const Event = mongoose.model("Events", eventSchema)
