const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
}
)

const Task = mongoose.model('task', taskSchema)



module.exports = Task;