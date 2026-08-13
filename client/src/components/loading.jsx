import logo from "../assets/twixchat-removebg-preview.png";
import bg from "../assets/bg.png";

const Loading = () => {
  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
        flex
        flex-col
        items-center
        justify-center
        px-6
      "
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo */}
        <img
          src={logo}
          alt="TwixChat"
          className="
            w-40
            sm:w-48
            h-auto
            object-contain
            drop-shadow-lg
          "
        />

        {/* Loading dots */}
        <div className="mt-9 flex items-center gap-2.5">

          {/* Yellow */}
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[#FFC54F]
              animate-bounce
            "
            style={{ animationDelay: "0ms" }}
          />

          {/* Teal */}
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[#65B1AC]
              animate-bounce
            "
            style={{ animationDelay: "150ms" }}
          />

          {/* Coral */}
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[#FB8569]
              animate-bounce
            "
            style={{ animationDelay: "300ms" }}
          />

        </div>

        {/* Loading text */}
        <p className="mt-5 text-sm font-medium text-[#625D68]">
          Connecting you to your circle...
        </p>

      </div>
    </main>
  );
};

export default Loading;