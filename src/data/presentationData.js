export const KAHOOT_LINK = "PASTE_KAHOOT_LINK_HERE";

export const createImagePlaceholder = (caption = "Image Placeholder") => ({
  id: crypto.randomUUID(),
  src: "",
  caption,
  role: "gallery",
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
      title: "Leadership Address",
      subtitle: "MD Mohan Sir Presentation",
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
          id: "arg-overview",
          title: "2026 Mission & Objectives",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "Advance Research Group",
          bullets: [
            "Beyond current boundaries",
            "Accelerating emerging technology preceding research",
            "Enriched and new user experiences",
            "Understanding the future with bigger and faster LLM",
            "Empowering user with seamless image editing",
            "Enabling enhanced user experience with spatial sensing and speech",
            "Protecting user and user media from deepfake",
            "Enabling episodic memory"
          ],
          images: []
        },
        {
          id: "quantum-inspired-ai",
          title: "Quantum Inspired AI - Images Required",
          layout: "diagram-gallery",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: ["Pipeline", "Current Results", "Radar chart/result image", "Text summary card"],
          images: [createImagePlaceholder("Pipeline"), createImagePlaceholder("Current Results")]
        },
        {
          id: "spatial-sense-ai",
          title: "Spatial Sense AI - Images Required",
          layout: "image-grid",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "complex scene / multi-holder / multi-termination",
            "Isaac Sim / Arena",
            "OpenPI 0.5",
            "Cobot SO-101-ARM",
            "pre-training",
            "post-training and inference",
            "Samsung Electronics visuals"
          ],
          images: [
            createImagePlaceholder("Complex Scene"),
            createImagePlaceholder("Isaac Sim / Arena"),
            createImagePlaceholder("Cobot SO-101-ARM"),
            createImagePlaceholder("Samsung Electronics visuals")
          ]
        },
        {
          id: "arg-achievements",
          title: "1H Achievements",
          layout: "text-heavy",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: ["Quantum Inspired AI", "Spatial Sense AI", "Grade A Patent", "SBPA EA Selected", "AX Initiative"],
          images: []
        },
        {
          id: "arg-fast-forward",
          title: "Fast Forward to 2H 2026",
          layout: "roadmap",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "Quantum Inspired AI",
            "Spatial Sense AI",
            "Fine Manipulation: Dexterous Hand",
            "Expansion of Target Tasks",
            "Comparison against Gaussian model and contribution toward compression"
          ],
          images: []
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
          id: "oi-overview",
          title: "Overview",
          layout: "bento",
          visible: true,
          fullSlide: true,
          text: "Open Innovation",
          bullets: [
            "Startup incubation",
            "Strategic partnerships",
            "Galaxy Convention 2026",
            "Ongoing discussions",
            "Translation & interpretation"
          ],
          images: []
        },
        {
          id: "startup-partnerships",
          title: "Startup Strategic Partnerships",
          layout: "timeline-gallery",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "Startup Incubation - Samsung Mobile Advance (SMA) 2026",
            "Total applications",
            "Submitted proposals",
            "Pitch day candidates",
            "Timeline",
            "Galaxy Convention 2026",
            "Ongoing discussions with Suwon R&D"
          ],
          images: [createImagePlaceholder("Startup incubation funnel"), createImagePlaceholder("Samsung Mobile Advance timeline")]
        },
        {
          id: "competency-feedback",
          title: "Competency Assessment & Mid-Year Feedback",
          layout: "process",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "competency assessment",
            "mid-year feedback",
            "meal card usage window change",
            "access for greater flexibility",
            "team / POC information if visible"
          ],
          images: [createImagePlaceholder("Competency update"), createImagePlaceholder("Meal card usage window change")]
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
          id: "srg-mission",
          title: "Standards Research Group - Mission & Objectives",
          layout: "text-cards",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "2026 Mission & Objectives",
            "Securing key global standards leadership positions",
            "Technology leadership in shaping next-generation communication standards",
            "3GPP 6G areas",
            "IEEE Wi-Fi areas",
            "Strengthening innovation portfolio in global standards",
            "Regional initiatives"
          ],
          images: [createImagePlaceholder("Global standards visual")]
        },
        {
          id: "srg-achievements",
          title: "Standards Research Group - 1H Achievements",
          layout: "metrics",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: [
            "technical contributions to global standards",
            "Standards IPR",
            "papers submitted",
            "6G rapporteur-ship roles"
          ],
          images: []
        },
        {
          id: "srg-hall-of-fame",
          title: "Standards Research Group - Hall of Fame",
          layout: "recognition",
          visible: true,
          fullSlide: true,
          text: "ADD_TEXT_FROM_IMAGE_AS_IS",
          bullets: ["Hall of Fame"],
          images: []
        }
      ]
    },
    {
      id: "ip-group",
      type: "group",
      groupName: "IP Group",
      title: "IP Group",
      theme: "purple",
      sections: ["Overview", "Past Work", "Business Impact", "Hall of Fame", "Fast Forward to 2nd Half", "Image / Diagram Placeholder"].map((title) => ({
        id: `ip-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title,
        layout: title.includes("Image") ? "image-grid" : "placeholder",
        visible: true,
        fullSlide: title === "Overview",
        text: "ADD_IP_GROUP_TEXT_HERE",
        bullets: [],
        images: title.includes("Image") ? [createImagePlaceholder("Image / Diagram Placeholder")] : []
      }))
    },
    {
      id: "people-group",
      type: "group",
      groupName: "People Group",
      title: "People Group",
      theme: "green",
      sections: ["Overview", "Key Updates", "People Initiatives", "Business Impact", "Hall of Fame", "Fast Forward to 2nd Half", "Image Placeholder"].map((title) => ({
        id: `people-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title,
        layout: title.includes("Image") ? "image-grid" : "placeholder",
        visible: true,
        fullSlide: title === "Overview",
        text: "ADD_PEOPLE_GROUP_TEXT_HERE",
        bullets: [],
        images: title.includes("Image") ? [createImagePlaceholder("Image Placeholder")] : []
      }))
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
