import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenAI({ apiKey });

    this.model =
      this.configService.get<string>('GEMINI_MODEL') ??
      'gemini-flash-latest';
  }

  async summarizeTicket(
    title: string,
    description: string,
  ): Promise<string> {
    const prompt = `
You are an AI assistant helping customer support agents.

Write a complete summary of the support ticket in 2-3 short sentences.
Keep it under 60 words. Always finish your sentences.

Include:
- The customer's main issue.
- Important details or symptoms.
- What the customer needs help with.

Do not invent information.
Do not suggest a solution.
Return only the summary.

Ticket title: ${title}

Ticket description: ${description}
`;

    try {
      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 300,
        },
      });

      const summary = response.text?.trim();

      if (!summary) {
        throw new Error('Gemini returned an empty response.');
      }

      return summary;
    } catch (error) {
      this.logger.error('Failed to generate ticket summary.', error);

      throw new InternalServerErrorException(
        'Unable to generate ticket summary. Please try again.',
      );
    }
  }

  async suggestReply(
    title: string,
    description: string,
    ): Promise<string> {
    const prompt = `
    You are an AI assistant helping a customer support agent draft a response.

    Write a helpful, professional, and friendly reply to the customer.

    Requirements:
    - Acknowledge the customer's issue.
    - Show understanding and empathy.
    - Provide useful guidance only when supported by the ticket details.
    - If more information is needed, politely ask the customer for it.
    - Do not invent facts or assume actions have already been taken.
    - Do not promise refunds, compensation, or resolution.
    - Keep the reply concise and easy to understand.
    - Return only the suggested customer-facing reply.
    - Do not include a subject line or explanation.

    Ticket title: ${title}

    Ticket description: ${description}
    `;

    try {
        const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
            temperature: 0.4,
            maxOutputTokens: 400,
        },
        });

        const reply = response.text?.trim();

        if (!reply) {
        throw new Error('Gemini returned an empty response.');
        }

        return reply;
    } catch (error) {
        this.logger.error('Failed to generate suggested reply.', error);

        throw new InternalServerErrorException(
        'Unable to generate a suggested reply. Please try again.',
        );
    }
    }
}