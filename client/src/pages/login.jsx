import img from "../assets/bg.png";
import mobileImg from "../assets/bg-mobile.png";
import logo from "../assets/twixchat-removebg-preview.png";
import { SignIn } from "@clerk/react";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Desktop Background */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* Mobile Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileImg})` }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-12 lg:px-20">

        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="TwixChat"
            className="h-[52px] w-auto"
          />
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col items-center justify-center gap-12 md:flex-row lg:gap-24">

          {/* Welcome */}
          <section className="w-full max-w-xl text-center md:text-left">

            <div className="mb-5 flex items-center justify-center gap-3 md:justify-start">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300" />
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-400" />
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-500" />
              </div>

              <div className="text-left">
                <div>⭐⭐⭐⭐⭐</div>
                <p className="text-xs text-gray-600">
                  Loved by people who love to connect
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[4.2rem]">
              <span className="text-[#24202E]">
                Find your people.
              </span>

              <br />

              <span className="text-[#C68A24]">
                Build your circle.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#625D68] md:mx-0">
              Connect, share, and make every moment worth sharing.{" "}
              <span className="font-semibold text-[#C68A24]">
                TwixChat.
              </span>
            </p>

          </section>

          {/* Clerk Sign In */}
          <section className="w-full max-w-md">

            <SignIn
              
            />

          </section>

        </div>
      </div>
    </div>
  );
};

export default Login;