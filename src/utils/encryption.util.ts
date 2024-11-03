import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export class EncryptionUtil {
    private static readonly algorithm = 'aes-256-cbc';
    private static readonly key = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex');

    static encrypt(text: string): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    static decrypt(text: string): string {
        const [ivHex, encryptedHex] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = createDecipheriv(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}