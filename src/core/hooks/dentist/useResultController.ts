import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDentistPatients } from "@/core/hooks/dentist/useDentist";
import { useDentistResults } from "./useDentistResults";
import toast from "react-hot-toast";

const resultSchema = z.object({
  title: z.string().min(1, "Treatment title is required"),
  patientName: z.string().min(1, "Patient name is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  beforeImage: z.any().refine((val) => val instanceof File || typeof val === "string", "Before image is required"),
  afterImage: z.any().refine((val) => val instanceof File || typeof val === "string", "After image is required"),
});

export type ResultFormValues = z.infer<typeof resultSchema>;

export function useResultController() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const { results, isLoading, isError, refetch, createMutation } = useDentistResults();
  const { data: patientsData } = useDentistPatients();

  const patients = useMemo(() => patientsData?.data || [], [patientsData]);

  const methods = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      title: "",
      patientName: "",
      date: "",
      location: "",
      beforeImage: null,
      afterImage: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const selectedPatientName = watch("patientName");
  const beforeImageValue = watch("beforeImage");
  const afterImageValue = watch("afterImage");

  const selectedPatient = useMemo(() => {
    return patients.find((p: any) => p.name === selectedPatientName);
  }, [selectedPatientName, patients]);

  const dateOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.appointmentDate) opts.add(selectedPatient.appointmentDate);
    if (selectedPatient.schedule?.date && selectedPatient.schedule.date !== "Not Scheduled") {
      opts.add(selectedPatient.schedule.date);
    }
    if (selectedPatient.travelingDates && selectedPatient.travelingDates !== "TBD") {
      opts.add(selectedPatient.travelingDates);
    }
    return Array.from(opts);
  }, [selectedPatient]);

  const locationOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.country) opts.add(selectedPatient.country);
    return Array.from(opts);
  }, [selectedPatient]);

  const treatmentTitleOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.procedure) {
      selectedPatient.procedure.split(",").forEach((p: string) => {
        const trimmed = p.trim();
        if (trimmed) opts.add(trimmed);
      });
    }
    if (Array.isArray(selectedPatient.estimateBreakdown)) {
      selectedPatient.estimateBreakdown.forEach((item: any) => {
        if (item.label) opts.add(item.label.trim());
      });
    }
    if (opts.size === 0) {
      opts.add("Dental Treatment");
    }
    return Array.from(opts);
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedPatient) {
      setValue("date", dateOptions[0] || "", { shouldValidate: true });
      setValue("location", locationOptions[0] || "", { shouldValidate: true });
      setValue("title", treatmentTitleOptions[0] || "", { shouldValidate: true });
    } else {
      setValue("date", "");
      setValue("location", "");
      setValue("title", "");
    }
  }, [selectedPatient, dateOptions, locationOptions, treatmentTitleOptions, setValue]);

  useEffect(() => {
    if (beforeImageValue instanceof File) {
      const url = URL.createObjectURL(beforeImageValue);
      setBeforePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!beforeImageValue) {
      setBeforePreview(null);
    }
  }, [beforeImageValue]);

  useEffect(() => {
    if (afterImageValue instanceof File) {
      const url = URL.createObjectURL(afterImageValue);
      setAfterPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!afterImageValue) {
      setAfterPreview(null);
    }
  }, [afterImageValue]);

  const resetForm = () => {
    reset({
      title: "",
      patientName: "",
      date: "",
      location: "",
      beforeImage: null,
      afterImage: null,
    });
    setBeforePreview(null);
    setAfterPreview(null);
  };

  const onSubmit = async (data: ResultFormValues) => {
    try {
      toast.loading("Uploading photos and saving result...", { id: "upload-progress" });
      await createMutation.mutateAsync({
        title: data.title,
        patientName: data.patientName,
        date: data.date,
        location: data.location,
        beforeImageFile: data.beforeImage as File,
        afterImageFile: data.afterImage as File,
      });
      toast.success("Result added successfully");
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err?.message || "Failed to create result";
      if (errMsg.toLowerCase().includes("before image")) {
        methods.setError("beforeImage", { type: "server", message: errMsg });
      } else if (errMsg.toLowerCase().includes("after image")) {
        methods.setError("afterImage", { type: "server", message: errMsg });
      } else if (errMsg.toLowerCase().includes("file is too large") || errMsg.toLowerCase().includes("size")) {
        methods.setError("beforeImage", { type: "server", message: errMsg });
        methods.setError("afterImage", { type: "server", message: errMsg });
      } else {
        methods.setError("root", { type: "server", message: errMsg });
      }
    } finally {
      toast.dismiss("upload-progress");
    }
  };

  return {
    results,
    isLoading,
    isError,
    refetch,
    isModalOpen,
    setIsModalOpen,
    beforePreview,
    afterPreview,
    patients,
    selectedPatientName,
    treatmentTitleOptions,
    dateOptions,
    locationOptions,
    errors,
    methods,
    isPending: createMutation.isPending,
    register,
    handleSubmit,
    setValue,
    resetForm,
    onSubmit,
  };
}
