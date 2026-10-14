
import React, { useEffect, useState } from "react";

const sponsoredProfiles = [
  {
    id: "linkedin",
    name: "Abhishek Kumar",
    platform: "LinkedIn",
    username: "abhishekkumar005",
    message:
      "Let's connect professionally, share ideas, and explore opportunities in technology, development, and leadership.",
    link: "https://www.linkedin.com/in/abhishekkumar005",
    buttonText: "Connect on LinkedIn",
    accent: "#0A66C2",
    light: "#EAF4FF",
  },
  {
    id: "github",
    name: "Abhishek Kumar",
    platform: "GitHub",
    username: "Abhishek20-prog",
    message:
      "Explore my coding journey, development projects, experiments, and the work I'm building.",
    link: "https://github.com/Abhishek20-prog",
    buttonText: "Explore my projects",
    accent: "#24292F",
    light: "#F0F2F4",
  },
  {
    id: "instagram",
    name: "Vortex Electrified",
    platform: "Instagram",
    username: "@vortex.electrified",
    message:
      "Follow my page for updates, creative content, and more from my journey.",
    link: "https://www.instagram.com/vortex.electrified/",
    buttonText: "Follow on Instagram",
    accent: "#C13584",
    light: "#FCEAF3",
  },
];

const PlatformIcon = ({ platform, size = 30 }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };

  if (platform === "GitHub") {
    return (
      <svg {...props}>
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.13c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }

  if (platform === "Instagram") {
    return (
      <svg {...props}>
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
};

const Sponsored = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSponsored = sponsoredProfiles[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (index) => (index + 1) % sponsoredProfiles.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="rounded-[28px] border border-[#E8E2D8] bg-white/70 p-5 shadow-sm transition-all duration-300 hover:border-[#B8D5CE] hover:shadow-lg"
      aria-label="Professional social profiles"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#17383A]">
            Connect with me
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">
            Find me across the web
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F2EC] text-[#285557] transition-all duration-300 hover:rotate-12 hover:scale-110">
          <span className="text-lg font-bold" aria-hidden="true">
            ✦
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-[#C9D2D0] bg-[#F8FCFB] transition-all duration-300 hover:border-[#A6C8BF]">
        <div key={currentSponsored.id} className="animate-slideIn">
          <div
            className="relative overflow-hidden px-4 pb-5 pt-5"
            style={{
              background: `linear-gradient(135deg, ${currentSponsored.light} 0%, #F8FCFB 100%)`,
            }}
          >
            <div
              className="absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-40 transition-transform duration-500 hover:scale-125"
              style={{
                backgroundColor: `${currentSponsored.accent}25`,
              }}
            />

            <div className="relative flex items-center justify-between gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-md"
                style={{ color: currentSponsored.accent }}
                aria-label={`${currentSponsored.platform} icon`}
              >
                <PlatformIcon
                  platform={currentSponsored.platform}
                  size={30}
                />
              </div>

              <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[10px] font-medium text-[#17383A]">
                Featured profile
              </span>
            </div>

            <div className="relative mt-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: currentSponsored.accent }}
              >
                {currentSponsored.platform}
              </p>

              <h3 className="mt-1 text-lg font-bold text-[#17383A]">
                {currentSponsored.name}
              </h3>

              <p className="mt-1 break-words text-xs text-gray-500">
                {currentSponsored.username}
              </p>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs leading-relaxed text-gray-600">
              {currentSponsored.message}
            </p>

            <a
              href={currentSponsored.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#17383A] px-4 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#285557] hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
            >
              {currentSponsored.buttonText}

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {currentIndex + 1} of {sponsoredProfiles.length} profiles
        </p>

        <div className="flex items-center justify-center gap-1.5">
          {sponsoredProfiles.map((profile, index) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show ${profile.platform} profile`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-5 bg-[#17383A]"
                  : "w-1.5 bg-gray-300 hover:bg-[#77A99D]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsored;
