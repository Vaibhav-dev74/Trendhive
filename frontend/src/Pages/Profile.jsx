import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            const { data } = await axios.put('/api/users/profile', { name, email, password }, config);

            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage('Profile Updated Successfully!');
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    return (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-lg">
            <h2 className="mb-5 text-2xl font-semibold">Profile</h2>
            {message && <p className="text-green-500">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-3 border" />

                <label className="block mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-3 border" />

                <label className="block mb-2">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-3 border" />

                <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded-md">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
