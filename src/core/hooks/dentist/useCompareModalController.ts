import { useState, useEffect } from "react";
import { useStateContext } from "@/providers/StateProvider";
import { useDentistComparison } from "./useDentistComparison";
import { type Dentist } from "@/features/marketing/_components/find-dentists-page-components/types";

export function useCompareModalController() {
  const {
    showCompareModal,
    setShowCompareModal,
    setShowBookingModal,
    setSelectedDentistId,
    compareModalPurpose,
    setCompareModalPurpose,
    selectedDentistId,
    schedule,
    dentistsToCompare,
    setBookingMode,
  } = useStateContext();

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [unverifiedDentist, setUnverifiedDentist] = useState<Dentist | null>(null);

  const isPostBooking = compareModalPurpose === "postBooking";

  const { selectedDentist, otherDentists, isLoading, isError, refetch } = useDentistComparison({
    selectedDentistId,
    dentistsToCompare,
    enabled: showCompareModal,
  });

  const isUnclaimedDirectory = (d: Dentist) => {
    return d.status === "UNVERIFIED" && !d.claimedByUserId && d.accountType === "CLAIMABLE";
  };

  useEffect(() => {
    if (!showCompareModal) {
      setUnverifiedDentist(null);
      return;
    }

    if (dentistsToCompare.length > 0) {
      const unclaimed = dentistsToCompare.find(isUnclaimedDirectory);
      if (unclaimed) {
        setUnverifiedDentist(unclaimed);
        setDentists([]);
        setSelectedIds([]);
        return;
      }
      setDentists(dentistsToCompare);
      setSelectedIds(dentistsToCompare.map((d) => d.id));
      return;
    }

    if (isLoading) return;

    if (selectedDentist && isUnclaimedDirectory(selectedDentist)) {
      setUnverifiedDentist(selectedDentist);
      setDentists([]);
      setSelectedIds([]);
      return;
    }

    const filteredOthers = otherDentists.filter(
      (d: Dentist) => d.id !== selectedDentistId && !isUnclaimedDirectory(d)
    );

    let finalList: Dentist[] = [];
    if (isPostBooking && selectedDentist) {
      finalList = [selectedDentist, ...filteredOthers.slice(0, 2)];
      setSelectedIds([selectedDentist.id]);
    } else {
      finalList = selectedDentist
        ? [selectedDentist, ...filteredOthers.slice(0, 2)]
        : filteredOthers.slice(0, 3);
      setSelectedIds(selectedDentist ? [selectedDentist.id] : []);
    }

    setDentists(finalList.filter((d: Dentist) => !isUnclaimedDirectory(d)));
  }, [showCompareModal, dentistsToCompare, selectedDentist, otherDentists, isLoading, isPostBooking, selectedDentistId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const handleOpenChange = (open: boolean) => {
    setShowCompareModal(open);
    if (!open) {
      setUnverifiedDentist(null);
    }
  };

  return {
    showCompareModal,
    compareModalPurpose,
    selectedIds,
    dentists,
    unverifiedDentist,
    isLoading,
    isError,
    schedule,
    isPostBooking,
    toggleSelect,
    handleOpenChange,
    setSelectedDentistId,
    setBookingMode,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    refetch,
  };
}
