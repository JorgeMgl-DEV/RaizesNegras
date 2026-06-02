"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { getSubmissionFromFormData, validateSubmission } from "@/src/lib/submissions";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";

export async function createSubmission(formData) {
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

  const submission = getSubmissionFromFormData(formData);
  const validationMessage = validateSubmission(submission);

  if (validationMessage) {
    redirect(`/submeter?error=${encodeURIComponent(validationMessage)}`);
  }

  await prisma.publicationSubmission.create({
    data: {
      ...submission,
      submitterId: user.id,
      submitterEmail: user.email || submission.contactEmail,
    },
  });

  revalidatePath("/submeter");
  revalidatePath("/admin");
  redirect("/submeter?success=1");
}
