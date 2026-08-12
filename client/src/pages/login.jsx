import img from "../assets/bg.png";
import mobileImg from "../assets/bg-mobile.png";
import logo from "../assets/twixchat-removebg-preview.png";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ================= DESKTOP BACKGROUND ================= */}
      <div
        className="
          absolute
          inset-0
          hidden
          bg-cover
          bg-center
          bg-no-repeat
          md:block
        "
        style={{
          backgroundImage: `url(${img})`,
        }}
      />

      {/* ================= MOBILE BACKGROUND ================= */}
      <div
        className="
          absolute
          inset-0
          block
          bg-cover
          bg-center
          bg-no-repeat
          md:hidden
        "
        style={{
          backgroundImage: `url(${mobileImg})`,
        }}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          flex-col
          px-6
          py-6
          sm:px-8
          md:px-12
          lg:px-20
        "
      >

        {/* ================= LOGO ================= */}
        <div className="mb-5 md:mb-0">
          <img
            src={logo}
            alt="TwixChat"
            className="h-[52px] w-auto object-contain"
          />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div
          className="
            flex
            flex-1
            w-full
            max-w-7xl
            mx-auto
            flex-col
            items-center
            justify-center
            gap-12
            md:flex-row
            lg:gap-24
          "
        >

          {/* ================= LEFT — WELCOME ================= */}
          <section
            className="
              w-full
              max-w-xl
              text-center
              md:text-left
            "
          >

            {/* Social Proof */}
            <div
              className="
                mb-5
                flex
                items-center
                justify-center
                gap-3
                md:justify-start
              "
            >

              {/* Avatars */}
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300" />

                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-400" />

                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-500" />
              </div>

              {/* Rating */}
              <div className="text-left">
                <div className="text-sm tracking-wide">
                  ⭐⭐⭐⭐⭐
                </div>

                <p className="text-xs text-gray-600">
                  Loved by people who love to connect
                </p>
              </div>

            </div>

            {/* Heading */}
            <h1
              className="
                text-4xl
                font-bold
                leading-[1.02]
                tracking-[-0.035em]
                sm:text-5xl
                lg:text-[4.2rem]
              "
            >
              <span className="text-[#24202E]">
                Find your people.
              </span>

              <br />

              <span className="text-[#C68A24]">
                Build your circle.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-lg
                text-base
                leading-relaxed
                text-[#625D68]
                sm:text-lg
                md:mx-0
              "
            >
              Connect, share, and make every moment worth sharing.{" "}

              <span className="font-semibold text-[#C68A24]">
                TwixChat.
              </span>
            </p>

          </section>

          {/* ================= RIGHT — LOGIN ================= */}
          <section className="w-full max-w-md">

            <div
              className="
                rounded-3xl
                border
                border-white/70
                bg-white/90
                p-8
                shadow-[0_20px_60px_rgba(36,32,46,0.12)]
                backdrop-blur-xl
                sm:p-9
              "
            >

              {/* Card Heading */}
              <div className="mb-8 text-center">

                <h2 className="text-2xl font-bold text-[#24202E]">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-[#625D68]">
                  Sign in to continue to TwixChat
                </p>

              </div>

              {/* Form */}
              <form className="space-y-5">

                {/* Email */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-[#24202E]
                    "
                  >
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-[#24202E]
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-gray-400
                      focus:border-[#C68A24]
                      focus:ring-2
                      focus:ring-[#C68A24]/20
                    "
                  />

                </div>

                {/* Password */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-[#24202E]
                    "
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-[#24202E]
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-gray-400
                      focus:border-[#C68A24]
                      focus:ring-2
                      focus:ring-[#C68A24]/20
                    "
                  />

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="
                    w-full
                    rounded-xl
                    bg-[#24202E]
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#332D42]
                    hover:shadow-md
                    active:translate-y-0
                  "
                >
                  Continue →
                </button>

              </form>

              {/* Signup */}
              <p
                className="
                  mt-6
                  text-center
                  text-sm
                  text-[#625D68]
                "
              >
                Don't have an account?{" "}

                <button
                  type="button"
                  className="
                    font-semibold
                    text-[#24202E]
                    transition-colors
                    hover:text-[#C68A24]
                    hover:underline
                  "
                >
                  Sign up
                </button>
              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
};

export default Login;