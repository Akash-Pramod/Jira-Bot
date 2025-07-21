import dotenv from 'dotenv';
dotenv.config();

export const jiraConfig = {
    baseUrl: process.env.JIRA_BASE_URL,          // JIRA url
    email: process.env.JIRA_EMAIL,              // Atlassian Email
    apiToken: process.env.JIRA_API_TOKEN,       // Atlassian Token
    projectKey: process.env.JIRA_PROJECT_KEY    // BOT
};