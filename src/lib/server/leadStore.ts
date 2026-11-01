import { promises as fs } from 'node:fs';
import path from 'node:path';

export type Lead = {
    name: string;
    phone: string;
    budget: string;
    preferences: string;
    interest: string;
    consent: true;
    at: string;
};

export async function recordLead(lead: Lead, undelivered = false) {
    const directory = process.env.LEADS_DATA_DIR || path.join(process.cwd(), '.data');
    await fs.mkdir(directory, { recursive: true });
    await fs.appendFile(
        path.join(/* turbopackIgnore: true */ directory, undelivered ? 'leads-undelivered.jsonl' : 'leads.jsonl'),
        `${JSON.stringify(lead)}\n`,
        'utf8'
    );
}
