export const KAHOOT_LINK = "PASTE_KAHOOT_LINK_HERE";

export const createImagePlaceholder = (caption = "Image Placeholder", subtitle = "Add image details in the edit portal") => ({
  id: crypto.randomUUID(),
  src: "",
  title: caption,
  subtitle,
  caption,
  role: "gallery",
  size: "normal",
  fit: "cover",
  position: "center",
  isPlaceholder: true
});

const createBusinessImages = (items) => items.map(([title, subtitle], index) => ({
  ...createImagePlaceholder(title, subtitle),
  size: index === 0 ? "wide" : "normal"
}));

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
          layout: "business-update",
          businessUpdateVersion: 2,
          visible: true,
          fullSlide: true,
          text: "Emerging AI research for future UX, spatial intelligence, trustworthy media and faster model capabilities.",
          bullets: [
            "Mission: accelerate preceding research beyond current boundaries.",
            "Core: Quantum Inspired AI, Spatial Sense AI, Multimodal AI and LLM-led experiences.",
            "1H: Grade A patents, SBPA EA selections and AX initiatives.",
            "2H: dexterous hand, expanded target tasks and compression-focused model comparison."
          ],
          images: createBusinessImages([
            ["Quantum Inspired AI", "Pipeline, current results and radar/result view"],
            ["Spatial Sense AI", "Complex scenes, Isaac Sim/Arena and Cobot SO-101-ARM"],
            ["Multimodal AI", "Future user experiences across image, speech and context"],
            ["2026 Mission", "Emerging technology research themes and objectives"],
            ["1H Achievements", "Patents, SBPA EA selections and AX initiatives"],
            ["2H 2026 Roadmap", "Dexterous hand, task expansion and model compression"]
          ]),
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
          layout: "business-update",
          businessUpdateVersion: 2,
          visible: true,
          fullSlide: true,
          text: "Connecting startup ecosystems, Samsung R&D priorities and internal enablement into focused innovation pathways.",
          bullets: [
            "SMA 2026: startup incubation from applications to pitch day candidates.",
            "Partnerships: submitted proposals, Galaxy Convention 2026 and Suwon R&D discussions.",
            "Programs: Samsung emovatex 2026 and top-12 visibility.",
            "Enablement: translation, interpretation and internal process updates."
          ],
          images: createBusinessImages([
            ["Startup Incubation Funnel", "Applications, proposals and pitch day candidates"],
            ["Samsung Mobile Advance 2026", "SMA timeline and proposal flow"],
            ["Galaxy Convention 2026", "Convention table and partner mapping"],
            ["Suwon R&D Discussions", "Ongoing collaboration opportunities"],
            ["Samsung emovatex 2026", "Top-12 startup visibility"],
            ["Team Enablement", "Translation, interpretation and process updates"]
          ]),
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
          layout: "business-update",
          businessUpdateVersion: 2,
          visible: true,
          fullSlide: true,
          text: "Driving global standards leadership across next-generation communications, standards IPR and regional initiatives.",
          bullets: [
            "Mission: secure key global standards leadership positions.",
            "Technology: 3GPP 6G and IEEE Wi-Fi contributions.",
            "Portfolio: standards IPR, papers and regional initiatives.",
            "Recognition: rapporteur-ship roles, Hall of Fame and 1H achievements."
          ],
          images: createBusinessImages([
            ["Mission & Objectives", "Global standards leadership positions"],
            ["3GPP 6G Areas", "Next-generation communication standards"],
            ["IEEE Wi-Fi Areas", "Technology leadership and contribution themes"],
            ["Standards IPR", "Innovation portfolio and patent direction"],
            ["1H Achievements", "Technical contributions and papers submitted"],
            ["Hall of Fame", "Recognition and rapporteur-ship highlights"]
          ]),
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
          layout: "business-update",
          businessUpdateVersion: 2,
          visible: true,
          fullSlide: true,
          text: "ADD_IP_GROUP_TEXT_HERE",
          bullets: ["Overview", "Past Work", "Business Impact", "Hall of Fame", "Fast Forward to 2nd Half"],
          images: createBusinessImages([
            ["Overview", "Add IP Group overview image"],
            ["Past Work", "Add prior work or portfolio visual"],
            ["Business Impact", "Add impact summary or chart"],
            ["Hall of Fame", "Add recognition image"],
            ["Fast Forward", "Add 2nd half direction"],
            ["Diagram Placeholder", "Add patent/process/portfolio diagram"]
          ]),
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
          layout: "business-update",
          businessUpdateVersion: 2,
          visible: true,
          fullSlide: true,
          text: "People updates focused on development conversations, team participation and workplace flexibility.",
          bullets: [
            "Competency Assessment and Mid-Year Feedback 2026 support meaningful development conversations.",
            "Managers connect competency feedback, mid-year goal progress and IDPs.",
            "SRIB SSL2026: ARST and CST joined as Research Communication Blasters.",
            "Meal card access expands to Monday-Saturday with no time restriction."
          ],
          images: createBusinessImages([
            ["People Overview", "Development, team connection and flexibility"],
            ["Competency Assessment", "Timeline and assessment flow"],
            ["Mid-Year Feedback", "Workday feedback and IDP conversion"],
            ["Rating Definition", "Level 1 to Level 5 competency scale"],
            ["SRIB SSL2026", "Research Communication Blasters participation"],
            ["Meal Card Flexibility", "Monday-Saturday and no time restriction"]
          ]),
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
