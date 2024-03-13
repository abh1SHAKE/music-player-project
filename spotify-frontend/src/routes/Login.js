import { Icon } from '@iconify/react';
import { useState } from 'react';
import TextInput from '../components/shared/TextInput';
import PasswordInput from '../components/shared/PasswordInput';
import { Link,useNavigate } from 'react-router-dom';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';
import { useCookies } from 'react-cookie';

const LoginComponent = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cookie, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    const login = async () => {
        const data = {email, password};
        const response = await makeUnauthenticatedPOSTRequest("/auth/login",data);

        if(response && !response.err){
            const token = response.token;

            // Get current date for the expiration date of Cookie (+30 days)
            const date = new Date();
            date.setDate(date.getDate()+30);
            setCookie("token", token, {path: "/", expires: date});
            alert("Logged In Successfully");
            navigate("/home");
        }
        else alert("Email/Password is Incorrect");
    };

    return <div className="w-full h-full flex flex-col items-center">
        <div className="logo p-6 border-b border-solid border-gray-300 w-full flex justify-center">
            <Icon icon="logos:spotify" width="170"/>
        </div>
        <div className="inputRegion w-1/3 py-7 flex flex-col items-center justify-center">
            {/* Will contains 2 input fields (email and password) 
            for login and also a sign-up button for new users */}
            <div className="font-bold mb-8">To continue, log in to Spotify.</div>

            <TextInput
                label="Email address or username"
                placeholder="Email address or username"
                className="my-5"
                value={email}
                setValue={setEmail}
            />
            <PasswordInput
                label="Password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
            />
            <div className="w-full flex items-center justify-center my-7">
                <button 
                    className="bg-app-green text-white font-semibold p-3 px-9 rounded-full"
                    onClick={(e) => {e.preventDefault(); login();}}>
                    LOG IN
                </button>
            </div>
            <div className="w-full border-b border-solid border-gray-300"></div>
            <div className="my-5 font-semibold text-lg">Don't have an account?</div>
            <div 
                className="w-full border border-gray-500 
                flex items-center justify-center py-4
                font-bold text-gray-500 rounded-full">
                <Link to="/signup">SIGN UP FOR SPOTIFY</Link>
            </div>
        </div>
    </div>
};

export default LoginComponent;