import { base64ToBytes, bytesToHex } from 'ton3-core/dist/utils/helpers';

export const base64ToHex = (base64: string): string => bytesToHex(base64ToBytes(base64));
