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
    
    const [cookie, setCookie] = useCookies(["token"]);
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

    return <div className="w-full h-full flex flex-col items-center">
        <div className="logo p-6 border-b border-solid border-gray-300 w-full flex justify-center">
            <Icon icon="logos:spotify" width="170"/>
        </div>
        <div className="inputRegion py-7 flex flex-col items-center justify-center">
            {/* Will contain 2 input fields (email and password) 
            for login and also a sign-up button for new users */}
            <div className="font-bold mb-8 text-2xl">Sign up for free to start listening.</div>

            <TextInput
                label="What's your email?"
                placeholder="Enter your email."
                className="my-5"
                value={email}
                setValue={setEmail}
            />
            <TextInput
                label="Confirm your email"
                placeholder="Enter your email again."
                className="mb-5"
                value={confirmEmail}
                setValue={setConfirmEmail}
            />
            <PasswordInput
                label="Create a password"
                placeholder="Create a password."
                value={password}
                setValue={setPassword}
            />
            <div className="w-full flex justify-between items-center space-x-7">
                <TextInput
                label="First Name"
                placeholder="Enter your first name."
                className="my-5"
                value={firstName}
                setValue={setFirstName}
                />
                <TextInput
                label="Last Name"
                placeholder="Enter your last name."
                className="my-5"
                value={lastName}
                setValue={setLastName}
                />
            </div>
            <TextInput
                label="What should we call you"
                placeholder="Enter a profile name."
                className="my-5"
                value={username}
                setValue={setUsername}
            />
            <div className="w-full flex items-center justify-center my-7">
                <button 
                    className="bg-app-green text-white font-semibold p-3 px-9 rounded-full"
                    onClick={(e)=>{e.preventDefault(); signUp();}}>
                    SIGN UP
                </button>
            </div>
            <div className="w-full border-b border-solid border-gray-300"></div>
            <div className="my-5 font-semibold text-lg">Already have an account?</div>
            <div 
                className="w-full border border-gray-500 
                flex items-center justify-center py-4
                font-bold text-gray-500 rounded-full">
                <Link to="/login">LOG IN INSTEAD</Link>
            </div>
        </div>
    </div>
};

export default SignupComponent;