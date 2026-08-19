const dummyPosts = [
  {
    id: 1,
    user: {
      name: "Abhishek Kumar",
      username: "@abhishek",
      dp: "https://i.pravatar.cc/150?img=11",
    },
    type: "text",
    content:
      "Just finished working on a new full-stack project 🚀. Learning and building something new every day!",
    createdAt: "2026-08-15T12:30:00.000Z",
    updatedAt: "2026-08-15T12:30:00.000Z",
    likes: 42,
    comments: 8,
  },

  {
    id: 2,
    user: {
      name: "Riya Sharma",
      username: "@riya",
      dp: "https://i.pravatar.cc/150?img=47",
    },
    type: "photo",
    content: "Weekend project progress is looking amazing! 💻✨",
    media:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    createdAt: "2026-08-15T10:30:00.000Z",
    updatedAt: "2026-08-15T10:30:00.000Z",
    likes: 86,
    comments: 14,
  },

  {
    id: 3,
    user: {
      name: "Rohan Kumar",
      username: "@rohan",
      dp: "https://i.pravatar.cc/150?img=12",
    },
    type: "video",
    content: "Quick demo of what I've been building this week 🎥",

    // Direct MP4 video
    media:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

    // Thumbnail displayed before video starts
    thumbnail:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1200&q=80",

    createdAt: "2026-08-15T08:30:00.000Z",
    updatedAt: "2026-08-15T08:30:00.000Z",
    likes: 63,
    comments: 11,
  },

  {
    id: 4,
    user: {
      name: "Ananya Singh",
      username: "@ananya",
      dp: "https://i.pravatar.cc/150?img=32",
    },
    type: "photo",
    content: "A productive day at college 📚☕",
    media:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    createdAt: "2026-08-14T14:30:00.000Z",
    updatedAt: "2026-08-14T14:30:00.000Z",
    likes: 109,
    comments: 21,
  },

  {
    id: 5,
    user: {
      name: "Vikram Patel",
      username: "@vikram",
      dp: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    type: "text",
    content:
      "Small steps every day eventually turn into big results. Keep building! 🔥",
    createdAt: "2026-08-14T12:30:00.000Z",
    updatedAt: "2026-08-14T12:30:00.000Z",
    likes: 57,
    comments: 6,
  },
];

export default dummyPosts;