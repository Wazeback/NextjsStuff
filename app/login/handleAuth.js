import {getAuth} from "firebase/auth";
import firebaseApp from "@/config/firebaseConfig";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/navigation";


export default function GetAuthUser() {
    const auth = getAuth(firebaseApp);
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        return <p>Error: {error.message}</p>;
    } else if (!user) {
        router.push('/login');
        return <p>Redirecting to login...</p>;
    }
    else {
        return user
    }
}
