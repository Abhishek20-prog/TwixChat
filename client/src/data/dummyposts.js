import dummyUsers from "./dummyUsers";

const postTexts = [
  "Just enjoying the little things in life ✨",
  "Some moments are better when you don't plan them.",
  "Trying something new today 🚀",
  "A peaceful day with good vibes.",
  "This moment deserved a post ❤️",
  "Learning, exploring and growing.",
  "Weekend mood activated 😎",
  "Sometimes you just need a change of scenery.",
  "Good people, good conversations, good memories.",
  "Another day, another story.",
];

const locations = [
  "Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Pune, India",
  "Kolkata, India",
  "Hyderabad, India",
  "Jaipur, India",
  "Chandigarh, India",
  "Goa, India",
  "Lucknow, India",
];

const imageUrls = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
];

const videoUrls = [
  "https://cdn.coverr.co/videos/coverr-a-woman-walking-on-the-beach-1573/1080p.mp4",
  "https://cdn.coverr.co/videos/coverr-coding-on-a-laptop-1572/1080p.mp4",
];

const dummyPosts = [];

dummyUsers.forEach((user, userIndex) => {

  // Create 5 posts for every user
  for (let i = 0; i < 5; i++) {

    const postNumber = i + 1;

    // Decide post type
    let type;

    if (postNumber === 1) {
      type = "image";
    } else if (postNumber === 2) {
      type = "text";
    } else if (postNumber === 3) {
      type = "video";
    } else if (postNumber === 4) {
      type = "image";
    } else {
      type = "text";
    }

    const content =
      postTexts[(userIndex + i) % postTexts.length];

    dummyPosts.push({

      // Unique post ID
      id: `post-${user.id}-${postNumber}`,

      // User who created the post
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        dp: user.dp,
      },

      // image / video / text
      type,

      // Media
      media:
        type === "image"
          ? `${imageUrls[(userIndex + i) % imageUrls.length]}?auto=format&fit=crop&w=1000&q=80`
          : type === "video"
          ? videoUrls[userIndex % videoUrls.length]
          : null,

      // Caption / text
      content,

      // Location
      location:
        locations[(userIndex + i) % locations.length],

      // Engagement
      likes: Math.floor(Math.random() * 1500) + 20,

      comments: Math.floor(Math.random() * 200) + 1,

      shares: Math.floor(Math.random() * 100),

      // Only useful for videos
      views:
        type === "video"
          ? Math.floor(Math.random() * 10000) + 100
          : 0,

      // Created time
      createdAt: new Date(
        Date.now() -
          (userIndex * 2 + i + 1) *
            60 *
            60 *
            1000
      ).toISOString(),

      // Saved by current user
      saved: false,
    });
  }
});

export default dummyPosts;