export const KAHOOT_LINK = "PASTE_KAHOOT_LINK_HERE";

export const createImagePlaceholder = (caption = "Image Placeholder") => ({
  id: crypto.randomUUID(),
  src: "",
  caption,
  role: "gallery",
  size: "normal",
  fit: "cover",
  position: "center",
  isPlaceholder: true
});

export const createSection = (title = "Custom Section") => ({
  id: crypto.randomUUID(),
  title,
  layout: "auto",
  text: "",
  bullets: [],
  images: [],
  blocks: [],
  visible: true,
  fullSlide: true
});

export const createContentBlock = (type = "text") => ({
  id: crypto.randomUUID(),
  type,
  title: type === "image" ? "Image Object" : type === "bullets" ? "Bullet Object" : "Text Object",
  text: type === "image" ? "" : "Editable content",
  bullets: type === "bullets" ? ["Editable bullet"] : [],
  image: type === "image" ? createImagePlaceholder("Image Object") : null,
  metricValue: type === "metric" ? "01" : "",
  caption: "",
  size: type === "image" ? "wide" : "normal",
  textSize: "md",
  visible: true
});

export const createSlide = () => ({
  id: crypto.randomUUID(),
  type: "content",
  title: "New Slide",
  subtitle: "Editable subtitle",
  theme: "indigo",
  sections: [createSection("Overview")]
});

