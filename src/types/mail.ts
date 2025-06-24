export interface MailRequest {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface MailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
} 