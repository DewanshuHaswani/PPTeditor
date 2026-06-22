export const KAHOOT_LINK = "PASTE_KAHOOT_LINK_HERE";

export const createImagePlaceholder = (caption = "Image Placeholder", subtitle = "Add image details in the edit portal") => ({
  id: crypto.randomUUID(),
  src: "",
  title: caption,
  subtitle,
  details: "",
  expandable: true,
  caption,
  role: "gallery",
  size: "normal",
  fit: "cover",
  position: "center",
  isPlaceholder: true
});

const createBusinessImages = (items) => items.map(([title, subtitle, details = ""], index) => ({
  ...createImagePlaceholder(title, subtitle),
  details,
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
          businessUpdateVersion: 3,
          expandable: true,
          visible: true,
          fullSlide: true,
          text: "Emerging AI research for future UX, spatial intelligence, trustworthy media and faster model capabilities.",
          bullets: [
            "Mission: accelerate preceding research beyond current boundaries.",
            "Core: Quantum Inspired AI, Spatial Sense AI, Multimodal AI and LLM-led experiences.",
            "1H: Grade A patents, SBPA EA selections and AX initiatives.",
            "2H: dexterous hand, expanded target tasks and compression-focused model comparison."
          ],
          details: [
            "2026 mission centers on preceding research that moves beyond current technical and experience boundaries.",
            "Research themes combine Quantum Inspired AI, Spatial Sense AI, Multimodal AI and LLM-led experiences into future product directions.",
            "1H output is summarized through Grade A patents, SBPA EA selections and AX initiatives.",
            "2H direction focuses on dexterous hand research, expanded target tasks and compression-oriented model comparison."
          ],
          images: createBusinessImages([
            ["Quantum Inspired AI", "Pipeline, current results and radar/result view", "Use this slot for Quantum Inspired AI diagrams, pipeline visuals and current-result charts."],
            ["Spatial Sense AI", "Complex scenes, Isaac Sim/Arena and Cobot SO-101-ARM", "Use this slot for Spatial Sense AI environment, robotics and inference visuals."],
            ["Multimodal AI", "Future user experiences across image, speech and context", "Use this slot for multimodal user experience concepts or result samples."],
            ["2026 Mission", "Emerging technology research themes and objectives", "Use this slot for mission/objective visuals and research theme summaries."],
            ["1H Achievements", "Patents, SBPA EA selections and AX initiatives", "Use this slot for achievement, patent and AX initiative evidence."],
            ["2H 2026 Roadmap", "Dexterous hand, task expansion and model compression", "Use this slot for roadmap visuals and 2H research direction diagrams."]
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
          businessUpdateVersion: 3,
          expandable: true,
          visible: true,
          fullSlide: true,
          text: "Connecting startup ecosystems, Samsung R&D priorities and internal enablement into focused innovation pathways.",
          bullets: [
            "SMA 2026: startup incubation from applications to pitch day candidates.",
            "Partnerships: submitted proposals, Galaxy Convention 2026 and Suwon R&D discussions.",
            "Programs: Samsung emovatex 2026 and top-12 visibility.",
            "Enablement: translation, interpretation and internal process updates."
          ],
          details: [
            "Samsung Mobile Advance 2026 tracks the startup incubation funnel from applications through proposals and pitch day candidates.",
            "Strategic partnership updates include submitted proposals, Galaxy Convention 2026 and ongoing Suwon R&D discussions.",
            "Program highlights include Samsung emovatex 2026 and top-12 startup visibility.",
            "Enablement updates cover translation, interpretation and internal process improvements."
          ],
          images: createBusinessImages([
            ["Startup Incubation Funnel", "Applications, proposals and pitch day candidates", "Use this slot for funnel charts and candidate pipeline visuals."],
            ["Samsung Mobile Advance 2026", "SMA timeline and proposal flow", "Use this slot for SMA schedule, stage gates and proposal flow."],
            ["Galaxy Convention 2026", "Convention table and partner mapping", "Use this slot for Galaxy Convention table or partner mapping screenshots."],
            ["Suwon R&D Discussions", "Ongoing collaboration opportunities", "Use this slot for discussion status and collaboration opportunity visuals."],
            ["Samsung emovatex 2026", "Top-12 startup visibility", "Use this slot for emovatex 2026 top-12 startup visuals."],
            ["Team Enablement", "Translation, interpretation and process updates", "Use this slot for enablement, process and team update visuals."]
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
          businessUpdateVersion: 3,
          expandable: true,
          visible: true,
          fullSlide: true,
          text: "Driving global standards leadership across next-generation communications, standards IPR and regional initiatives.",
          bullets: [
            "Mission: secure key global standards leadership positions.",
            "Technology: 3GPP 6G and IEEE Wi-Fi contributions.",
            "Portfolio: standards IPR, papers and regional initiatives.",
            "Recognition: rapporteur-ship roles, Hall of Fame and 1H achievements."
          ],
          details: [
            "Mission objectives focus on securing key global standards leadership positions.",
            "Technology leadership is represented through 3GPP 6G and IEEE Wi-Fi contribution areas.",
            "Innovation portfolio work includes standards IPR, submitted papers and regional initiatives.",
            "Recognition includes rapporteur-ship roles, Hall of Fame items and 1H achievements."
          ],
          images: createBusinessImages([
            ["Mission & Objectives", "Global standards leadership positions", "Use this slot for standards mission/objective visuals."],
            ["3GPP 6G Areas", "Next-generation communication standards", "Use this slot for 3GPP 6G technical contribution visuals."],
            ["IEEE Wi-Fi Areas", "Technology leadership and contribution themes", "Use this slot for IEEE Wi-Fi standards visuals."],
            ["Standards IPR", "Innovation portfolio and patent direction", "Use this slot for standards IPR and portfolio visuals."],
            ["1H Achievements", "Technical contributions and papers submitted", "Use this slot for 1H contribution and paper submission summaries."],
            ["Hall of Fame", "Recognition and rapporteur-ship highlights", "Use this slot for recognition and rapporteur-ship visuals."]
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
          businessUpdateVersion: 3,
          expandable: true,
          visible: true,
          fullSlide: true,
          text: "ADD_IP_GROUP_TEXT_HERE",
          bullets: ["Overview", "Past Work", "Business Impact", "Hall of Fame", "Fast Forward to 2nd Half"],
          details: ["ADD_IP_GROUP_OVERVIEW_HERE", "ADD_IP_GROUP_PAST_WORK_HERE", "ADD_IP_GROUP_BUSINESS_IMPACT_HERE", "ADD_IP_GROUP_HALL_OF_FAME_HERE", "ADD_IP_GROUP_2H_DIRECTION_HERE"],
          images: createBusinessImages([
            ["Overview", "Add IP Group overview image", "Add image details for IP Group overview."],
            ["Past Work", "Add prior work or portfolio visual", "Add image details for past work."],
            ["Business Impact", "Add impact summary or chart", "Add image details for business impact."],
            ["Hall of Fame", "Add recognition image", "Add image details for recognition."],
            ["Fast Forward", "Add 2nd half direction", "Add image details for 2nd half direction."],
            ["Diagram Placeholder", "Add patent/process/portfolio diagram", "Add image details for patent, process or portfolio diagram."]
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
          businessUpdateVersion: 3,
          expandable: true,
          visible: true,
          fullSlide: true,
          text: "People updates focused on development conversations, team participation and workplace flexibility.",
          bullets: [
            "Competency Assessment and Mid-Year Feedback 2026 support meaningful development conversations.",
            "Managers connect competency feedback, mid-year goal progress and IDPs.",
            "SRIB SSL2026: ARST and CST joined as Research Communication Blasters.",
            "Meal card access expands to Monday-Saturday with no time restriction."
          ],
          details: [
            "Competency Assessment and Mid-Year Feedback 2026 are aligned to enable meaningful development conversations.",
            "Managers can share competency-based developmental feedback alongside mid-year goal progress and convert feedback into IDPs.",
            "ARST and CST joined forces for SRIB SSL2026 as Research Communication Blasters.",
            "Meal card access changes from Monday-Friday to Monday-Saturday, with no time restriction."
          ],
          images: createBusinessImages([
            ["People Overview", "Development, team connection and flexibility", "Use this slot for People Group overview visuals."],
            ["Competency Assessment", "Timeline and assessment flow", "Use this slot for Competency Assessment timeline visuals."],
            ["Mid-Year Feedback", "Workday feedback and IDP conversion", "Use this slot for Workday feedback and IDP conversion visuals."],
            ["Rating Definition", "Level 1 to Level 5 competency scale", "Use this slot for competency rating definition visuals."],
            ["SRIB SSL2026", "Research Communication Blasters participation", "Use this slot for SRIB SSL2026 sports/team visuals."],
            ["Meal Card Flexibility", "Monday-Saturday and no time restriction", "Use this slot for meal card usage window visuals."]
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
