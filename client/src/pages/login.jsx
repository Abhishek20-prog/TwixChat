import img from "../assets/bg.png";
import logo from "../assets/twixchat-removebg-preview.png"
const Login = () => {
    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat
                 flex flex-col px-6 py-6 md:px-12 lg:px-20"
            style={{ backgroundImage: `url(${img})` }}
        >
            {/* Logo */}
           
                {/* Add your logo here */}
                <div className="mb-5 md:mb-0">
                    <img
                        src={logo}
                        alt="TwixChat"
                        className="h-13 w-auto object-contain pl-3"
                    />
                </div>
            

            {/* Main Content */}
            <div
                className="flex flex-1 flex-col md:flex-row
                   items-center justify-center
                   gap-12 lg:gap-24"
            >

                {/* LEFT — Welcome Section */}
                <section className="w-full max-w-xl">

                    {/* Social Proof */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white" />
                            <div className="h-8 w-8 rounded-full bg-gray-400 border-2 border-white" />
                            <div className="h-8 w-8 rounded-full bg-gray-500 border-2 border-white" />
                        </div>

                        <div>
                            <div className="text-sm tracking-wide">
                                ⭐⭐⭐⭐⭐
                            </div>

                            <p className="text-xs text-gray-600">
                                Loved by people who love to connect
                            </p>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                        <span className="text-[#29243D]">
                            More than just friends.
                        </span>
                        <br />
                        <span className="text-[#D97745]">
                            Truly connect.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-[#625C70]">
                        Connect with your people, share your moments,
                        and build meaningful connections on{" "}
                        <span className="font-semibold text-[#D97745]">
                            TwixChat
                        </span>
                        .
                    </p>

                </section>

                {/* RIGHT — Login Card */}
                <section className="w-full max-w-md">

                    <div
                        className="rounded-2xl border border-white/60
                       bg-white/85 p-8 shadow-xl
                       backdrop-blur-md"
                    >

                        {/* Card Heading */}
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Sign in to continue to TwixChat
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-lg border border-gray-200
                             bg-white px-4 py-3 text-sm
                             outline-none transition
                             focus:border-gray-400
                             focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-gray-200
                             bg-white px-4 py-3 text-sm
                             outline-none transition
                             focus:border-gray-400
                             focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-black py-3
                           text-sm font-medium text-white
                           transition hover:bg-gray-800"
                            >
                                Continue →
                            </button>

                        </form>

                        {/* Signup */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <button className="font-medium text-black hover:underline">
                                Sign up
                            </button>
                        </p>

                    </div>

                </section>

            </div>
        </div>
    );
};

export default Login;