function Login() {
    return (
        <div className='grid place-items-center'>
            <h1>Create Profile</h1>
            <form className='flex flex-col w-75 gap-2'>
                <input type={"text"} placeholder='email' className='bg-white text-black'/>
                <input type={"password"} placeholder='password' className='bg-white text-black'/>
                <button type='submit' className='cursor-pointer bg-[#EB5E28]'>Register</button>
            </form>
            <p>Already have an account?</p>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' className='text-blue-300 underline'>Login here!</a>
        </div>
    )
}

export default Login;