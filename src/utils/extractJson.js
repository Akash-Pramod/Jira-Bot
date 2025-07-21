/**
 * Extracts the first JSON object found in a text string.
 * @param {string} text - The text containing JSON.
 * @returns {Object} Parsed JSON object.
 * @throws {Error} If no JSON object found or parsing fails.
 */

export const extractJson = (text) => {
    const match = text.match(/\{[\s\S]*\}/);

    if(match){
        try {
            return JSON.parse([match[0]]);
        } catch (error) {
            throw new Error('Invalid JSON found in text');
        }
    }
    throw new Error('No JSON found in the text');
}