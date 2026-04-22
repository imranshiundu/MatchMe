import LoginForm from "../components/auth/LoginForm.tsx";
import {useState} from "react";
import RegistrationForm from "../components/auth/RegistrationForm.tsx";
import {Link} from 'react-router-dom';

function Auth() {
    const [login, setLogin] = useState<boolean>(true)
    const switchAuth = () => {
        setLogin(!login);
    }

    return (
        <div className='grid place-items-center'>
            <header className={'w-screen bg-[#1C1B1B] py-3 px-3 flex justify-center rounded-b-xl'}>
                <Link to={'/'} className={'text-4xl inline-block'}><i className={'text-[#C0FF00]'}>meet</i>space</Link>
            </header>
            <section className={'mt-15'}>
            {login ?
                <section>
                    <LoginForm/>
                    <div className={'grid place-items-center bg-[#1C1B1B] px-10 py-5 rounded-xl mt-5'}>
                        <p>Don't have an account?</p>
                        <button onClick={switchAuth} className='text-[#D8FF80] underline cursor-pointer'>
                            Register here!
                        </button>
                    </div>
                </section>
                :
                <section>
                    <RegistrationForm/>
                    <div className={'grid place-items-center bg-[#1C1B1B] px-10 py-5 rounded-xl mt-5'}>
                        <p>Already have an account?</p>
                        <button onClick={switchAuth} className='text-[#D8FF80] underline cursor-pointer'>
                            Login here!
                        </button>
                    </div>
                </section>
            }
            </section>
        </div>
    )
}

export default Auth;