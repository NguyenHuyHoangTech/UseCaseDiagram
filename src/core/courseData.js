// src/courseData.js
export const courseData = [
  {
    id: 1,
    title: "Stage 1: Fundamentals & Core Components",
    description: "Helps learners immediately understand what a Use Case is used for and correctly name its components.",
    lessons: [
      {
        id: "lesson-0",
        title: "Lesson 0: Who does the system create value for?",
        content: "Before learning Use Cases, look at the system from the outside: a person or actor interacts with the system to achieve a useful result.",
        type: "interactive-engine",
        engineId: "intro-machine"
      },
      {
        id: "lesson-1",
        title: "Lesson 1: What is a Use Case?",
        content: "Cinema Booking System: see a Use Case as the goal and value the Actor wants to achieve, not UI, database, API, or technical processing.",
        type: "interactive-engine",
        engineId: "what-not-how"
      },
      {
        id: "lesson-2",
        title: "Lesson 2: System Boundary",
        content: "Use Cases lie within the boundary; Actors and external systems stand outside.",
        type: "interactive-engine",
        engineId: "system-boundary"
      },
      {
        id: "lesson-3",
        title: "Lesson 3: Actor (Not just human)",
        content: "An Actor is a role, an external system, or time triggering the system.",
        type: "interactive-engine",
        engineId: "actor"
      },
      {
        id: "lesson-4",
        title: "Lesson 4: Naming Rules for Use Cases",
        content: "A good name is usually a business verb + a business object.",
        type: "interactive-engine",
        engineId: "naming"
      }
    ]
  },
  {
    id: 2,
    title: "Stage 2: Diagram Grammar & Relationships",
    description: "Teach how to connect arrows. This is the hardest part, made easy to understand with many comparative examples.",
    lessons: [
      {
        id: "lesson-5",
        title: "Lesson 5: Association Relationship",
        type: "level1-association",
        levelIndex: 1,
        content: "The system needs someone to trigger it. Choose the correct connection line."
      },
      {
        id: "lesson-6",
        title: "Lesson 6: Mandatory Relationship (<<include>>)",
        type: "level1-association",
        levelIndex: 2,
        content: "To withdraw money, the system MUST check the PIN code."
      },
      {
        id: "lesson-7",
        title: "Lesson 7: Optional Relationship (<<extend>> & Extension Point)",
        type: "level1-association",
        levelIndex: 3,
        content: "The system has an \"Apply discount code\" feature, but this is optional."
      },
      {
        id: "lesson-8",
        title: "Lesson 8: Distinguish <<include>> and <<extend>>",
        type: "level1-association",
        levelIndex: 4,
        content: "Clearly distinguish what is mandatory and what is optional by filling in 4 blanks."
      },
      {
        id: "lesson-9",
        title: "Lesson 9: Generalization Relationship",
        type: "level1-association",
        levelIndex: 5,
        content: "A VIP Customer is fundamentally still a Customer. Use Generalization to group them together."
      }
    ]
  },
  {
    id: 3,
    title: "Stage 3: Requirement Analysis Skills",
    description: "Teach learners how to read a requirements document and pick out the right components.",
    lessons: [
      {
        id: "lesson-10",
        title: "Lesson 10: Keyword Extraction & Noise Filtering",
        type: "highlighter",
        content: "Analyze the requirement below. Extract the Actor (👤), Use Case (⚙️), and filter out Technical Noise (🚫) by highlighting with appropriate colors.",
        raw_text: "The Chief Accountant wants to log into the system using a company account to export the monthly financial report as a PDF file. The export interface must use Arial font and data is fetched from the Oracle database.",
        segments: [
          { text: "The Chief Accountant", type: "actor" },
          { text: " wants to log into the system ", type: "usecase" },
          { text: "using a company account", type: "noise" },
          { text: " to " },
          { text: "export the monthly financial report", type: "usecase" },
          { text: " " },
          { text: "as a PDF file", type: "noise" },
          { text: ". " },
          { text: "The export interface must use Arial font", type: "noise" },
          { text: " and " },
          { text: "data is fetched from the Oracle database", type: "noise" },
          { text: "." }
        ]
      },
      {
        id: "lesson-11",
        title: "Lesson 11: Level of Detail (Granularity - CRUD)",
        type: "decision-tree",
        content: "Decide the level of detail (Granularity) when grouping or separating CRUD tasks to ensure security.",
        scenario: "The system has 2 Actors: 'Customer' and 'Admin'. A Customer has the right to [View their personal info]. An Admin has the right to [View, Edit, Delete customer info].",
        question: "How should you design these Use Cases in the diagram?",
        options: [
          {
            text: "Draw 1 Use Case 'Manage personal info' and connect both Customer and Admin to it.",
            correct: false,
            feedback: "Incorrect! If drawn this way, the Customer would accidentally be granted Edit/Delete permissions similar to Admin (since both point to 1 big Use Case containing all actions). This is a severe CRUD security flaw!"
          },
          {
            text: "Separate them into individual Use Cases: 'View info' (for both), 'Edit/Delete info' (connected only to Admin).",
            correct: true,
            feedback: "Exactly! When Actors have different permissions on the same data object, we must decompose (separate) the Use Cases to ensure information safety and correct authorization."
          }
        ]
      },
      {
        id: "lesson-12",
        title: "Lesson 12: Turning Use Cases into Flowcharts (Anti-patterns)",
        type: "decision-tree",
        content: "Find and point out common Use Case design errors (Anti-patterns) by comparing and choosing the correct UML design diagram below.",
        scenario: "You need to draw a Use Case diagram for two features: 'Login' and 'View Balance'. Business rules require the user to successfully log in before they can view their account balance.",
        question: "Which diagram below correctly describes the business relationship between these two Use Cases without making a sequential error (Anti-pattern)?",
        options: [
          {
            text: "Design a diagram with a directional arrow (sequence arrow) pointing directly from the 'Login' Use Case to 'View Balance'.",
            image: "/anti_pattern_flowchart.png",
            correct: false,
            feedback: "Incorrect! A Use Case diagram only describes what functions the system has (What), it must never be used to draw a sequential workflow (Workflow/Flowchart) between Use Cases by connecting directional arrows. This is the classic mistake of turning a Use Case into a Flowchart!"
          },
          {
            text: "Design a diagram drawing two independent Use Cases (no sequence arrows). The login sequence flow will be put into the 'Pre-condition' specification of 'View Balance'.",
            image: "/correct_pattern_flowchart.png",
            correct: true,
            feedback: "Excellent! Use Cases on the diagram must be completely independent in terms of process. The sequential order (must log in first) will be specifically described in the Scenario Specification document (Pre-condition section) or by using an Activity Diagram!"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Stage 4: Scenario Specification",
    description: "Guide how to write detailed scenarios for Use Cases and provide a system of exercises to reinforce knowledge.",
    lessons: [
      {
        id: "lesson-13",
        title: "Lesson 13: Structure of Use Case Specification (Pre/Post-conditions)",
        type: "drag-and-drop",
        content: "Distinguish between Pre-conditions and Post-conditions of a Use Case: System Login.",
        items: [
          { text: "The user accesses the login page", category: "Pre-condition" },
          { text: "The system displays Online status", category: "Post-condition" },
          { text: "The user account was previously activated", category: "Pre-condition" },
          { text: "A login session is successfully created", category: "Post-condition" }
        ]
      },
      {
        id: "lesson-14",
        title: "Lesson 14: Main Success Scenario (Happy Path)",
        type: "reorder",
        content: "Order the standard conversation scenario between the Actor and System for Use Case: ATM Cash Withdrawal.",
        steps: [
          "1. Actor inserts card into machine and enters PIN.",
          "2. System successfully authenticates PIN and displays function menu.",
          "3. Actor selects Withdraw Cash and enters amount.",
          "4. System deducts account balance, returns card, and dispenses cash."
        ]
      },
      {
        id: "lesson-15",
        title: "Lesson 15: Exception Flow & Alternative Flow",
        type: "multiple-choice",
        question: "In the 'Pay Bill' Use Case, if a customer enters the wrong OTP code more than 3 times, how should this scenario be handled?",
        content: "In the 'Pay Bill' Use Case, if a customer enters the wrong OTP code more than 3 times, how should this scenario be handled?",
        options: [
          { text: "Main Success Scenario (Happy Path)", correct: false },
          { text: "Alternative Flow - Allow entering a different OTP", correct: false },
          { text: "Exception Flow - Cancel transaction, temporarily lock OTP feature and show error message", correct: true }
        ]
      },
      {
        id: "lesson-16",
        title: "Lesson 16: Spaced Repetition Exercise Series",
        type: "spaced-repetition-hub",
        content: "The intelligent review system (Brain Injector) helps you deeply reinforce <<include>> and <<extend>> relationships through spaced repetition exercises."
      }
    ]
  },
  {
    id: 5,
    title: "Stage 5: Practical Case Studies & Question Bank",
    description: "Focus on composing sample projects from system description text to final solution diagrams.",
    lessons: [
      {
        id: "lesson-17",
        title: "Lesson 17: Level 1 Case Study (Small System)",
        content: "Provides problem descriptions and detailed solutions: ATM Machine, Fast Food Ordering App."
      },
      {
        id: "lesson-18",
        title: "Lesson 18: Level 2 Case Study (Multi-role System)",
        content: "Provides problem descriptions and solutions: School Library Management, University Course Registration."
      },
      {
        id: "lesson-19",
        title: "Lesson 19: Level 3 Case Study (Large Project)",
        content: "Compose an extremely difficult project (E-commerce Platform or Flight Booking). Guide to system decomposition."
      },
      {
        id: "lesson-20",
        title: "Lesson 20: Expanded Requirement Bank",
        content: "Automatically generate about 20-30 more Requirement problems in various fields for practice."
      }
    ]
  }
];
