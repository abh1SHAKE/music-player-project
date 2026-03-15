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

    return <div className="w-full min-h-full flex flex-col items-center overflow-auto">
        <div className="logo w-full flex justify-center border-b border-solid border-gray-300 shrink-0 p-4 sm:p-6">
            <Icon icon="logos:spotify" className="w-28 sm:w-40 md:w-[170px] max-w-[170px]"/>
        </div>
        <div className="inputRegion w-full max-w-md sm:max-w-lg md:w-2/3 lg:w-1/3 px-4 sm:px-6 py-6 sm:py-7 flex flex-col items-center justify-center flex-1 min-h-0">
            <div className="font-bold pb-4 sm:pb-6 text-center sm:text-left w-full text-base sm:text-lg">To continue, log in to Spotify.</div>

            <div className={`w-full ${loginError ? "error-message-visible" : "error-message-hidden"}`}>
                Email or password is incorrect, Please try again.
            </div>

            <TextInput
                label="Email address or username"
                placeholder="Email address or username"
                className="py-4 sm:py-5 w-full"
                value={email}
                setValue={setEmail}
            />
            <PasswordInput
                label="Password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
            />
            <div className="w-full flex items-center justify-center my-5 sm:my-7">
                <button 
                    className="login-button w-full sm:w-auto min-w-[120px] bg-app-green text-white font-semibold p-3 px-6 sm:px-9 rounded-full"
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
            <div className="my-4 sm:my-5 font-semibold text-base sm:text-lg text-center sm:text-left w-full">Don't have an account?</div>
            <div 
                className="w-full border border-gray-500 
                flex items-center justify-center py-3 sm:py-4
                font-bold text-gray-500 rounded-full hover:border-white hover:text-white transition-colors">
                <Link to="/signup">SIGN UP FOR SPOTIFY</Link>
            </div>
        </div>
    </div>
};

export default LoginComponent;