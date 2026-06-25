import { NextResponse } from "next/server";
import { getAdminSyncJobs } from "@/lib/services/admin";
import { toApiError, toErrorStatus } from "@/lib/errors";

export async function GET() {
  try {
    const syncJobs = await getAdminSyncJobs();
    return NextResponse.json({ syncJobs });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: toErrorStatus(error) });
  }
}
