import {Link} from 'react-router-dom';
import RegistrationForm from '../components/auth/RegistrationForm.tsx'

function Landing () {
    return (
        <div>
            <header className={'bg-[#1C1B1B] py-3 px-3 flex justify-between rounded-b-xl'}>
                <div></div>
                <h1 className={'text-4xl inline-block'}><i className={'text-[#C0FF00]'}>meet</i>space</h1>
                <Link to={'/login'} className={'inline-flex items-center bg-[#C0FF00] text-black my-1 px-5 rounded-md hover:bg-[#D8FF80] hover:text-[#1c1b1b] transition-all delay-100'}>login</Link>
            </header>
            <div className={'flex'}>
                <div className={'w-1/2'}>
                    <h1 className={'py-20 px-10 text-7xl'}>YOUR STACK.<br/>YOUR TRIBE.<br/><span className={'text-[#D8FF80]'}>YOUR FUTURE.</span></h1>
                    <p className={'w-3/4 text-[#adaaaa] px-10'}>In a world where every commute is spent scrolling and every coffee shop table hosts three people who've never looked up from their screens, connection has become a rare compile. <b className={'text-[#FFFCF2]'}>This is where you find your tribe</b> — not through awkward small talk, but through the shared language of late-night commits, stubborn bugs, and the quiet thrill of a clean merge.<br/><br/>Whether you're hunting for collaborators on that product idea that won't let you sleep, or just looking for someone who gets why you named your cat after a deprecated library, this is the space where digital natives build real relationships. No avatars, no gimmicks. Just programmers, finding each other in the noise.</p>
                    <p></p>
                </div>
                <section className={'mt-35 ml-50'}>
                    <RegistrationForm/>
                </section>

            </div>
        </div>
    )
}

export default Landing;