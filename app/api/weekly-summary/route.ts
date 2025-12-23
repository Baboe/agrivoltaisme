import { NextRequest, NextResponse } from "next/server";
import { generateWeeklySummary } from "../../../lib/weekly-summary";
const nodemailer = require('nodemailer');

export async function GET(request: NextRequest) {
  try {
    const summary = generateWeeklySummary();
    const body = `
Total submissions: ${summary.totalSubmissions}

Number received this week: ${summary.numberThisWeek}

Submissions by role:
Solar operator: ${summary.roles['Solar operator']}
Grazier: ${summary.roles.Grazier}
Consultant: ${summary.roles.Consultant}
Other: ${summary.roles.Other}

Grazing status most often challenged:
${summary.mostChallenged}

Top recurring themes:
${summary.topThemes.join('\n')}

Selected user excerpts:
${summary.excerpts.map(e => `- "${e}"`).join('\n')}
`;

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'meprins@icloud.com',
      subject: 'Ombaa – Weekly Grazing Status Signal Review',
      text: body
    });

    return NextResponse.json({ message: 'Weekly summary sent successfully' });
  } catch (error) {
    console.error('Error sending weekly summary:', error);
    return NextResponse.json({ error: 'Failed to send summary' }, { status: 500 });
  }
}