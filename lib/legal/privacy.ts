import { LEGAL_CONTACT_EMAIL } from '@/lib/legal/terms'

export type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
}

export const PRIVACY_LAST_UPDATED = '2026-01-23'

export const PRIVACY_POLICY: LegalSection[] = [
  {
    id: 'intro',
    title: 'Privacy Policy',
    paragraphs: [
      `This Privacy Policy describes how DailyMood Journal (“we”, “us”) collects, uses, and shares information when you use the DailyMood Journal app and related services (the “Service”).`,
      `The Service is operated by an individual developer as a casual, best-effort project. This Privacy Policy is meant to be clear and honest about what data is involved when you use the Service.`,
      `If you have questions or want to exercise your privacy rights, contact us at ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
  {
    id: 'what-we-collect',
    title: 'Information we collect',
    paragraphs: [
      `We collect information you provide and information generated when you use the Service, including:`,
      `- Account information: email address, password (handled by our authentication provider), and basic profile info such as display name and optional photo.`,
      `- User content: the notes and related content you create and store in the Service.`,
      `- Support communications: information you send when contacting us.`,
      `- Device and usage data: app interactions, diagnostics, and performance data (for example, crash reports and performance traces).`,
      `- Local storage: we store certain preferences on your device (for example, language/locale) using local storage mechanisms like AsyncStorage. On web builds, similar preferences may be stored using browser storage.`,
    ],
  },
  {
    id: 'how-we-use',
    title: 'How we use information',
    paragraphs: [
      `We use information to:`,
      `- provide and operate the Service (authentication, syncing, displaying your notes);`,
      `- maintain security and prevent abuse;`,
      `- send transactional messages (for example, email verification and password reset);`,
      `- diagnose and fix bugs, monitor reliability and performance (best-effort);`,
      `- comply with legal obligations and enforce our Terms.`,
    ],
  },
  {
    id: 'legal-bases',
    title: 'Legal bases (EEA/UK)',
    paragraphs: [
      `If you are in the EEA or UK, we process personal data under the following legal bases:`,
      `- performance of a contract (to provide the Service you request);`,
      `- legitimate interests (to secure, maintain, and improve the Service);`,
      `- compliance with legal obligations;`,
      `- consent (where required, for example for certain analytics on some platforms).`,
    ],
  },
  {
    id: 'sharing',
    title: 'How we share information',
    paragraphs: [
      `We share information only as described below:`,
      `- Service providers (processors): we use third parties to help operate the Service, such as authentication and database hosting, email delivery infrastructure, and crash/performance monitoring.`,
      `- Legal and safety: we may disclose information if required by law or if we believe disclosure is necessary to protect the rights, safety, or security of users, the public, or the Service.`,
      `- Business changes: if we are involved in a merger, acquisition, or sale of assets, information may be transferred as part of that transaction (subject to applicable law).`,
    ],
  },
  {
    id: 'third-parties',
    title: 'Key third parties we use',
    paragraphs: [
      `Depending on your platform and how you use the Service, we may use:`,
      `- Firebase (Google) for authentication and database/storage.`,
      `- Google Sign-In (Google) if you choose to sign in with Google.`,
      `- Cloudflare Worker endpoints to deliver certain emails (for example password recovery/security-related emails).`,
      `- Sentry for crash reporting and performance monitoring.`,
    ],
  },
  {
    id: 'retention',
    title: 'Data retention',
    paragraphs: [
      `We keep personal data for as long as needed to provide the Service and for legitimate business purposes such as security, compliance, and dispute resolution.`,
      `Notes you delete may be moved to a “trash” state (soft delete) and can be restored until you permanently delete them (where supported). Permanent deletion is intended to remove the content from active storage, subject to reasonable backup/replication delays.`,
    ],
  },
  {
    id: 'security',
    title: 'Security',
    paragraphs: [
      `We use reasonable technical and organizational measures designed to protect information. However, no system is completely secure, and we cannot guarantee absolute security.`,
      `You are responsible for keeping your device and account credentials secure. If you believe your account has been compromised, contact us at ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
  {
    id: 'international-transfers',
    title: 'International data transfers',
    paragraphs: [
      `We and our service providers may process information outside your country of residence. Where required, we rely on appropriate safeguards for cross-border transfers (for example, standard contractual clauses) or other lawful mechanisms.`,
    ],
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    paragraphs: [
      `Depending on where you live, you may have rights to access, correct, delete, or export your personal data, and to object to or restrict certain processing.`,
      `If you are in the EEA/UK, you may also have the right to lodge a complaint with your local data protection authority.`,
      `To exercise rights, contact us at ${LEGAL_CONTACT_EMAIL}. We may need to verify your identity before fulfilling your request.`,
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this Privacy Policy',
    paragraphs: [
      `We may update this Privacy Policy from time to time. If we make material changes, we will provide notice within the Service or by other reasonable means.`,
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    paragraphs: [
      `For questions or privacy requests, contact us at ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
]
