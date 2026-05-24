"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { kolSteps, useStateContext } from "@/providers/StateProvider";
import BasicInfoForm from "./kol-member-modal-form/basic-info";
import BioLanguageInfoForm from "./kol-member-modal-form/bio-language-info";
import ContactInfoForm from "./kol-member-modal-form/contact-info";
import MediaNotesInfoForm from "./kol-member-modal-form/media-notes-info";

const steps: kolSteps[] = [
  "Basic Info",
  "Bio & Languages",
  "Contact",
  "Media & Notes",
];

type ContactMethod = "email" | "whatsapp" | "platform" | "";

interface KolFormData {
  basicInfo: {
    fullName: string;
    credentials: string;
    yearsOfExperience: string;
    specialty: string;
    country: string;
  };
  bioLanguage: {
    bio: string;
    languages: string;
  };
  contact: {
    contactMethod: ContactMethod;
    email: string;
    whatsapp: string;
  };
  media: {
    photoFile: File | null;
    linkedinUrl: string;
    websiteUrl: string;
    internalNotes: string;
  };
}

const createInitialFormData = (): KolFormData => ({
  basicInfo: {
    fullName: "",
    credentials: "",
    yearsOfExperience: "",
    specialty: "",
    country: "",
  },
  bioLanguage: {
    bio: "",
    languages: "",
  },
  contact: {
    contactMethod: "",
    email: "",
    whatsapp: "",
  },
  media: {
    photoFile: null,
    linkedinUrl: "",
    websiteUrl: "",
    internalNotes: "",
  },
});

const getStepIndex = (step: kolSteps) => steps.indexOf(step);

