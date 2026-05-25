import { generateId } from "@/lib/auth/crypto";
import { ensureDatabaseReady, getDatabase } from "@/lib/db/postgres";

export type IssuedCertificateRecord = {
  id: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  certificateType: "quiz" | "milestone" | "training";
  subjectKey: string | null;
  subjectTitle: string;
  issuedAt: string;
};

type IssuedCertificateRow = {
  id: string;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  certificate_type: "quiz" | "milestone" | "training";
  subject_key: string | null;
  subject_title: string;
  issued_at: string;
  updated_at: string;
};

export type CertificateIssueInput = {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  certificateType: "quiz" | "milestone" | "training";
  subjectKey?: string;
  subjectTitle: string;
};

export async function recordCertificateIssue(input: CertificateIssueInput) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const now = new Date().toISOString();

  const rows = await db<IssuedCertificateRow[]>`
    insert into cybersense_certificate_issues (
      id,
      user_id,
      username,
      email,
      full_name,
      certificate_type,
      subject_key,
      subject_title,
      issued_at,
      updated_at
    ) values (
      ${generateId()},
      ${input.userId},
      ${input.username},
      ${input.email.toLowerCase().trim()},
      ${input.fullName.trim()},
      ${input.certificateType},
      ${input.subjectKey ?? null},
      ${input.subjectTitle},
      ${now},
      ${now}
    )
    returning
      id,
      user_id,
      username,
      email,
      full_name,
      certificate_type,
      subject_key,
      subject_title,
      issued_at,
      updated_at
  `;

  const row = rows[0];
  return row ? mapRow(row) : null;
}

export async function loadIssuedCertificates(limit = 24) {
  await ensureDatabaseReady();
  const db = getDatabase();

  const rows = await db<IssuedCertificateRow[]>`
    select
      id,
      user_id,
      username,
      email,
      full_name,
      certificate_type,
      subject_key,
      subject_title,
      issued_at,
      updated_at
    from cybersense_certificate_issues
    order by issued_at desc
    limit ${limit}
  `;

  return rows.map(mapRow);
}

function mapRow(row: IssuedCertificateRow): IssuedCertificateRecord {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    email: row.email,
    fullName: row.full_name,
    certificateType: row.certificate_type,
    subjectKey: row.subject_key,
    subjectTitle: row.subject_title,
    issuedAt: row.issued_at,
  };
}
