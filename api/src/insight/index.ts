import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function insight(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const db = new DatabaseService();
    
    // Add CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: corsHeaders
            };
        }

        const entryId = parseInt(request.params.id);
        if (!entryId) {
            return {
                status: 400,
                headers: corsHeaders,
                jsonBody: { error: 'Invalid entry ID' }
            };
        }

        const aiInsight = db.getAIInsight(entryId);
        if (!aiInsight) {
            return {
                status: 404,
                headers: corsHeaders,
                jsonBody: { error: 'Insight not found' }
            };
        }

        return {
            status: 200,
            headers: corsHeaders,
            jsonBody: aiInsight
        };
    } catch (error) {
        context.log('Error:', error);
        return {
            status: 500,
            headers: corsHeaders,
            jsonBody: { error: 'Internal server error' }
        };
    } finally {
        db.close();
    }
}

app.http('insight', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'entries/{id}/insight',
    handler: insight
});
