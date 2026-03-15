import { Icon } from '@iconify/react';
import TextInput from '../components/shared/TextInput';
import PasswordInput from '../components/shared/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {useCookies} from 'react-cookie';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';

const SignupComponent = () => {
    const [email,setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    
    const [, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    // Function that will be called when we eventually click on 'Sign up'.
    const signUp = async () => {
        if(email !== confirmEmail){
            alert("Emails don't match, Check Again.");
            return;
        }
        const data = {email, password, firstName, lastName, username};
        const response = await makeUnauthenticatedPOSTRequest("/auth/register",data);

        if(response && !response.err){
            const token = response.token;

            // Get current date for the expiration date of Cookie (+30 days)
            const date = new Date();
            date.setDate(date.getDate()+30);
            setCookie("token", token, {path: "/", expires: date});
            alert("Sign Up Successful");
            navigate("/home");
        }
        else alert("Failure");
    };

    return <div className="w-full min-h-full flex flex-col items-center overflow-auto">
        <div className="logo w-full flex justify-center border-b border-solid border-gray-300 shrink-0 p-4 sm:p-6">
            <Icon icon="logos:spotify" className="w-28 sm:w-40 md:w-[170px] max-w-[170px]"/>
        </div>
        <div className="inputRegion w-full max-w-md sm:max-w-lg md:w-2/3 lg:w-1/3 px-4 sm:px-6 py-6 sm:py-7 flex flex-col items-stretch justify-center flex-1 min-h-0">
            <div className="font-bold mb-6 sm:mb-8 text-lg sm:text-2xl text-center sm:text-left w-full">Sign up for free to start listening.</div>

            <TextInput
                label="What's your email?"
                placeholder="Enter your email."
                className="my-4 sm:my-5 w-full"
                value={email}
                setValue={setEmail}
            />
            <TextInput
                label="Confirm your email"
                placeholder="Enter your email again."
                className="mb-4 sm:mb-5 w-full"
                value={confirmEmail}
                setValue={setConfirmEmail}
            />
            <PasswordInput
                label="Create a password"
                placeholder="Create a password."
                value={password}
                setValue={setPassword}
            />
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0 sm:gap-7">
                <TextInput
                    label="First Name"
                    placeholder="Enter your first name."
                    className="my-4 sm:my-5 w-full"
                    value={firstName}
                    setValue={setFirstName}
                />
                <TextInput
                    label="Last Name"
                    placeholder="Enter your last name."
                    className="my-4 sm:my-5 w-full"
                    value={lastName}
                    setValue={setLastName}
                />
            </div>
            <TextInput
                label="What should we call you"
                placeholder="Enter a profile name."
                className="my-4 sm:my-5 w-full"
                value={username}
                setValue={setUsername}
            />
            <div className="w-full flex items-center justify-center my-5 sm:my-7">
                <button 
                    className="w-full sm:w-auto min-w-[120px] bg-app-green text-white font-semibold p-3 px-6 sm:px-9 rounded-full"
                    onClick={(e)=>{e.preventDefault(); signUp();}}>
                    SIGN UP
                </button>
            </div>
            <div className="w-full border-b border-solid border-gray-300"></div>
            <div className="my-4 sm:my-5 font-semibold text-base sm:text-lg text-center sm:text-left w-full">Already have an account?</div>
            <div 
                className="w-full border border-gray-500 
                flex items-center justify-center py-3 sm:py-4
                font-bold text-gray-500 rounded-full hover:border-white hover:text-white transition-colors">
                <Link to="/login">LOG IN INSTEAD</Link>
            </div>
        </div>
    </div>
};

export default SignupComponent;