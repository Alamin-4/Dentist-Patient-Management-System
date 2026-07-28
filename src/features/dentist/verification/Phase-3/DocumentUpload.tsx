"use client";

import { FileUploadField } from "@/components/ui/file-upload-field";

interface Props {
  label: string;
  name: string;
  error?: string;
  disabled?: boolean;
}

export function DocumentUpload({ label, name, disabled }: Props) {
  return (
    <FileUploadField
      name={name as any}
      label={label}
      accept=".pdf,.doc,.docx"
      maxSizeMB={5}
      allowedMimeTypes={[
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]}
      allowedTypesLabel="PDF, DOC, DOCX"
      helperText="PDF and Word documents accepted (Max 5 MB)"
      disabled={disabled}
    />
  );
}
