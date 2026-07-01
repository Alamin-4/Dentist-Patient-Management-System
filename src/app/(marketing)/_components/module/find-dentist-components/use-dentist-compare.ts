// modules/find-dentist/hooks/use-dentist-compare.ts

import { useState, useCallback } from "react";
import { Dentist } from "../DentistAllComponents/types";


export const useDentistCompare = () => {
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [compareList, setCompareList] = useState<Dentist[]>([]);

    const toggleCompareMode = useCallback((value: boolean) => {
        setIsCompareMode(value);
        if (!value) setCompareList([]);
    }, []);

    const handleCompareToggle = useCallback((dentist: Dentist) => {
        setCompareList((prev) => {
            const exists = prev.some((item) => item.id === dentist.id);
            if (exists) return prev.filter((item) => item.id !== dentist.id);
            if (prev.length < 3) return [...prev, dentist];
            return prev;
        });
    }, []);

    const removeSelectedDentist = useCallback((id: string) => {
        setCompareList((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const clearCompare = useCallback(() => {
        setCompareList([]);
        setIsCompareMode(false);
    }, []);

    return {
        isCompareMode,
        compareList,
        toggleCompareMode,
        handleCompareToggle,
        removeSelectedDentist,
        clearCompare,
    };
};