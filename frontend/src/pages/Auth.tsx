import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseCLient';

const Auth: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                // Sign up with Supabase Auth - store username in metadata
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { 
                        data: { 
                            username: username
                        } 
                    }
                });

                if (error) throw error;
                
                if (data.user) {
                    // Create a function to insert the profile once the user is authenticated
                    // This avoids RLS policy issues
                    const { error: functionError } = await supabase.rpc('create_profile_for_user', {
                        user_id: data.user.id,
                        user_email: email,
                        user_name: username
                    });
                    
                    // If the RPC function doesn't exist, we'll handle it in the dashboard component
                    if (functionError && !functionError.message.includes("does not exist")) {
                        console.error("Error creating profile:", functionError);
                    }
                }
                
                alert('Check your email for the confirmation link!');
            } else {
                // Log in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                alert('Logged in successfully!');
                navigate('/Dashboard');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isSignUp ? 'Sign Up' : 'Login'}
                </h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {isSignUp && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
                    <button 
                        onClick={() => setIsSignUp(!isSignUp)} 
                        className="text-blue-500 hover:underline ml-1"
                        disabled={loading}
                    >
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;