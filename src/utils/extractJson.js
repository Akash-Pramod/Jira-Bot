// Function to extract JSON
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