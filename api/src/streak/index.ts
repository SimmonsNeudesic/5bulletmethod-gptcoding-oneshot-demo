import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function streak(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        const userId = 'test-user'; // Simulated auth
        const streakCount = db.getStreak(userId);

        return {
            status: 200,
            headers: corsHeaders,
            jsonBody: { streak: streakCount }
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

app.http('streak', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'streak',
    handler: streak
});
