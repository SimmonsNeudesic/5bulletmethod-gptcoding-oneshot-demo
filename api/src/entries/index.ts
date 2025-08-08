import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function entries(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const db = new DatabaseService();
    
    // Add CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const method = request.method;
        const userId = 'test-user'; // Simulated auth
        const entryId = request.params.id ? parseInt(request.params.id) : null;

        if (method === 'OPTIONS') {
            return {
                status: 200,
                headers: corsHeaders
            };
        }

        switch (method) {
            case 'GET':
                if (entryId) {
                    // Get specific entry
                    const entry = db.getEntry(entryId);
                    if (!entry) {
                        return {
                            status: 404,
                            headers: corsHeaders,
                            jsonBody: { error: 'Entry not found' }
                        };
                    }
                    return {
                        status: 200,
                        headers: corsHeaders,
                        jsonBody: entry
                    };
                } else {
                    // Get all entries for user
                    const entries = db.getEntries(userId);
                    return {
                        status: 200,
                        headers: corsHeaders,
                        jsonBody: entries
                    };
                }

            case 'POST':
                const createBody = await request.json() as any;
                const { week_start_date, items } = createBody;
                
                if (!week_start_date || !items || !Array.isArray(items)) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Missing required fields: week_start_date, items' }
                    };
                }

                // Check if entry already exists for this week
                const existingEntry = db.getEntryByWeek(userId, week_start_date);
                if (existingEntry) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Entry already exists for this week' }
                    };
                }

                const newEntry = db.createEntry(userId, week_start_date, items);
                return {
                    status: 201,
                    headers: corsHeaders,
                    jsonBody: newEntry
                };

            case 'PUT':
                if (!entryId) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Entry ID required for update' }
                    };
                }

                const updateBody = await request.json() as any;
                const { items: updateItems } = updateBody;
                
                if (!updateItems || !Array.isArray(updateItems)) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Missing required field: items' }
                    };
                }

                const updatedEntry = db.updateEntry(entryId, updateItems);
                if (!updatedEntry) {
                    return {
                        status: 404,
                        headers: corsHeaders,
                        jsonBody: { error: 'Entry not found' }
                    };
                }

                return {
                    status: 200,
                    headers: corsHeaders,
                    jsonBody: updatedEntry
                };

            case 'DELETE':
                if (!entryId) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Entry ID required for deletion' }
                    };
                }

                const deleted = db.deleteEntry(entryId);
                if (!deleted) {
                    return {
                        status: 404,
                        headers: corsHeaders,
                        jsonBody: { error: 'Entry not found' }
                    };
                }

                return {
                    status: 204,
                    headers: corsHeaders
                };

            default:
                return {
                    status: 405,
                    headers: corsHeaders,
                    jsonBody: { error: 'Method not allowed' }
                };
        }
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

app.http('entries', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    route: 'entries/{id?}',
    handler: entries
});
