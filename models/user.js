import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    devices: [{
        deviceId: { type: String, required: true },
        token: { type: String, required: true }
    }]
});

// Удаляем пароль из возвращаемых данных
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
