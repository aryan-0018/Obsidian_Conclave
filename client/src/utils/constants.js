/**
 * Application Constants
 * 
 * Centralized constants used throughout the app
 */

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE: '/auth/update',
  },
  SESSION: {
    CREATE: '/session/create',
    JOIN: '/session/join',
    END: '/session/end',
    LEAVE: '/session/leave',
    GET: '/session', // Base path, append roomId
    LIST: '/session/list',
    LIVEKIT_TOKEN: '/session/livekit-token',
    ADMIT: '/session/admit',
    DENY: '/session/deny',
    REMOVE: '/session/remove',
    MUTE: '/session/mute',
    STOP_SCREENSHARE: '/session/stop-screenshare',
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOST: '/host',
  JOIN: '/join',
  SETTINGS: '/settings',
  HELP: '/help',
  DOCS: '/docs',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};

export const LIVEKIT_CONFIG = {
  URL: import.meta.env.VITE_LIVEKIT_URL,
};

/**
 * App Configuration
 * Brand information and app-wide settings
 */
export const APP_CONFIG = {
  // Brand Information
  APP_NAME: 'Obsidian Conclave',
  APP_DESCRIPTION: 'Elevate your discourse. An exclusive platform for discrete, high-fidelity encrypted communication, fostering unparalleled collaboration globally.',
  APP_TAGLINE: 'Elevate Your Discourse. Connect With Distinction.',

  // Social Media Links (Removed per request, kept object structure for compatibility)
  SOCIAL_LINKS: {},

  // Footer Links
  FOOTER_LINKS: {
    QUICK_LINKS: [
      { label: 'Home', route: '/', isExternal: false },
      { label: 'Dashboard', route: '/dashboard', isExternal: false },
      { label: 'Sign In', route: '/login', isExternal: false },
      { label: 'Sign Up', route: '/register', isExternal: false },
      { label: 'Settings', route: '/settings', isExternal: false },
    ],
    SUPPORT_LINKS: [
      { label: 'Help', url: '/help', isExternal: false },
      { label: 'Privacy Policy', url: '/privacy', isExternal: false },
      { label: 'Terms of Service', url: '/terms', isExternal: false },
    ],
  },

  // Copyright
  COPYRIGHT_TEXT: 'All rights reserved.',

  // Features Data (for Home and Dashboard)
  FEATURES: [
    {
      icon: 'FaVideo',
      title: 'HD Video Quality',
      description: 'Crystal clear video calls with multiple participants in high definition',
      shortDescription: 'Crystal clear video calls with multiple participants',
      color: 'blue'
    },
    {
      icon: 'FaComments',
      title: 'Built-in Chat',
      description: 'Real-time messaging during your sessions for seamless communication',
      shortDescription: 'Real-time messaging during your sessions',
      color: 'green'
    },
    {
      icon: 'FaShieldAlt',
      title: 'Secure & Private',
      description: 'End-to-end encryption for all your sessions and data protection',
      shortDescription: 'End-to-end encryption for all your sessions',
      color: 'purple'
    },
    {
      icon: 'FaUsers',
      title: 'Easy Collaboration',
      description: 'Invite participants with a simple room ID and start collaborating instantly',
      shortDescription: 'Invite participants with a simple room ID',
      color: 'indigo'
    }
  ],

  // Benefits Data (for Home page)
  BENEFITS: [
    'Unrestricted conclave duration',
    'High-fidelity presentation capabilities',
    'Encrypted session archiving',
    'Exacting access control',
    'Zero-knowledge architecture'
  ],

  // Trust Indicators (for Hero section)
  TRUST_INDICATORS: [
    'Strictly confidential',
    'End-to-end encrypted',
    'Global infrastructure'
  ],

  // Home Page Content
  HOME_CONTENT: {
    HERO: {
      BADGE_TEXT: 'Exclusive Encrypted Communication',
      HEADING: 'Elevate Your',
      HEADING_HIGHLIGHT: 'Discourse',
      SUBHEADING: 'Host and join private, interactive enclaves with unparalleled HD video fidelity, real-time secure chat, and elite collaboration tools.',
      CTA_AUTHENTICATED: 'Enter the Conclave',
      CTA_PRIMARY: 'Commence a Conclave',
      CTA_SECONDARY: 'Sign In',
    },
    FEATURES: {
      HEADING: 'Uncompromising Quality & Security',
      DESCRIPTION: 'Exclusive features curated to ensure your communications remain pristine, untraceable, and exceptionally productive.',
    },
    BENEFITS: {
      HEADING: 'The Obsidian Advantage',
      DESCRIPTION: 'Experience the pinnacle of discreet digital collaboration.',
    },
    CTA: {
      HEADING: 'Ready to Commence Your Session?',
      DESCRIPTION: 'Join distinguished professionals worldwide who trust Obsidian Conclave for their most critical dialogue.',
      BUTTON_AUTHENTICATED: 'Enter the Conclave',
      BUTTON_GUEST: 'Commence a Conclave',
    },
  },

  // Dashboard Content
  DASHBOARD_CONTENT: {
    WELCOME: {
      GREETING: 'Welcome, {userName}.',
      DESCRIPTION: 'Access your private dashboard to commence or join a conclave.',
    },
    ACTION_CARDS: {
      HOST: {
        TITLE: 'Commence a Conclave',
        DESCRIPTION: 'Establish a new secure protocol and invite distinguished guests.',
        BUTTON: 'Commence Session',
        BUTTON_LOADING: 'Establishing...',
      },
      JOIN: {
        TITLE: 'Join a Conclave',
        DESCRIPTION: 'Enter a valid access key to join an ongoing encrypted session.',
        BUTTON: 'Join Session',
      },
    },
    SESSIONS_LIST: {
      HEADING: 'Your Sessions',
      DESCRIPTION: 'Active and past sessions you hosted or joined',
      LOADING: 'Loading sessions...',
      EMPTY: 'No sessions yet.',
      FILTER_ALL: 'All',
      FILTER_ACTIVE: 'Active',
      FILTER_ENDED: 'Ended',
      REJOIN_BUTTON: 'Rejoin',
      ENDED_BUTTON: 'Ended',
    },
  },

  // Session Content
  SESSION_CONTENT: {
    JOIN_FORM: {
      HEADING: 'Join the Conclave',
      DESCRIPTION: 'Enter the secure access key to join an ongoing session.',
      ROOM_ID_LABEL: 'Access Key (Room ID)',
      ROOM_ID_PLACEHOLDER: 'Enter access key',
      ROOM_ID_HELP: 'Procure the access key from the session host.',
      BUTTON: 'Join Session',
      BUTTON_LOADING: 'Authenticating...',
    },
    INFO_CARD: {
      HEADING: 'Session Information',
      ROOM_ID_LABEL: 'Room ID',
      SHAREABLE_LINK_LABEL: 'Shareable Link',
      COPY_BUTTON: 'Copy',
      COPIED_BUTTON: 'Copied!',
      STATUS_LABEL: 'Status',
      PARTICIPANTS_LABEL: 'Participants',
    },
    HEADER: {
      HOSTING_TITLE: 'Hosting Session',
      JOINING_TITLE: 'Join Session',
      END_SESSION_BUTTON: 'End Session',
    },
    VIDEO: {
      TITLE: 'Live Video Session',
      CONNECTED: 'Connected',
      FULLSCREEN: 'Fullscreen',
      CONNECTING: 'Connecting to video room...',
      LEAVE_BUTTON: 'Leave Session',
      END_BUTTON: 'End Session',
      START_RECORDING: 'Record',
      STOP_RECORDING: 'Stop Recording',
      RECORDING: 'Recording...',
      TIMER_LABEL: 'Elapsed',
    },
    PARTICIPANTS: {
      HEADING: 'Participants',
      HOST_LABEL: 'Host',
      PARTICIPANT_LABEL: 'Participant',
      JOINED_USERS_LABEL: 'Joined Users',
      EMPTY_MESSAGE: 'Participants will appear here as they join',
    },
    WAITING_ROOM: {
      HEADING: 'Waiting to be Admitted',
      DESCRIPTION: 'The host will let you in shortly. Please wait...',
      DENIED_MESSAGE: 'Your request to join was denied by the host.',
      SESSION_ENDED_MESSAGE: 'The session has ended.',
    },
    PENDING: {
      HEADING: 'Waiting Room',
      EMPTY_MESSAGE: 'No one is waiting',
      ADMIT_BUTTON: 'Admit',
      DENY_BUTTON: 'Deny',
    },
    HOST_CONTROLS: {
      MUTE: 'Mute',
      UNMUTE: 'Unmute',
      REMOVE: 'Remove',
      STOP_SCREENSHARE: 'Stop Share',
    },
    MEETING_TYPE: {
      PUBLIC_LABEL: 'Public',
      PUBLIC_DESC: 'Anyone with the room ID can join directly',
      PRIVATE_LABEL: 'Private',
      PRIVATE_DESC: 'Participants must be admitted by the host',
    },
  },

  // Auth Content
  AUTH_CONTENT: {
    LOGIN: {
      HEADING: 'Authenticate',
      DESCRIPTION: 'Provide your credentials to securely access your portfolio.',
    },
    REGISTER: {
      HEADING: 'Commence a Conclave',
      DESCRIPTION: 'Register to initiate and participate in exclusive encrypted sessions.',
    },
  },

  // Loading Messages
  LOADING_MESSAGES: {
    SESSION: 'Loading session...',
    SESSIONS: 'Loading sessions...',
    GENERAL: 'Loading...',
  },
};

