import * as fs from "node:fs";
import * as csv from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer';

export class DataExportUtil {
    static async exportToCSV(data: any[], fields: string[], filename = 'export.csv'): Promise<string> {
        const csvWriter = createObjectCsvWriter({
            path: filename,
            header: fields.map(field => ({id: field, title: field}))
        });

        await csvWriter.writeRecords(data);
        return filename;
    }

    static async importFromCSV<T>(filePath: string): Promise<T[]> {
        const results: T[] = [];
        const parser = csv.parse({
            columns: true,
            skip_empty_lines: true
        });

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(parser)
                .on('data', (data: T) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }
}