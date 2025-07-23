import axios from 'axios';
import { jiraConfig } from '../config/jiraConfig.js';

const authHeader = `Basic ${Buffer.from(`${jiraConfig.email}:${jiraConfig.apiToken}`).toString('base64')}`;


// get list of all issue types 
export const getIssueTypes = async () => {
    try {
        const res = await axios.get(`${jiraConfig.baseUrl}/rest/api/3/issuetype`, {
            headers: {
                Authorization: authHeader,
                'Accept': 'application/json'
            }
        });
        // Return list of issue type names 
        return res.data.map(type => type.name);
    } catch (err) {
        console.error('Error fetching issue types:', err.response?.data || err.message);
        return ['Task', 'Bug', 'Story']; // fallback
    }
};

// get list of all projects
export const getProjectKeys = async () => {
    try {
        const res = await axios.get(`${jiraConfig.baseUrl}/rest/api/3/project/search`, {
            headers: {
                Authorization: authHeader,
                'Accept': 'application/json'
            }
        });
        // return list of projects
        return res.data.values.map(project => project.key.toUpperCase());
    } catch (error) {
        console.error("Error while getting the projects name: ", error.message);
        return [];
    }
};


// create jira ticket function
export const createJiraTicket = async ({ summary, description, issueType, projectKey }) => {
    const url = `${jiraConfig.baseUrl}/rest/api/3/issue`;

    const fields = {
        project: { key: projectKey },
        summary,
        description: {
            type: 'doc',
            version: 1,
            content: [
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: description }
                    ]
                }
            ]
        },
        issuetype: { name: issueType }
    };

    const data = { fields };

    console.log("Sending to Jira:", JSON.stringify(data, null, 2));

    try {
        const res = await axios.post(url, data, {
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        return res.data;
    } catch (error) {
        console.error("Jira create error data:", error.response?.data);
        throw error;
    }
}