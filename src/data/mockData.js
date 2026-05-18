export const mockParents = [
  {
    id: "parent-1",
    name: "Mrs. Wanjiku Kamau",
    email: "wanjiku@somobloom.com",
    phone: "+254 712 345 678",
    avatar: "WK",
    childIds: ["child-1", "child-2"]
  },
  {
    id: "parent-2",
    name: "Mr. James Odhiambo",
    email: "james@somobloom.com",
    phone: "+254 722 987 654",
    avatar: "JO",
    childIds: ["child-1"]
  }
];

export const mockData = {
  children: [
    {
      id: "child-1",
      name: "Amani",
      grade: "Grade 4",
      schoolwork: [
        { id: "sw-1", title: "Science Project: Plants", type: "pdf", date: "2026-05-10", skill: "Beginning", feedback: "Great start! Let's explore more about roots." },
        { id: "sw-2", title: "Math Quiz", type: "image", date: "2026-05-08", skill: "Proficient", feedback: "Excellent grasp of fractions." },
      ],
      progress: {
        Math: "Proficient",
        Science: "Beginning",
        English: "Developing",
        Art: "Exemplary"
      },
      fees: {
        totalBalance: 15000,
        currency: "KES",
        history: [
          { id: "tx-1", date: "2026-01-10", amount: 10000, ref: "MPESA-XYZ", status: "Successful" }
        ]
      }
    },
    {
      id: "child-2",
      name: "Baraka",
      grade: "Grade 1",
      schoolwork: [
        { id: "sw-3", title: "Finger Painting", type: "image", date: "2026-05-09", skill: "Exemplary", feedback: "Very creative use of colors!" }
      ],
      progress: {
        Math: "Developing",
        Science: "Developing",
        Language: "Proficient"
      },
      fees: {
        totalBalance: 5000,
        currency: "KES",
        history: []
      }
    }
  ],
  messages: [
    { id: "msg-1", sender: "Mrs. Njoroge (Math)", text: "Amani is doing well but needs to practice multiplication tables.", date: "2026-05-11", read: false },
    { id: "msg-2", sender: "School Admin", text: "Reminder: Mid-term break begins next week Friday.", date: "2026-05-05", read: true }
  ],
  announcements: [
    { id: "ann-1", title: "Parent-Teacher Meeting", date: "2026-05-20", details: "Please book a slot through the portal." }
  ]
};

export const translations = {
  en: {
    dashboard: "Dashboard",
    payFees: "Pay Fees",
    progress: "View Progress",
    messages: "Messages",
    switchChild: "Switch Child",
    currentBalance: "Current Balance",
    unreadMessages: "Unread Messages",
    recentUploads: "Recent Uploads",
    upcomingDeadlines: "Upcoming Deadlines",
    activityFeed: "Activity Feed",
    checkout: "Checkout",
    paymentHistory: "Payment History",
    subjectProgress: "Subject Progress",
    schoolwork: "Schoolwork Gallery",
    inbox: "Inbox",
    announcements: "Announcements",
    noPaymentHistory: "No payment history yet.",
    payNow: "Pay Now",
    loading: "Loading...",
    success: "Success!",
    error: "Error processing payment."
  },
  sw: {
    dashboard: "Dashibodi",
    payFees: "Lipa Karo",
    progress: "Tazama Maendeleo",
    messages: "Ujumbe",
    switchChild: "Badilisha Mtoto",
    currentBalance: "Salio la Sasa",
    unreadMessages: "Ujumbe Mpya",
    recentUploads: "Zilizopakiwa Hivi Karibuni",
    upcomingDeadlines: "Makataa Yajayo",
    activityFeed: "Matukio ya Hivi Karibuni",
    checkout: "Lipa",
    paymentHistory: "Historia ya Malipo",
    subjectProgress: "Maendeleo ya Masomo",
    schoolwork: "Kazi za Shule",
    inbox: "Kikasha",
    announcements: "Matangazo",
    noPaymentHistory: "Hakuna historia ya malipo bado.",
    payNow: "Lipa Sasa",
    loading: "Inapakia...",
    success: "Imefaulu!",
    error: "Hitilafu katika malipo."
  }
};
