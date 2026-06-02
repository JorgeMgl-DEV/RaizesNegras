CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

CREATE TABLE "PublicationSubmission" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "authors" TEXT NOT NULL,
  "institution" TEXT,
  "knowledgeArea" TEXT,
  "researchArea" TEXT,
  "submissionType" TEXT,
  "abstract" TEXT NOT NULL,
  "keywords" TEXT,
  "driveLink" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT,
  "submitterId" TEXT,
  "submitterEmail" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
  "adminNote" TEXT,
  "approvedDriveFileId" TEXT,
  "approvedDriveFileName" TEXT,
  "approvedDriveLink" TEXT,
  "reviewedByEmail" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PublicationSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PublicationSubmission_status_createdAt_idx" ON "PublicationSubmission"("status", "createdAt");
CREATE INDEX "PublicationSubmission_submitterId_idx" ON "PublicationSubmission"("submitterId");
CREATE INDEX "PublicationSubmission_submitterEmail_idx" ON "PublicationSubmission"("submitterEmail");
CREATE INDEX "PublicationSubmission_approvedDriveFileId_idx" ON "PublicationSubmission"("approvedDriveFileId");
