import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { opportunity_id, report_type, description } = body;

  if (!opportunity_id || !report_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("opportunity_reports").insert([
    { opportunity_id, report_type, description: description || "" },
  ]);

  if (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
