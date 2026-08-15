const dummyPosts = [
  {
    id: 1,
    user: {
      name: "Abhishek Kumar",
      username: "@abhishek",
      dp: "/assets/dp_abhishek.jpg",
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
      dp: "/assets/dp_riya.jpg",
    },
    type: "photo",
    content: "Weekend project progress is looking amazing! 💻✨",
    image: "/assets/post_photo_1.jpg",
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
      dp: "/assets/dp_rohan.jpg",
    },
    type: "video",
    content: "Quick demo of what I've been building this week 🎥",
    video: "/assets/post_video_1.mp4",
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
      dp: "/assets/dp_ananya.jpg",
    },
    type: "photo",
    content: "A productive day at college 📚☕",
    image: "/assets/post_photo_2.jpg",
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
      dp: "/assets/dp_vikram.jpg",
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