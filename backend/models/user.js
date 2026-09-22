import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = mongoose.Schema({
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "India" },
    phone: { type: String, default: "" },
});

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'shopkeeper', 'admin'], default: 'user' },
        isAdmin: { type: Boolean, default: false },
        isShopkeeper: { type: Boolean, default: false },
        shopName: { type: String, default: "" },
        address: {
            type: addressSchema,
            default: () => ({}),
        },
        shopAddress: {
            type: addressSchema,
            default: () => ({}),
        },
        resetPasswordCode: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// ✅ Fix: Hash password only if it's new or modified
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// ✅ Fix: Password comparison function
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
