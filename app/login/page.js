'use client'

import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import firebaseApp from "@/config/firebaseConfig";


const Login = () => {
    const router = useRouter();
    const auth = getAuth(firebaseApp);

    const handleGitHubLogin = async () => {
        const provider = new GithubAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('GitHub user:', user);

            router.push('/');
        } catch (error) {
            console.error('GitHub login error:', error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-black">Please login using GitHub</h2>
                <button
                    className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-900"
                    onClick={handleGitHubLogin}
                >
                    Login with GitHub
                </button>
            </div>
        </div>
    );
};

export default Login;
