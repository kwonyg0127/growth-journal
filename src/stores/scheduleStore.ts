import { initialScheduleData } from '@/data/initialScheduleData';
import { Plan } from '@/types/plan';
import { TODAY_STRING } from '@/utils/date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ScheduleStore = {
  scheduleData: Record<string, Plan[]>;
  selectedDate: string;
  setScheduleData: (data: Record<string, Plan[]>) => void;
  setSelectedDate: (date: string) => void;
  addPlan: (date: string, plan: Plan) => void;
  deletePlan: (date: string, planId: string) => void; // 🔥 추가
  updatePlan: (date: string, updatedPlan: Plan) => void; // 🔥 추가
};

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      scheduleData: initialScheduleData,
      selectedDate: TODAY_STRING,
      setScheduleData: (data) => set({ scheduleData: data }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      addPlan: (date, plan) =>
        set((state) => {
          const existing = state.scheduleData[date] || [];
          const updated = [...existing, plan].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          );
          return { scheduleData: { ...state.scheduleData, [date]: updated } };
        }),
        
      // 🔥 삭제 함수
      deletePlan: (date, planId) =>
        set((state) => {
          const existing = state.scheduleData[date] || [];
          const updated = existing.filter((p) => p.id !== planId);
          return { scheduleData: { ...state.scheduleData, [date]: updated } };
        }),
        
      // 🔥 수정 함수 (미리 구현해둠)
      updatePlan: (date, updatedPlan) =>
        set((state) => {
          const existing = state.scheduleData[date] || [];
          const updated = existing
            .map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          return { scheduleData: { ...state.scheduleData, [date]: updated } };
        }),
    }),
    {
      name: 'growth-journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);