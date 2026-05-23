import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/context";
import { getPlatformSettings, updatePlatformSettings } from "@/lib/superadmin/settings";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getPlatformSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const user = await getCurrentSessionUser();
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      maintenanceMode?: unknown;
      announcement?: unknown;
      modules?: Record<string, unknown> | undefined;
    };

    const current = await getPlatformSettings();
    const next = await updatePlatformSettings({
      maintenanceMode:
        typeof body.maintenanceMode === "boolean" ? body.maintenanceMode : current.maintenanceMode,
      announcement:
        typeof body.announcement === "string" ? body.announcement : current.announcement,
      modules:
        body.modules && typeof body.modules === "object"
          ? {
              threatAcademy:
                typeof body.modules.threatAcademy === "boolean"
                  ? body.modules.threatAcademy
                  : current.modules.threatAcademy,
              aiAnalyzer:
                typeof body.modules.aiAnalyzer === "boolean"
                  ? body.modules.aiAnalyzer
                  : current.modules.aiAnalyzer,
              quizzes:
                typeof body.modules.quizzes === "boolean"
                  ? body.modules.quizzes
                  : current.modules.quizzes,
              attackLab:
                typeof body.modules.attackLab === "boolean"
                  ? body.modules.attackLab
                  : current.modules.attackLab,
              redFlags:
                typeof body.modules.redFlags === "boolean"
                  ? body.modules.redFlags
                  : current.modules.redFlags,
              simulations:
                typeof body.modules.simulations === "boolean"
                  ? body.modules.simulations
                  : current.modules.simulations,
            }
          : current.modules,
    });

    return NextResponse.json({ settings: next });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.trim()
            ? error.message
            : "Unable to update superadmin settings.",
      },
      { status: 500 },
    );
  }
}
