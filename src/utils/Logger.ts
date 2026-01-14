export default class Logger {
    public static info(message: string): void {
        console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
    }

    public static error(message: string, error?: any): void {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`, error || '');
    }

    public static warn(message: string): void {
        console.log(`\x1b[33m[WARN]\x1b[0m ${message}`);
    }
}
