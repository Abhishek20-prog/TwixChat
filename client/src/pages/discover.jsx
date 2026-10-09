
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  UserCheck,
  Users,
  X,
  MapPin,
  BriefcaseBusiness,
  Sparkles,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDiscoverUsers,
  followUser,
  unfollowUser,
} from "../features/connections/connectionslice";

const Discover = () => {
  const [search, setSearch] = useState("");
  const [followingId, setFollowingId] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const users = useSelector(
    (state) => state.connection.discoverUsers || [],
  );

  useEffect(() => {
    const loadDiscoverUsers = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        await dispatch(
          fetchDiscoverUsers({
            token,
            input: "",
          }),
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch discover users:", error);
      }
    };

    loadDiscoverUsers();
  }, [dispatch, getToken]);

  useEffect(() => {
    if (!users.length) {
      setRandomUsers([]);
      return;
    }

    const shuffledUsers = [...users].sort(
      () => Math.random() - 0.5,
    );

    setRandomUsers(shuffledUsers.slice(0, 6));
  }, [users]);

  const usersToDisplay = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query) {
      return users.filter((user) => {
        const searchableValues = [
          user.name,
          user.full_name,
          user.username,
          user.bio,
          user.location,
          user.email,
          user.work,
          user.workplace,
          user.role,
          ...(Array.isArray(user.hobbies) ? user.hobbies : []),
        ];

        return searchableValues
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query),
          );
      });
    }

    return randomUsers;
  }, [users, randomUsers, search]);

  const handleFollow = async (e, userId, isFollowing) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId || followingId === userId) return;

    try {
      setFollowingId(userId);

      const token = await getToken();

      if (!token) return;

      if (isFollowing) {
        await dispatch(
          unfollowUser({
            token,
            id: userId,
          }),
        ).unwrap();
      } else {
        await dispatch(
          followUser({
            token,
            id: userId,
          }),
        ).unwrap();
      }

      await dispatch(
        fetchDiscoverUsers({
          token,
          input: "",
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update follow status:", error);
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5F3] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <header className="mb-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17383A] text-white shadow-sm">
              <Compass size={19} />
            </span>

            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#648581]">
              TwixChat / Explore
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#17383A] sm:text-4xl">
                Discover<span className="text-[#F29B62]">.</span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#718A88] sm:text-base">
                Find interesting people, share your interests, and
                build your community.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5F3] text-[#285557]">
                <Users size={20} />
              </div>

              <div>
                <p className="text-xl font-bold leading-tight text-[#17383A]">
                  {users.length}
                </p>
                <p className="mt-1 text-[11px] text-[#7B9291]">
                  People to explore
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <div className="mb-8 rounded-2xl border border-[#D8E7E2] bg-white p-2 shadow-[0_4px_18px_rgba(23,56,58,0.045)] transition-all duration-200 focus-within:border-[#80AAA2] focus-within:shadow-[0_0_0_3px_rgba(128,170,162,0.13)]">
          <div className="flex min-h-11 items-center gap-3 px-3">
            <Search
              size={20}
              className="shrink-0 text-[#8CA4A2]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people, hobbies, work, bio..."
              aria-label="Search people"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#17383A] outline-none placeholder:text-[#9AABAA] sm:text-[15px]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#829694] transition hover:bg-[#E8F5F3] hover:text-[#17383A]"
              >
                <X size={17} />
              </button>
            )}

            <span className="hidden rounded-lg bg-[#F2F7F5] px-2.5 py-1.5 text-[10px] font-medium text-[#7D9691] sm:block">
              EXPLORE
            </span>
          </div>
        </div>

        {/* Section heading */}
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#17383A] sm:text-xl">
                {search.trim()
                  ? "Search results"
                  : "People you may know"}
              </h2>

              {!search.trim() && (
                <Sparkles
                  size={17}
                  className="text-[#E89A62]"
                />
              )}
            </div>

            <p className="mt-1 text-xs text-[#819694] sm:text-sm">
              {search.trim()
                ? `${usersToDisplay.length} ${usersToDisplay.length === 1 ? "person" : "people"} found`
                : "Discover new people and grow your circle"}
            </p>
          </div>

          {search.trim() && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="shrink-0 text-xs font-semibold text-[#527B75] transition hover:text-[#17383A]"
            >
              Clear search
            </button>
          )}
        </div>

        {/* User cards */}
        {usersToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {usersToDisplay.map((user) => {
              const userId = user.id || user._id;
              const followingUser = user.isFollowing === true;
              const isUpdating = followingId === userId;
              const displayName =
                user.name || user.full_name || "User";
              const avatar = user.dp || user.profile_picture;

              return (
                <Link
                  key={userId}
                  to={`/profile/${userId}`}
                  className="group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#DCE9E4] bg-white p-5 shadow-[0_3px_14px_rgba(23,56,58,0.035)] transition-all duration-200 hover:-translate-y-1 hover:border-[#A9CBC0] hover:shadow-[0_12px_28px_rgba(23,56,58,0.085)] sm:p-5"
                >
                  {/* Decorative top accent */}
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#17383A] via-[#6EA49A] to-[#F29B62] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  {/* Profile details */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="rounded-full border border-[#DCECE6] p-[3px] transition-colors duration-200 group-hover:border-[#F3C09B]">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={displayName}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5F3] text-lg font-bold text-[#285557]">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F8C49E] text-[#754B2E]">
                        <Sparkles size={10} />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-bold text-[#17383A] transition-colors group-hover:text-[#42766D]">
                        {displayName}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#91A4A1]">
                        @{user.username || "user"}
                      </p>

                      {user.location && (
                        <p className="mt-2 flex items-center gap-1 truncate text-[11px] text-[#809693]">
                          <MapPin
                            size={12}
                            className="shrink-0"
                          />
                          {user.location}
                        </p>
                      )}
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F2F7F5] text-[#8AA29D] transition-all group-hover:bg-[#E8F5F3] group-hover:text-[#285557]">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>

                  {/* Bio */}
                  <div className="mt-5 min-h-[48px]">
                    <p className="line-clamp-2 text-sm leading-6 text-[#617775]">
                      {user.bio || "Just chilling on TwixChat ✨"}
                    </p>
                  </div>

                  {/* Hobbies */}
                  {Array.isArray(user.hobbies) &&
                    user.hobbies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {user.hobbies.slice(0, 3).map((hobby) => (
                          <span
                            key={hobby}
                            className="max-w-full truncate rounded-full border border-[#DCEBE5] bg-[#F0F8F5] px-2.5 py-1 text-[10px] font-semibold text-[#527871]"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Work information */}
                  {(user.role || user.workplace || user.work) && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F6F9F7] p-3">
                      <BriefcaseBusiness
                        size={15}
                        className="mt-0.5 shrink-0 text-[#7C9B94]"
                      />

                      <div className="min-w-0">
                        {user.role && (
                          <p className="truncate text-[11px] text-[#849995]">
                            {user.role}
                          </p>
                        )}

                        {(user.workplace || user.work) && (
                          <p className="truncate text-xs font-semibold text-[#365957]">
                            {user.workplace || user.work}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Follow button */}
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={(e) =>
                        handleFollow(e, userId, followingUser)
                      }
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                        followingUser
                          ? "border border-[#D5E5DF] bg-[#F2F7F5] text-[#365F59] hover:border-[#E7BBA0] hover:bg-[#FFF3EA] hover:text-[#925B3A]"
                          : "bg-[#17383A] text-white shadow-sm hover:bg-[#285557] hover:shadow-md"
                      }`}
                    >
                      {isUpdating ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Please wait...
                        </>
                      ) : followingUser ? (
                        <>
                          <UserCheck size={17} />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus size={17} />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-[26px] border border-[#DCE9E4] bg-white/80 px-5 py-14 text-center shadow-[0_4px_18px_rgba(23,56,58,0.035)] sm:py-16">
            <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-[25px] bg-[#E8F5F3] text-[#285557]">
              <Search size={30} strokeWidth={1.7} />

              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white bg-[#F7C59E] text-[#754B2E]">
                <X size={13} />
              </span>
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#17383A]">
              {search.trim()
                ? "No people found"
                : "No suggestions yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#819391]">
              {search.trim()
                ? "We couldn't find anyone matching your search. Try another name, hobby, bio, or workplace."
                : "There are no people to display right now. Check back soon to discover new connections."}
            </p>

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17383A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285557] active:scale-[0.98]"
              >
                <X size={14} />
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        {usersToDisplay.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 pb-4 text-[11px] text-[#91A6A2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F29B62]" />
            Good connections start with a hello.
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;

