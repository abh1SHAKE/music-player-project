import '../loader.css'
import '../styles/login.css'
import { Icon } from '@iconify/react';
import { useState } from 'react';
import TextInput from '../components/shared/TextInput';
import PasswordInput from '../components/shared/PasswordInput';
import { Link,useNavigate } from 'react-router-dom';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';
import { useCookies } from 'react-cookie';

const LoginComponent = () => {
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cookie, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    const login = async () => {
        const data = {email, password};
        if(data.email.trim() !== "" && data.password.trim() !== "") {
            setLoading(true);
        }
        else return;

        const response = await makeUnauthenticatedPOSTRequest("/auth/login",data);

        if(response && !response.err){
            const token = response.token;

            // Get current date for the expiration date of Cookie (+30 days)
            const date = new Date();
            date.setDate(date.getDate()+30);
            setCookie("token", token, {path: "/", expires: date});
            navigate("/home");
        }
        else {
            setLoginError(true);
        }

        setLoading(false);
    };

    return <div className="w-full h-full flex flex-col items-center">
        <div className="logo p-6 border-b border-solid border-gray-300 w-full flex justify-center">
            <Icon icon="logos:spotify" width="170"/>
        </div>
        <div className="inputRegion w-1/3 py-7 flex flex-col items-center justify-center">
            <div className="font-bold pb-6">To continue, log in to Spotify.</div>

            <div className={`${loginError ? "error-message-visible" : "error-message-hidden"}`}>
                Email or password is incorrect, Please try again.
            </div>

            <TextInput
                label="Email address or username"
                placeholder="Email address or username"
                className="py-5"
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
                    className="login-button bg-app-green text-white font-semibold p-3 px-9 rounded-full"
                    onClick={(e) => {e.preventDefault(); login();}}>
                    <div>
                        {
                            loading ?
                            <div className="loader">
                                <span className="loading-bar"></span>
                                <span className="loading-bar"></span>
                                <span className="loading-bar"></span>
                            </div> :
                            <div>LOGIN</div>
                        }
                    </div>
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