export const presentationData = {
  eventTitle: "All Hands Meet",
  groupName: "Advance Research and Standards Group",
  date: "Tuesday, 23rd",
  kahootLink: KAHOOT_LINK,
  slides: [
    {
      id: "intro",
      type: "intro",
      title: "All Hands Meet",
      subtitle: "Advance Research and Standards Group",
      date: "Tuesday, 23rd",
      backgroundStyle: "premium-gradient",
      heroImage: "/assets/keynote-bg.png"
    },
    {
      id: "chinese-whisper",
      type: "activity",
      title: "Chinese Whisper",
      subtitle: "Communication Icebreaker",
      theme: "teal",
      sections: [
        {
          id: "cw-rules",
          title: "Rules",
          layout: "steps",
          visible: true,
          fullSlide: true,
          text: "The activity is meant to be fun and to show how communication can change as it passes through multiple people.",
          bullets: [
            "Participants in each row will be given a sentence.",
            "The sentence will be whispered from one person to the next across the row.",
            "The person at the other end of the row will say the sentence aloud.",
            "The first person will then read the original sentence.",
            "The group will compare both versions.",
            "The activity is meant to be fun and to show how communication can change as it passes through multiple people."
          ],
          images: []
        }
      ]
    },
    {
      id: "communication-matters",
      type: "quote",
      title: "Why Communication Matters",
      subtitle: "",
      theme: "blue",
      body: "Clear communication is essential in a corporate environment because it improves alignment, reduces misunderstanding, and helps teams work more effectively toward shared goals.",
      sections: []
    },
    {
      id: "ax-quiz",
      type: "quiz",
      title: "AX Quiz",
      subtitle: "Quick Interactive Quiz",
      theme: "purple",
      question: "What do you understand by AX Transformation?",
      buttonText: "Start Quiz",
      link: KAHOOT_LINK,
      sections: []
    },
    {
      id: "leadership-address",
      type: "title",
      title: "Mohan Roa Goli",
      subtitle: "",
      theme: "navy",
      sections: []
    },
    {
      id: "advance-research-group",
      type: "group",
      groupName: "Advance Research Group",
      title: "Advance Research Group",
      theme: "indigo",
      sections: [
        {
          id: "arg-business-summary",
          title: "Advance Research Group",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "Emerging AI research focused on future user experiences, trustworthy media, spatial intelligence and faster model capabilities.",
          bullets: [
            "2026 mission: accelerate preceding research beyond current boundaries.",
            "Core themes: Quantum Inspired AI, Spatial Sense AI, Multimodal AI and LLM-led experiences.",
            "1H focus: Grade A patents, SBPA EA selections and AX initiatives.",
            "2H direction: dexterous hand research, expanded target tasks and compression-oriented model comparison."
          ],
          images: [
            { ...createImagePlaceholder("Quantum Inspired AI visual"), size: "wide" },
            createImagePlaceholder("Spatial Sense AI visual"),
            createImagePlaceholder("1H Achievements visual"),
            createImagePlaceholder("Fast Forward to 2H 2026 visual")
          ],
          blocks: []
        }
      ]
    },
    {
      id: "open-innovation",
      type: "group",
      groupName: "Open Innovation",
      title: "Open Innovation",
      theme: "teal",
      sections: [
        {
          id: "open-innovation-business-summary",
          title: "Open Innovation",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "Connecting startup ecosystems, Samsung R&D priorities and internal enablement programs into focused innovation pathways.",
          bullets: [
            "Startup incubation through Samsung Mobile Advance (SMA) 2026.",
            "Strategic partnership funnel: applications, submitted proposals and pitch day candidates.",
            "Galaxy Convention 2026 and ongoing discussions with Suwon R&D.",
            "Translation and interpretation support for smoother cross-team collaboration."
          ],
          images: [
            { ...createImagePlaceholder("Startup incubation funnel"), size: "wide" },
            createImagePlaceholder("Samsung Mobile Advance timeline"),
            createImagePlaceholder("Galaxy Convention 2026 table"),
            createImagePlaceholder("Suwon R&D discussion visual")
          ],
          blocks: []
        }
      ]
    },
    {
      id: "standards-research-group",
      type: "group",
      groupName: "Standards Research Group",
      title: "Standards Research Group",
      theme: "blue",
      sections: [
        {
          id: "srg-business-summary",
          title: "Standards Research Group",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "Driving global standards leadership across next-generation communication technologies, standards IPR and regional initiatives.",
          bullets: [
            "Mission: secure key global standards leadership positions.",
            "Technology leadership in 3GPP 6G and IEEE Wi-Fi areas.",
            "Strengthening the innovation portfolio through standards IPR and papers.",
            "1H highlights: global contributions, rapporteur-ship roles and Hall of Fame recognition."
          ],
          images: [
            { ...createImagePlaceholder("Global standards visual"), size: "wide" },
            createImagePlaceholder("1H Achievements visual"),
            createImagePlaceholder("Standards IPR visual"),
            createImagePlaceholder("Hall of Fame visual")
          ],
          blocks: []
        }
      ]
    },
    {
      id: "ip-group",
      type: "group",
      groupName: "IP Group",
      title: "IP Group",
      theme: "purple",
      sections: [
        {
          id: "ip-business-summary",
          title: "IP Group",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "ADD_IP_GROUP_TEXT_HERE",
          bullets: ["Overview", "Past Work", "Business Impact", "Hall of Fame", "Fast Forward to 2nd Half"],
          images: [
            { ...createImagePlaceholder("IP overview image placeholder"), size: "wide" },
            createImagePlaceholder("Patent / diagram placeholder"),
            createImagePlaceholder("Business impact visual placeholder")
          ],
          blocks: []
        }
      ]
    },
    {
      id: "people-group",
      type: "group",
      groupName: "People Group",
      title: "People Group",
      theme: "green",
      sections: [
        {
          id: "people-business-summary",
          title: "People Group",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "People updates focused on development conversations, team participation and everyday workplace flexibility.",
          bullets: [
            "Competency Assessment and Mid-Year Feedback 2026 enable meaningful development conversations.",
            "Feedback connects competency discussion, mid-year goal progress and IDPs.",
            "SRIB SSL2026: ARST and CST joined forces as Research Communication Blasters.",
            "Meal card access changes from Monday-Friday to Monday-Saturday with no time restriction."
          ],
          images: [
            { ...createImagePlaceholder("People Group overview image"), size: "wide" },
            createImagePlaceholder("Competency Assessment timeline image"),
            createImagePlaceholder("SRIB SSL2026 sports table image"),
            createImagePlaceholder("Meal Card Usage Window image")
          ],
          blocks: []
        }
      ]
    },
    {
      id: "snack-break",
      type: "break",
      title: "Snack Break",
      subtitle: "Take a short break and recharge",
      theme: "warm",
      sections: []
    },
    {
      id: "know-your-team-member",
      type: "activity",
      title: "Know Your Team Member",
      subtitle: "Interactive Team Bonding Activity",
      theme: "green",
      sections: [
        {
          id: "kytm-rules",
          title: "Rules",
          layout: "steps",
          visible: true,
          fullSlide: true,
          text: "The goal is to make the activity fun, interactive, and help team members know each other better.",
          bullets: [
            "Each group lead will pick a chit.",
            "The chit will contain the name of a team member.",
            "The selected person will then pick another chit.",
            "The participant must help others guess the person.",
            "The participant can use either: Dumb Show",
            "The participant can use either: Pictionary-style clues",
            "Each round will be 3 minutes.",
            "The goal is to make the activity fun, interactive, and help team members know each other better."
          ],
          images: []
        }
      ]
    },
    {
      id: "activity-timer",
      type: "timer",
      title: "Activity Timer",
      subtitle: "03:00 round",
      theme: "indigo",
      sections: []
    },
    {
      id: "why-collaboration-matters",
      type: "quote",
      title: "Why Collaboration Matters",
      subtitle: "",
      body: "Collaboration helps teams combine diverse strengths, build trust, solve complex problems faster, and create outcomes that are stronger than what any one person could achieve alone.",
      theme: "teal",
      sections: []
    },
    {
      id: "thank-you",
      type: "thanks",
      title: "Thank You",
      subtitle: "Thank you for attending",
      body: "All Hands Meet - Advance Research and Standards Group",
      theme: "navy",
      sections: []
    }
  ]
};
