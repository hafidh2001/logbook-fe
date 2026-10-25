// Ordered allowlists ported from READONLY Mobile ActionLogbookDetailScreen.tsx.
// Never reuse Create/Edit field generation for a saved Detail.
export const DETAIL_SCHEMAS: Record<string, {admin: string[];staff: string[];ppds: string[];allowScoreSection?:boolean;showVerificationSection?:boolean}> = {
  morbiditas: {
    admin: [
      'participant',
      'date',
      'patientName',
      'ageYears',
      'emrNumber',
      'diagnosis',
      'attachment',
      'notes',
      'category',
    ],
    staff: [
      'participant',
      'date',
      'patientName',
      'ageYears',
      'emrNumber',
      'diagnosis',
      'attachment',
      'notes',
      'category',
    ],
    ppds: [
      'staff',
      'date',
      'patientName',
      'ageYears',
      'emrNumber',
      'diagnosis',
      'attachment',
      'notes',
      'category',
    ],
  },
  'kamar-operasi': {
    admin: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'hospital',
    ],
    staff: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'hospital',
    ],
    ppds: [
      'staff',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'hospital',
    ],
  },
  bangsal: {
    admin: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'category',
      'hospital',
    ],
    staff: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'category',
      'hospital',
    ],
    ppds: [
      'staff',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'category',
      'hospital',
    ],
  },
  'kegiatan-jaga': {
    admin: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
    staff: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
    ppds: [
      'staff',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
  },
  'kegiatan-poli': {
    admin: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
    staff: [
      'participant',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
    ppds: [
      'staff',
      'date',
      'role',
      'patientName',
      'ageYears',
      'ageMonths',
      'gender',
      'diagnosis',
      'treatment',
      'notes',
      'hospital',
    ],
  },
  publikasi: {
    admin: ['participant', 'date', 'title', 'attachment', 'notes'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes'],
    ppds: ['staff', 'date', 'title', 'attachment', 'notes'],
    allowScoreSection: true,
  },
  'ilmiah-non-stase': {
    admin: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    ppds: ['staff', 'date', 'title', 'attachment', 'notes', 'category'],
  },
  seminar: {
    admin: ['participant', 'date', 'title', 'attachment', 'notes'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes'],
    ppds: ['date', 'title', 'attachment', 'notes'],
    showVerificationSection: true,
    allowScoreSection: true,
  },
  'proposal-thesis': {
    admin: ['participant', 'date', 'title', 'attachment', 'notes'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes'],
    ppds: ['date', 'title', 'attachment', 'notes'],
    showVerificationSection: true,
    allowScoreSection: true,
  },
  'ilmiah-stase': {
    admin: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    ppds: ['staff', 'date', 'title', 'attachment', 'notes', 'category'],
  },
  'bimbingan-operasi': {
    admin: [
      'participant',
      'date',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'category',
      'hospital',
      'presentation',
    ],
    staff: [
      'participant',
      'date',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'category',
      'hospital',
      'presentation',
    ],
    ppds: [
      'staff',
      'date',
      'attachmentBefore',
      'attachmentAfter',
      'notes',
      'category',
      'hospital',
      'presentation',
    ],
    allowScoreSection: true,
  },
  'review-artikel': {
    admin: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    staff: ['participant', 'date', 'title', 'attachment', 'notes', 'category'],
    ppds: ['staff', 'date', 'title', 'attachment', 'notes', 'category'],
    allowScoreSection: true,
  },
  exam: {
    admin: ['participant', 'date', 'notes', 'location', 'category', 'status'],
    staff: ['participant', 'date', 'notes', 'location', 'category', 'status'],
    ppds: ['staff', 'date', 'notes', 'location', 'category', 'status'],
  },
  ekstrakurikuler: {
    admin: ['participant', 'date', 'title', 'notes'],
    staff: ['participant', 'date', 'title', 'notes'],
    ppds: ['staff', 'date', 'title', 'notes'],
  },
  'pengabdian-masyarakat': {
    admin: ['participant', 'date', 'title', 'notes'],
    staff: ['participant', 'date', 'title', 'notes'],
    ppds: ['staff', 'date', 'title', 'notes'],
  },
  course: {
    admin: ['participant', 'date', 'title', 'notes', 'location'],
    staff: ['participant', 'date', 'title', 'notes', 'location'],
    ppds: ['staff', 'date', 'title', 'notes', 'location'],
  },
};

export function normalizeActionKey(identifier: string, title: string) {
  const normalized = `${identifier || title}`
    .trim()
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');

  if (normalized.includes('morbiditas')) {
    return 'morbiditas';
  }

  if (normalized.includes('bimbingan-operasi')) {
    return 'bimbingan-operasi';
  }

  if (normalized.includes('kamar-operasi') || normalized.includes('operasi')) {
    return 'kamar-operasi';
  }

  if (normalized.includes('bangsal')) {
    return 'bangsal';
  }

  if (
    normalized.includes('jaga') ||
    normalized.includes('igd') ||
    normalized.includes('emergency')
  ) {
    return 'kegiatan-jaga';
  }

  if (normalized.includes('poli')) {
    return 'kegiatan-poli';
  }

  if (normalized.includes('publikasi')) {
    return 'publikasi';
  }

  if (normalized.includes('ilmiah-non-stase')) {
    return 'ilmiah-non-stase';
  }

  if (normalized.includes('seminar')) {
    return 'seminar';
  }

  if (normalized.includes('proposal')) {
    return 'proposal-thesis';
  }

  if (normalized.includes('ilmiah-stase') || normalized === 'stase') {
    return 'ilmiah-stase';
  }

  if (normalized.includes('review-artikel')) {
    return 'review-artikel';
  }

  if (normalized.includes('exam')) {
    return 'exam';
  }

  if (
    normalized.includes('ekstrakulikuler') ||
    normalized.includes('ekstrakurikuler')
  ) {
    return 'ekstrakurikuler';
  }

  if (normalized.includes('pengabdian-masyarakat')) {
    return 'pengabdian-masyarakat';
  }

  if (normalized.includes('course')) {
    return 'course';
  }

  return normalized;
}