export default function AddKolMemberModal() {
  const { kolModalOpen, setKolModalOpen, setAddKolStep, addKolStep } =
    useStateContext();
  const [formData, setFormData] = useState<KolFormData>(createInitialFormData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentStepIndex = Math.max(getStepIndex(addKolStep), 0);
  const isLastStep = currentStepIndex === steps.length - 1;

  const resetModalState = () => {
    setAddKolStep("Basic Info");
    setFormData(createInitialFormData());
  };

  const handleOpenChange = (open: boolean) => {
    setKolModalOpen(open);

    if (!open) {
      resetModalState();
    }
  };

  const handleClose = () => {
    setKolModalOpen(false);
    resetModalState();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    resetModalState();
  };

  const handleNext = () => {
    if (isLastStep) {
      return;
    }

    setAddKolStep(steps[currentStepIndex + 1]);
  };

  const handlePrevious = () => {
    if (currentStepIndex === 0) {
      return;
    }

    setAddKolStep(steps[currentStepIndex - 1]);
  };

  const handleSubmit = () => {
    console.info("KOL member payload", formData);
    setKolModalOpen(false);
    setShowSuccessModal(true);
  };

  const updateBasicInfo = (
    field: keyof KolFormData["basicInfo"],
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      basicInfo: {
        ...current.basicInfo,
        [field]: value,
      },
    }));
  };

  const updateBioLanguage = (
    field: keyof KolFormData["bioLanguage"],
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      bioLanguage: {
        ...current.bioLanguage,
        [field]: value,
      },
    }));
  };

  const updateContact = <T extends keyof KolFormData["contact"]>(
    field: T,
    value: KolFormData["contact"][T],
  ) => {
    setFormData((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }));
  };

  const updateMedia = (
    field: keyof KolFormData["media"],
    value: string | File | null,
  ) => {
    setFormData((current) => ({
      ...current,
      media: {
        ...current.media,
        [field]: value,
      },
    }));
  };

  const getStepButtonLabel = () => (isLastStep ? "Submit" : "Next");

  const getStepSubtitle = () => {
    if (currentStepIndex === 0) {
      return "Start with the doctor's core profile so the directory card is accurate.";
    }

    if (currentStepIndex === 1) {
      return "Add the bio and languages that dentists will see on the public profile.";
    }

    if (currentStepIndex === 2) {
      return "Choose the best contact route and keep the inline details editable.";
    }

    return "Finish the media and internal notes before publishing the KOL profile.";
  };

  return (
    <>
      <Dialog open={kolModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col overflow-hidden rounded-[28px] border border-border bg-card p-0 shadow-2xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-w-5xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Add KOL
              </DialogTitle>
              <DialogDescription className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                KOL will be visible to dentists immediately.
              </DialogDescription>
            </div>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </DialogClose>
          </div>

          <div className="border-b border-border px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid grid-cols-4 gap-1 sm:gap-4">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                  <div
                    key={step}
                    className="relative flex flex-col items-center text-center"
                  >
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-[calc(50%+1.25rem)] top-4 h-px w-[calc(100%-2.5rem)] sm:top-5 ${
                          isCompleted ? "bg-(--light-green)" : "bg-border"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex size-8 items-center justify-center rounded-full border text-sm font-semibold sm:size-10 ${
                        isCompleted
                          ? "border-(--light-green) bg-(--light-green) text-white"
                          : isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="m5 12 4 4 10-10" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>

                    <p
                      className={`mt-2 max-w-28 text-[11px] font-semibold leading-tight sm:mt-3 sm:max-w-none sm:text-sm ${
                        isCompleted
                          ? "text-(--light-green)"
                          : isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-6">
              <p className="text-sm font-medium text-foreground sm:text-base">
                {getStepSubtitle()}
              </p>
            </div>

            <div className="px-4 py-5 sm:px-6 sm:py-6">
              {addKolStep === "Basic Info" && (
                <BasicInfoForm
                  data={formData.basicInfo}
                  onChange={updateBasicInfo}
                />
              )}

              {addKolStep === "Bio & Languages" && (
                <BioLanguageInfoForm
                  data={formData.bioLanguage}
                  onChange={updateBioLanguage}
                />
              )}

              {addKolStep === "Contact" && (
                <ContactInfoForm
                  data={formData.contact}
                  onMethodChange={(method) =>
                    updateContact("contactMethod", method)
                  }
                  onFieldChange={updateContact}
                />
              )}

              {addKolStep === "Media & Notes" && (
                <MediaNotesInfoForm
                  fullName={formData.basicInfo.fullName}
                  photoFile={formData.media.photoFile}
                  linkedinUrl={formData.media.linkedinUrl}
                  websiteUrl={formData.media.websiteUrl}
                  internalNotes={formData.media.internalNotes}
                  onPhotoChange={(file) => updateMedia("photoFile", file)}
                  onFieldChange={updateMedia}
                />
              )}
            </div>
          </div>

          <div className="border-t border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={currentStepIndex === 0 ? handleClose : handlePrevious}
                variant="outline"
                className="h-12 w-full rounded-xl border-input px-5 text-base font-medium text-foreground sm:w-auto"
              >
                {currentStepIndex === 0 ? "Cancel" : "Back"}
                {currentStepIndex > 0 && <ArrowLeft className="size-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground sm:text-base">
                Step {currentStepIndex + 1} of {steps.length}
              </p>

              <Button
                onClick={isLastStep ? handleSubmit : handleNext}
                className="h-12 w-full cursor-pointer rounded-xl bg-primary px-5 text-base font-medium text-sidebar-primary-foreground sm:w-auto"
              >
                {getStepButtonLabel()}
                {!isLastStep && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSuccessModal}
        onOpenChange={(open) => !open && handleSuccessClose()}
      >
        <DialogContent
          showCloseButton={false}
          className="flex w-[calc(100vw-1rem)] max-w-none flex-col items-center rounded-[28px] border-none bg-card p-0 shadow-2xl sm:max-w-2xl"
        >
          <DialogTitle className="sr-only">
            KOL profile submission successful
          </DialogTitle>

          <div className="flex w-full flex-col items-center px-5 py-10 text-center sm:px-10 sm:py-12">
            <div className="mb-8 grid size-20 place-items-center rounded-full bg-primary shadow-lg sm:size-24">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-10 text-primary-foreground sm:size-12"
              >
                <path d="m20 6-11 11-5-5" />
              </svg>
            </div>

            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
              KOL Profile Submitted Successfully
            </h2>

            <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
              Your KOL application is now under review. You will be notified
              once your profile is approved and live in the system.
            </p>

            <Button
              type="button"
              onClick={handleSuccessClose}
              className="mt-8 h-12 rounded-xl bg-primary px-7 text-base font-medium text-primary-foreground hover:bg-sidebar-primary"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
