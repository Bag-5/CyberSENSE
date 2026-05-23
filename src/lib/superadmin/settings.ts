import { ensureDatabaseReady, getDatabase } from "@/lib/db/postgres";

export type PlatformModules = {
  threatAcademy: boolean;
  aiAnalyzer: boolean;
  quizzes: boolean;
  attackLab: boolean;
  redFlags: boolean;
  simulations: boolean;
};

export type PlatformSettings = {
  maintenanceMode: boolean;
  announcement: string;
  modules: PlatformModules;
  updatedAt: string;
};

const defaultSettings: PlatformSettings = {
  maintenanceMode: false,
  announcement: "CyberSENSE is ready for training, challenges, and safe exploration.",
  modules: {
    threatAcademy: true,
    aiAnalyzer: true,
    quizzes: true,
    attackLab: true,
    redFlags: true,
    simulations: true,
  },
  updatedAt: new Date().toISOString(),
};

function normalizeSettings(value: unknown): PlatformSettings {
  const source = value && typeof value === "object" ? (value as Partial<PlatformSettings>) : {};
  const modules =
    source.modules && typeof source.modules === "object"
      ? (source.modules as Partial<PlatformModules>)
      : {};

  return {
    maintenanceMode: Boolean(source.maintenanceMode),
    announcement:
      typeof source.announcement === "string" && source.announcement.trim()
        ? source.announcement.trim()
        : defaultSettings.announcement,
    modules: {
      threatAcademy: typeof modules.threatAcademy === "boolean" ? modules.threatAcademy : true,
      aiAnalyzer: typeof modules.aiAnalyzer === "boolean" ? modules.aiAnalyzer : true,
      quizzes: typeof modules.quizzes === "boolean" ? modules.quizzes : true,
      attackLab: typeof modules.attackLab === "boolean" ? modules.attackLab : true,
      redFlags: typeof modules.redFlags === "boolean" ? modules.redFlags : true,
      simulations: typeof modules.simulations === "boolean" ? modules.simulations : true,
    },
    updatedAt:
      typeof source.updatedAt === "string" && source.updatedAt.trim()
        ? source.updatedAt
        : new Date().toISOString(),
  };
}

async function seedSettings() {
  const db = getDatabase();
  const rows = await db<{ settings: unknown }[]>`
    select settings
    from cybersense_platform_settings
    where id = 'global'
    limit 1
  `;

  if (!rows[0]) {
    await db`
      insert into cybersense_platform_settings (id, settings, updated_at)
      values ('global', ${JSON.stringify(defaultSettings)}::jsonb, ${defaultSettings.updatedAt})
    `;
  }
}

export async function getPlatformSettings() {
  await ensureDatabaseReady();
  const db = getDatabase();
  await seedSettings();

  const rows = await db<{ settings: unknown }[]>`
    select settings
    from cybersense_platform_settings
    where id = 'global'
    limit 1
  `;

  return normalizeSettings(rows[0]?.settings ?? defaultSettings);
}

export async function updatePlatformSettings(
  patch: Partial<Omit<PlatformSettings, "updatedAt">>,
) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const current = await getPlatformSettings();
  const next: PlatformSettings = {
    ...current,
    ...patch,
    modules: {
      ...current.modules,
      ...(patch.modules || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  await db`
    insert into cybersense_platform_settings (id, settings, updated_at)
    values ('global', ${JSON.stringify(next)}::jsonb, ${next.updatedAt})
    on conflict (id) do update set
      settings = excluded.settings,
      updated_at = excluded.updated_at
  `;

  return next;
}
