import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { join } from "node:path";

type ReportMetric = {
  label: string;
  value: string;
  detail?: string;
};

type ReportBullet = {
  title?: string;
  text: string;
};

export type CertificatePdfInput = {
  fullName: string;
  certificateTitle: string;
  achievementTitle: string;
  completionDate: string;
  description: string;
  details: ReportMetric[];
};

export type QuizReportPdfInput = {
  fullName: string;
  email: string;
  generatedAt: string;
  summaryMetrics: ReportMetric[];
  completedCategories: ReportMetric[];
  strengths: ReportBullet[];
  recommendations: ReportBullet[];
  achievements: ReportBullet[];
  categoryScores: ReportMetric[];
};

export type ProgressReportPdfInput = {
  title: string;
  generatedAt: string;
  summaryMetrics: ReportMetric[];
  trendMetrics: ReportMetric[];
  leaderboard: ReportMetric[];
  highlights: ReportBullet[];
};

function createDocument() {
  const doc = new PDFDocument({
    size: "A4",
    margin: 42,
    bufferPages: true,
    autoFirstPage: false,
  });

  return doc;
}

function bufferFromDoc(doc: PDFKit.PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

function addBackground(doc: PDFKit.PDFDocument) {
  const { width, height } = doc.page;
  doc.save();
  doc.rect(0, 0, width, height).fill("#07111f");
  doc.rect(0, 0, width, 120).fill("#0a1a2a");
  doc.rect(0, height - 112, width, 112).fill("#08131f");
  doc.restore();

  for (let i = 0; i < 6; i += 1) {
    doc
      .save()
      .fillColor(i % 2 === 0 ? "rgba(34,211,238,0.08)" : "rgba(217,70,239,0.08)")
      .roundedRect(34 + i * 54, 146 + i * 6, 20, 20, 6)
      .fill()
      .restore();
  }
}

function addHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle: string,
  badge: string,
) {
  doc.fillColor("#f5e7b8");
  doc.font("Helvetica-Bold").fontSize(11).text("CyberSENSE", 42, 34, {
    characterSpacing: 2.6,
    fill: true,
  });
  doc.fontSize(24).fillColor("#ffffff").text(title, 42, 52, {
    width: 420,
    lineGap: 2,
  });
  doc.font("Helvetica").fontSize(10.5).fillColor("#c6d1e2").text(subtitle, 42, 88, {
    width: 420,
    lineGap: 3,
  });

  doc.font("Helvetica-Bold").fontSize(10);
  const badgeWidth = Math.max(doc.widthOfString(badge) + 28, 120);
  doc
    .save()
    .roundedRect(doc.page.width - badgeWidth - 42, 38, badgeWidth, 30, 15)
    .fillAndStroke("#10283a", "#22d3ee")
    .restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#dffbff")
    .text(badge, doc.page.width - badgeWidth - 42, 47, {
      width: badgeWidth,
      align: "center",
    });
}

function addFooter(doc: PDFKit.PDFDocument, footerText: string) {
  const pageNumber = doc.bufferedPageRange().count;
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#8ea1b8")
    .text(footerText, 42, doc.page.height - 52, {
      width: doc.page.width - 84,
      align: "left",
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#c7d1e0")
    .text(`Page ${pageNumber}`, 42, doc.page.height - 52, {
      width: doc.page.width - 84,
      align: "right",
    });
}

function addMetricGrid(doc: PDFKit.PDFDocument, metrics: ReportMetric[]) {
  let cursorX = 42;
  let cursorY = doc.y + 10;
  const boxWidth = 232;
  const boxHeight = 74;
  const gapX = 14;
  const gapY = 14;

  metrics.forEach((metric, index) => {
    if (index > 0 && index % 2 === 0) {
      cursorX = 42;
      cursorY += boxHeight + gapY;
    }

    const x = cursorX;
    const y = cursorY;
    const tone = index % 3 === 0 ? "#0d2a36" : index % 3 === 1 ? "#2a2138" : "#2a3122";
    const border = index % 3 === 0 ? "#22d3ee" : index % 3 === 1 ? "#d946ef" : "#f59e0b";

    doc
      .save()
      .roundedRect(x, y, boxWidth, boxHeight, 18)
      .fillAndStroke(tone, border)
      .restore();

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#cbd5e1").text(metric.label, x + 14, y + 12, {
      width: boxWidth - 28,
      characterSpacing: 1.8,
    });
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#ffffff").text(metric.value, x + 14, y + 28, {
      width: boxWidth - 28,
      lineBreak: false,
    });
    if (metric.detail) {
      doc.font("Helvetica").fontSize(8.5).fillColor("#a8b5c7").text(metric.detail, x + 14, y + 52, {
        width: boxWidth - 28,
      });
    }

    cursorX += boxWidth + gapX;
  });

  doc.y = cursorY + boxHeight + 16;
}

