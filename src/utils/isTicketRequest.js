// Function to detect ticket creation intent in user prompt
export function isTicketRequest(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;

  const lower = prompt.toLowerCase();

  // Regex patterns to detect common ways to create a ticket
  const patterns = [
    // "create a ticket", "create jira issue", "create bug", etc.
    /\b(create|raise|open|file|make)\b.{0,20}\b(ticket|jira|issue|bug|task|story|sub-?task|change)\b/,

    // "need to create a ticket", "should raise a bug"
    /\b(need|should|please).{0,20}\b(create|raise|open|file|make).{0,20}\b(ticket|jira|issue|bug|task|story|sub-?task|change)\b/,
  ];

  // Return true if any regex matches
  return patterns.some(regex => regex.test(lower));
}








// Function to detect ticket creation intent
// export function isTicketRequest(prompt) {
//   if (!prompt || typeof prompt !== 'string') return false;

//   const lower = prompt.toLowerCase();

//   // ticket creation patterns
//   const patterns = [
//     "create ticket",
//     "raise ticket",
//     "open ticket",
//     "create jira",
//     "raise jira",
//     "create a bug",
//     "create a task",
//     "create a story",
//     "create a sub task",
//     "raise a sub task",
//     "open a jira ticket",
//     "raise an issue",
//     "raise a bug",
//     "raise a task",
//     "raise a change require",
//     "create a change require"
//   ];

//   return patterns.some(pattern => lower.includes(pattern));
// }
