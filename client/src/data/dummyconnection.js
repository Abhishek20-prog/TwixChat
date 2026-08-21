const dummyConnections = [
  // =========================
  // FOLLOWERS
  // =========================

  {
    id: "conn_001",
    type: "follower",
    user: {
      id: "user_101",
      name: "Rahul Sharma",
      username: "@rahul_sharma",
      dp: "https://i.pravatar.cc/150?img=12",
    },
    mutualConnections: 8,
    followedAt: "2026-08-18T10:30:00",
  },

  {
    id: "conn_002",
    type: "follower",
    user: {
      id: "user_102",
      name: "Priya Singh",
      username: "@priya_singh",
      dp: "https://i.pravatar.cc/150?img=32",
    },
    mutualConnections: 12,
    followedAt: "2026-08-17T14:20:00",
  },

  {
    id: "conn_003",
    type: "follower",
    user: {
      id: "user_103",
      name: "Aman Verma",
      username: "@aman_verma",
      dp: "https://i.pravatar.cc/150?img=11",
    },
    mutualConnections: 5,
    followedAt: "2026-08-16T09:15:00",
  },


  // =========================
  // FOLLOWING
  // =========================

  {
    id: "conn_004",
    type: "following",
    user: {
      id: "user_104",
      name: "Sneha Kapoor",
      username: "@sneha_kapoor",
      dp: "https://i.pravatar.cc/150?img=47",
    },
    mutualConnections: 15,
    followedAt: "2026-08-15T18:40:00",
  },

  {
    id: "conn_005",
    type: "following",
    user: {
      id: "user_105",
      name: "Arjun Mehta",
      username: "@arjun_mehta",
      dp: "https://i.pravatar.cc/150?img=13",
    },
    mutualConnections: 7,
    followedAt: "2026-08-14T11:25:00",
  },

  {
    id: "conn_006",
    type: "following",
    user: {
      id: "user_106",
      name: "Kavya Gupta",
      username: "@kavya_gupta",
      dp: "https://i.pravatar.cc/150?img=44",
    },
    mutualConnections: 21,
    followedAt: "2026-08-13T16:10:00",
  },


  // =========================
  // PENDING
  // =========================

  {
    id: "conn_007",
    type: "pending",
    user: {
      id: "user_107",
      name: "Rohan Malhotra",
      username: "@rohan_m",
      dp: "https://i.pravatar.cc/150?img=68",
    },
    mutualConnections: 4,
    requestedAt: "2026-08-20T12:30:00",
  },

  {
    id: "conn_008",
    type: "pending",
    user: {
      id: "user_108",
      name: "Ananya Roy",
      username: "@ananya_roy",
      dp: "https://i.pravatar.cc/150?img=49",
    },
    mutualConnections: 9,
    requestedAt: "2026-08-19T15:45:00",
  },

  {
    id: "conn_009",
    type: "pending",
    user: {
      id: "user_109",
      name: "Vikram Joshi",
      username: "@vikram_j",
      dp: "https://i.pravatar.cc/150?img=69",
    },
    mutualConnections: 3,
    requestedAt: "2026-08-18T20:10:00",
  },


  // =========================
  // CONNECTED
  // =========================

  {
    id: "conn_010",
    type: "connected",
    user: {
      id: "user_110",
      name: "Aditya Raj",
      username: "@aditya_raj",
      dp: "https://i.pravatar.cc/150?img=14",
    },
    mutualConnections: 18,
    connectedAt: "2026-08-12T13:20:00",
  },

  {
    id: "conn_011",
    type: "connected",
    user: {
      id: "user_111",
      name: "Meera Sharma",
      username: "@meera_sharma",
      dp: "https://i.pravatar.cc/150?img=45",
    },
    mutualConnections: 11,
    connectedAt: "2026-08-10T17:35:00",
  },

  {
    id: "conn_012",
    type: "connected",
    user: {
      id: "user_112",
      name: "Karan Singh",
      username: "@karan_singh",
      dp: "https://i.pravatar.cc/150?img=15",
    },
    mutualConnections: 6,
    connectedAt: "2026-08-08T10:15:00",
  },

  {
    id: "conn_013",
    type: "connected",
    user: {
      id: "user_113",
      name: "Ishita Verma",
      username: "@ishita_verma",
      dp: "https://i.pravatar.cc/150?img=48",
    },
    mutualConnections: 14,
    connectedAt: "2026-08-05T19:50:00",
  },
];

export default dummyConnections;