function addSectionTitle(doc: PDFKit.PDFDocument, title: string, subtitle?: string) {
  doc
    .moveDown(0.5)
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#f5e7b8")
    .text(title.toUpperCase(), { characterSpacing: 2.2 });
  if (subtitle) {
    doc.font("Helvetica").fontSize(9.5).fillColor("#9fb2c8").text(subtitle, {
      width: 500,
      lineGap: 3,
    });
  }
  doc.moveDown(0.7);
}

function addBulletList(doc: PDFKit.PDFDocument, bullets: ReportBullet[]) {
  bullets.forEach((bullet) => {
    doc.font("Helvetica-Bold").fontSize(10.2).fillColor("#ffffff");
    if (bullet.title) {
      doc.text(`• ${bullet.title}`, { continued: false });
    } else {
      doc.text("•", { continued: false });
    }
    doc.font("Helvetica").fontSize(9.3).fillColor("#c6d1e2").text(bullet.text, {
      indent: 12,
      lineGap: 3,
    });
    doc.moveDown(0.2);
  });
}

function addTwoColumnList(doc: PDFKit.PDFDocument, items: ReportMetric[]) {
  items.forEach((item) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#ffffff")
      .text(item.label, {
        continued: true,
      });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#c6d1e2")
      .text(`  ${item.value}${item.detail ? ` · ${item.detail}` : ""}`, {
        lineGap: 3,
      });
  });
}

const certificateLogoPath = join(process.cwd(), "Logo", "CyberSENSE-image.png");

