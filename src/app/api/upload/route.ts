import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and Word documents allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5 MB" }, { status: 400 });
    }

    // Create bucket if it doesn't exist yet
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === "resumes")) {
      await supabase.storage.createBucket("resumes", { public: true });
    }

    const ext = file.name.split(".").pop();
    const path = `cvs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("resumes").getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message ?? "Upload failed" }, { status: 500 });
  }
}
