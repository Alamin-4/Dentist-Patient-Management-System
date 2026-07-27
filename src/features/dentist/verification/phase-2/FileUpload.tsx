"use client";

/**
 * FileUpload — thin backward-compatible wrapper around the shared <FileUploadField />
 * specific to the Phase-2 verification form (JCI Certificate & Video Walkthrough).
 *
 * For new use-cases elsewhere, import <FileUploadField /> from
 *   "@/components/ui/file-upload-field"
 * and configure `maxSizeMB`, `allowedMimeTypes`, etc. directly.
 */

import { FileUploadField } from "@/components/ui/file-upload-field";

interface FileUploadProps {
    name: "jciCertificate" | "videoWalkthrough";
    label: string;
    accept: string;
    disabled?: boolean;
    helperText?: string;
    /** Override max file size in MB. Defaults to 5 MB. */
    maxSizeMB?: number;
}

const FIELD_MIME_CONFIG: Record<
    "jciCertificate" | "videoWalkthrough",
    { allowedMimeTypes: string[]; allowedTypesLabel: string }
> = {
    jciCertificate: {
        allowedMimeTypes: ["application/pdf"],
        allowedTypesLabel: "PDF only",
    },
    videoWalkthrough: {
        allowedMimeTypes: ["video/"],
        allowedTypesLabel: "MP4, MOV, AVI, WEBM",
    },
};

export function FileUpload({
    name,
    label,
    accept,
    disabled,
    helperText,
    maxSizeMB = 5,
}: FileUploadProps) {
    const { allowedMimeTypes, allowedTypesLabel } = FIELD_MIME_CONFIG[name];

    return (
        <FileUploadField
            name={name}
            label={label}
            accept={accept}
            maxSizeMB={maxSizeMB}
            allowedMimeTypes={allowedMimeTypes}
            allowedTypesLabel={allowedTypesLabel}
            helperText={helperText}
            disabled={disabled}
        />
    );
}