export async function generateCertificatePdf(input: CertificatePdfInput) {
  const doc = createDocument();
  doc.addPage({ size: "A4", layout: "landscape" });
  addBackground(doc);
  addHeader(
    doc,
    "Certificate of Completion",
    "Official CyberSENSE awareness certificate generated for safe learning progress.",
    "Cyber Awareness",
  );

  const panelX = 34;
  const panelY = 126;
  const panelW = doc.page.width - 68;
  const panelH = 398;
  const centerX = doc.page.width / 2;

  doc
    .save()
    .roundedRect(panelX, panelY, panelW, panelH, 30)
    .fillAndStroke("#081321", "#f5d98b")
    .restore();

  doc
    .save()
    .lineWidth(1.5)
    .roundedRect(panelX + 10, panelY + 10, panelW - 20, panelH - 20, 24)
    .stroke("#22d3ee")
    .restore();

  doc.save();
  doc.roundedRect(centerX - 110, panelY + 20, 220, 84, 20).fill("#132238");
  doc.restore();

  doc.save();
  doc.roundedRect(centerX - 110, panelY + 20, 220, 84, 20);
  doc.clip();
  if (certificateLogoPath) {
    doc.image(certificateLogoPath, centerX - 110, panelY + 20, {
      cover: [220, 84],
      align: "center",
      valign: "center",
    });
  }
  doc.restore();

  doc
    .save()
    .roundedRect(centerX - 110, panelY + 20, 220, 84, 20)
    .lineWidth(1.2)
    .stroke("#f5d98b")
    .restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#ffffff")
    .text(input.certificateTitle, 92, panelY + 118, {
      width: doc.page.width - 184,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor("#c6d1e2")
    .text("This certifies that", 92, panelY + 162, {
      width: doc.page.width - 184,
      align: "center",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor("#f5e7b8")
    .text(input.fullName, 92, panelY + 188, {
      width: doc.page.width - 184,
      align: "center",
    });

  const ribbonText = input.achievementTitle;
  doc.font("Helvetica-Bold").fontSize(11);
  const ribbonWidth = Math.min(Math.max(doc.widthOfString(ribbonText) + 58, 240), panelW - 120);
  doc
    .save()
    .roundedRect(centerX - ribbonWidth / 2, panelY + 246, ribbonWidth, 34, 17)
    .fillAndStroke("#10283a", "#22d3ee")
    .restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#dffbff")
    .text(ribbonText, centerX - ribbonWidth / 2, panelY + 255, {
      width: ribbonWidth,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#d9e5f2")
    .text(input.description, 104, panelY + 304, {
      width: doc.page.width - 208,
      align: "center",
      lineGap: 4,
    });

  const detailLineY = panelY + 360;
  const detailLineText = input.details
    .filter((metric) => metric.label !== "Issued to")
    .map((metric) => `${metric.label}: ${metric.value}`)
    .join("  ·  ");

  doc
    .save()
    .moveTo(panelX + 104, detailLineY - 12)
    .lineTo(doc.page.width - panelX - 104, detailLineY - 12)
    .lineWidth(1)
    .strokeColor("#f5d98b")
    .stroke()
    .restore();

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#dff2df")
    .text(detailLineText, 96, detailLineY, {
      width: doc.page.width - 192,
      align: "center",
      lineBreak: false,
      height: 14,
    });

  doc
    .font("Helvetica")
    .fontSize(8.8)
    .fillColor("#f5d98b")
    .text("CyberSENSE verified certificate · generated from live learning progress", 42, doc.page.height - 48, {
      width: doc.page.width - 84,
      align: "center",
      lineBreak: false,
      height: 12,
    });

  doc.end();
  return bufferFromDoc(doc);
}

export async function generateQuizReportPdf(input: QuizReportPdfInput) {
  const doc = createDocument();
  doc.addPage();
  addBackground(doc);
  addHeader(
    doc,
    "CyberSENSE Quiz Report",
    "A personalized review of quiz results, strengths, and next-step recommendations.",
    "User report",
  );

  addSectionTitle(doc, "Learner summary");
  addMetricGrid(doc, input.summaryMetrics);

  addSectionTitle(doc, "Completed categories", "The quiz library you've already explored.");
  addTwoColumnList(doc, input.completedCategories);
  doc.moveDown(0.3);

  addSectionTitle(doc, "Strengths", "What you are already doing well.");
  addBulletList(doc, input.strengths);

  addSectionTitle(doc, "Improvement recommendations", "Where the next learning gains are waiting.");
  addBulletList(doc, input.recommendations);

  addSectionTitle(doc, "Achievement summary", "Unlocked milestones and badges.");
  addBulletList(doc, input.achievements);

  addSectionTitle(doc, "Category scores", "Stored quiz scores by category.");
  addTwoColumnList(doc, input.categoryScores);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#8ea1b8")
    .text(`Prepared for ${input.fullName} · ${input.email}`, 42, doc.page.height - 92, {
      width: doc.page.width - 84,
    });
  doc.text(`Generated on ${input.generatedAt}`, 42, doc.page.height - 76, {
    width: doc.page.width - 84,
  });
  addFooter(doc, "CyberSENSE user report · Progress made visible and shareable");

  doc.end();
  return bufferFromDoc(doc);
}

export async function generateProgressReportPdf(input: ProgressReportPdfInput) {
  const doc = createDocument();
  doc.addPage();
  addBackground(doc);
  addHeader(
    doc,
    input.title,
    "Superadmin progress report with engagement summaries, leaderboard snapshots, and operational highlights.",
    "Superadmin report",
  );

  addSectionTitle(doc, "Operational overview");
  addMetricGrid(doc, input.summaryMetrics);

  addSectionTitle(doc, "Trend snapshot");
  addTwoColumnList(doc, input.trendMetrics);

  addSectionTitle(doc, "Leaderboard summary");
  addTwoColumnList(doc, input.leaderboard);

  addSectionTitle(doc, "Highlights");
  addBulletList(doc, input.highlights);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#8ea1b8")
    .text(`Generated on ${input.generatedAt}`, 42, doc.page.height - 78, {
      width: doc.page.width - 84,
      align: "left",
    });
  addFooter(doc, "CyberSENSE superadmin report · Live data from PostgreSQL");

  doc.end();
  return bufferFromDoc(doc);
}
