export type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
}

export const LEGAL_CONTACT_EMAIL = 'mnatsakanyan.lalvar@gmail.com'

export const TERMS_LAST_UPDATED = '2026-01-23'

export const TERMS_OF_SERVICE: LegalSection[] = [
  {
    id: 'intro',
    title: 'Terms of Service',
    paragraphs: [
      `These Terms of Service (“Terms”) govern your access to and use of the DailyMood Journal mobile application and related services (collectively, the “Service”).`,
      `The Service is operated by an individual developer as a casual, best-effort project. We do not provide any service-level commitments (SLA) and may change, pause, or discontinue features at any time.`,
      `By creating an account, accessing, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.`,
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    paragraphs: [
      `You must be able to form a legally binding contract in your jurisdiction to use the Service.`,
      `The Service is not intended for children under 13, and you may not use the Service if you are under 13.`,
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts and security',
    paragraphs: [
      `You may need an account to use the Service. You agree to provide accurate information and keep it up to date.`,
      `You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.`,
      `If the Service requires email verification, you must verify your email address to access certain features.`,
      `If you believe your account has been compromised, contact us at ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
  {
    id: 'user-content',
    title: 'Your content',
    paragraphs: [
      `You retain ownership of the notes, text, images, and other content you submit or store in the Service (“User Content”).`,
      `To operate the Service, you grant us a limited, non-exclusive, worldwide license to host, store, process, transmit, and display your User Content solely for providing the Service, including troubleshooting and support.`,
      `You are responsible for your User Content and represent that you have the rights necessary to submit it to the Service.`,
      `You understand that features may change and that we cannot guarantee the Service will always be available or that your content will always be accessible. You should keep your own backups of important content.`,
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    paragraphs: [
      `You agree not to misuse the Service. For example, you will not:`,
      `- access or use the Service in an unlawful way;`,
      `- attempt to disrupt, damage, or gain unauthorized access to the Service or its systems;`,
      `- probe, scan, or test the vulnerability of any system;`,
      `- interfere with other users’ access to the Service.`,
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    paragraphs: [
      `The Service may rely on third-party services (for example, authentication, storage, email delivery, crash reporting, analytics). Your use of those third-party services may be subject to their terms and policies.`,
      `We are not responsible for third-party services that are not under our control.`,
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    paragraphs: [
      `Our Privacy Policy explains how we collect, use, and share information about you and your use of the Service. By using the Service, you agree to our Privacy Policy.`,
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    paragraphs: [
      `The Service is provided “as is” and “as available.” To the maximum extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.`,
      `We do not guarantee that the Service will be uninterrupted, error-free, or secure, or that any content will be preserved without loss.`,
      `The Service is intended for journaling and personal reflection. It is not medical, mental health, or professional advice. If you need professional help, seek a qualified provider.`,
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    paragraphs: [
      `To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, or goodwill, arising from or related to your use of the Service.`,
      `To the extent liability cannot be excluded, our total liability for any claim arising out of or relating to the Service will be limited to the amount you paid us for the Service in the 12 months preceding the claim (or $100 if you paid nothing).`,
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    paragraphs: [
      `You may stop using the Service at any time.`,
      `We may suspend or terminate your access to the Service if you materially breach these Terms or if we must do so to comply with law or protect the Service and its users.`,
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these Terms',
    paragraphs: [
      `We may update these Terms from time to time. If we make material changes, we will provide notice within the Service or by other reasonable means.`,
      `Your continued use of the Service after the changes take effect means you accept the updated Terms.`,
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    paragraphs: [
      `These Terms are governed by the laws applicable in the jurisdiction most closely connected to the Service and your use of it, without regard to conflict of laws rules, to the extent permitted by law.`,
      `Nothing in these Terms limits any consumer protections you may be entitled to under applicable law.`,
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    paragraphs: [
      `Questions about these Terms? Contact us at ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
]
