// src/utils/spacedRepetition.js

/**
 * Brain Injector Middleware:
 * Injects a spaced repetition review question at the end of specific lessons
 * to reinforce <<include>> and <<extend>> concepts.
 */
export const injectSpacedRepetitionQuestion = (currentLessonId) => {
  const spacedRepetitionData = {
    'lesson-13': {
      id: 'sr-13',
      title: '⚡ SPACED REPETITION CHALLENGE',
      question: 'How is the [Authenticate Fingerprint] Use Case related to the [Unlock Phone] Use Case?',
      options: [
        { text: '<<include>>', correct: true },
        { text: '<<extend>>', correct: false }
      ],
      explanation: 'In this scenario, the [Unlock Phone] Use Case requires the [Authenticate Fingerprint] action as a mandatory part (or sub-process) to complete. Therefore, this is an <<include>> relationship (mandatory).'
    },
    'lesson-15': {
      id: 'sr-15',
      title: '⚡ SPACED REPETITION CHALLENGE',
      question: 'How is the [Apply Discount Code] Use Case related to the [Checkout] Use Case?',
      options: [
        { text: '<<include>>', correct: false },
        { text: '<<extend>>', correct: true }
      ],
      explanation: 'The [Apply Discount Code] action is optional and only happens at a certain point (Extension Point) during [Checkout]. The checkout transaction still completes successfully even without a discount code. Therefore, this is an <<extend>> relationship.'
    },
    'lesson-17': {
      id: 'sr-17',
      title: '⚡ SPACED REPETITION CHALLENGE',
      question: 'How is the [Add to Wishlist] Use Case related to the [View Product Details] Use Case?',
      options: [
        { text: '<<include>>', correct: false },
        { text: '<<extend>>', correct: true }
      ],
      explanation: 'When viewing product details, the user can optionally add that product to their wishlist. This is a non-mandatory action to finish viewing details, representing an <<extend>> relationship.'
    }
  };

  return spacedRepetitionData[currentLessonId] || null;
};
