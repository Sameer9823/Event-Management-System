import mongoose, {Schema} from "mongoose";


const volunteerSchema = new Schema(
    
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        role: {
            type: String,
            enum: ['Logistics', 'Technical Support', 'Coordinator', 'Usher', 'Media'],  
            required: true,
          },
        task: {
            type: String,
            required: true
        },
        hoursWorked: {
            type: Number,
            default: 0
            },
        feedback: {
            type: String,
            default: ""
        }

    }, {timestamps:true}

)

export const Volunteer = mongoose.model('Volunteer', volunteerSchema)