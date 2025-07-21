import axios from 'axios';
import { jiraConfig } from '../config/jiraConfig.js';

export const createJiraTicket = async ({ summary, description, issueType = "Task" }) => {
    const url = `${jiraConfig.baseUrl}/rest/api/3/issue`;
    const auth = Buffer.from(`${jiraConfig.email}:${jiraConfig.apiToken}`).toString('base64');

    const data = {
        fields: {
            project: { key: jiraConfig.projectKey },
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
        }
    };  

    console.log("Sending to Jira:", JSON.stringify(data, null, 2));


    console.log("Sending to Jira:", JSON.stringify(data, null, 2));

    try {
        const res = await axios.post(url, data, {
            headers: {
                'Authorization': `Basic ${auth}`,
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