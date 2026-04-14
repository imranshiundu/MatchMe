import LoginForm from "../components/auth/LoginForm.tsx";
import {useState} from "react";
import RegistrationForm from "../components/auth/RegistrationForm.tsx";

function Auth() {
    const [login, setLogin] = useState<boolean>(true)
    const switchAuth = () => {
        setLogin(!login);
    }

    return (
        <div className='grid place-items-center'>
            {login ?
                <section>
                    <RegistrationForm/>
                    <p>Already have an account?</p>
                    <button onClick={switchAuth} className='text-blue-300 underline cursor-pointer'>
                        Login here!
                    </button>
                </section>
                :
                <section>
                    <LoginForm/>
                    <p>Don't yet have an account?</p>
                    <button onClick={switchAuth} className='text-blue-300 underline cursor-pointer'>
                        Register here!
                    </button>
                </section>
            }
        </div>
    )
}

export default Auth;