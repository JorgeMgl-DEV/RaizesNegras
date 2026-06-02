"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/src/lib/admin";
import { prisma } from "@/src/lib/prisma";
import {
  SUBMISSION_STATUS,
  buildDriveFileViewLink,
  extractDriveFileId,
} from "@/src/lib/submissions";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";

async function requireAdminUser() {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=session");
  }

  if (!isAdminUser(user)) {
    redirect("/perfil?error=admin");
  }

  return user;
}

export async function reviewSubmission(formData) {
  const user = await requireAdminUser();
  const submissionId = formData.get("submissionId")?.toString() || "";
  const status = formData.get("status")?.toString() || SUBMISSION_STATUS.PENDING;
  const adminNote = formData.get("adminNote")?.toString().trim() || "";
  const approvedDriveValue = formData.get("approvedDriveValue")?.toString().trim() || "";
  const approvedDriveFileName = formData.get("approvedDriveFileName")?.toString().trim() || "";

  if (!submissionId) {
    redirect("/admin?error=submission");
  }

  if (!Object.values(SUBMISSION_STATUS).includes(status)) {
    redirect("/admin?error=status");
  }

  const approvedDriveFileId =
    status === SUBMISSION_STATUS.APPROVED ? extractDriveFileId(approvedDriveValue) : "";

  if (status === SUBMISSION_STATUS.APPROVED && !approvedDriveFileId) {
    redirect(`/admin?error=${encodeURIComponent("Informe o ID ou link do arquivo final no Drive antes de aprovar.")}`);
  }

  await prisma.publicationSubmission.update({
    where: { id: submissionId },
    data: {
      status,
      adminNote: adminNote || null,
      approvedDriveFileId: approvedDriveFileId || null,
      approvedDriveFileName: status === SUBMISSION_STATUS.APPROVED ? approvedDriveFileName || null : null,
      approvedDriveLink: approvedDriveFileId ? buildDriveFileViewLink(approvedDriveFileId) : null,
      reviewedByEmail: user.email || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/submeter");
  redirect("/admin?reviewed=1");
}
