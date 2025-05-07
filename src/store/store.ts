import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type CampusData = {
  pk?: number;
  name?: string;
  logo?: string;
  bg_image?: string;
  campus_type?: string;
  program_slug?: string;
  campus_place?: string;
} | null;

type LoginData = {
  accessToken?: string | null;
  refreshToken?: string | null;
  userId?: number | null;
  isAuthenticated?: boolean;
  phoneNumber?: string;
  webCode?: string;
  promoCode?: string;
};

type LanguageData = {
  name: string;
  slug: string;
}

type ExamData = {
  admissionCode?: string;
  examId?: string;
  examCenterId?: string;
  subject?: string;
  timeRemaining?: number;
  status?: "not_started" | "in_progress" | "completed";
  ongoing_question?: string;
  is_exam_completed?: boolean;
  is_time_out?: boolean;
  current_question_number?: number;
  start_timestamp?: string;
  end_timestamp?: string;
  time_allotted?: number;
} | null;

type UserState = {
  campusData: CampusData;
  setCampusData: (data: Partial<CampusData>) => void;
  clearCampusData: () => void;

  loginData: LoginData;
  setLoginData: (data: Partial<LoginData>) => void;
  logout: () => void;

  examData: ExamData;
  setExamData: (data: Partial<ExamData>) => void;
  clearExamData: () => void;

  LanguageData: LanguageData;
  setLanguageData: (data: LanguageData) => void;
  clearLanguageData: () => void;
};

// Type-safe Zustand store with persist middleware
const useUserStore = create(
  persist(
    (set, get) => ({
      campusData: get()?.campusData ?? null,
      setCampusData: (data) =>
        set((state) => ({
          campusData: { ...state.campusData, ...data }, // Merge current state with updated data
        })),
      clearCampusData: () => set({ campusData: null }),

      loginData: {
        accessToken: null,
        refreshToken: null,
        userId: null,
        isAuthenticated: false,
        phoneNumber: '',
        webCode: '',
        promoCode: '',
      },
      setLoginData: (data) =>
        set((state) => ({
          loginData: { ...state.loginData, ...data },
        })),
      logout: () =>
        set({
          loginData: {
            accessToken: null,
            refreshToken: null,
            userId: null,
            isAuthenticated: false,
            phoneNumber: '',
            webCode: '',
            promoCode: '',
          },
        }),

      examData: {
        admissionCode: '',
        examId: '',
        subject: '',
        timeRemaining: 0,
        status: "not_started" as "not_started",
        ongoing_question: '',
        is_exam_completed: false,
        is_time_out: false,
        current_question_number: 1,
        start_timestamp: '',
        end_timestamp: '',
        time_allotted: 100,
        examCenterId: '',
      },
      setExamData: (data) =>
        set((state) => ({
          examData: { ...state.examData, ...data },
        })),
      clearExamData: () => set({ examData: null }),

      LanguageData: {
        name: "English",
        slug: "english"
      },
      setLanguageData: (data) =>
        set((state) => ({
          LanguageData: { ...state.LanguageData, ...data }, // Merge current state with updated data
        })),
      clearLanguageData: () => set({ LanguageData: { name: '', slug: '' } }),

    }),
    {
      name: "user-storage",
      getStorage: () => localStorage, // Make sure localStorage is being used
    } as PersistOptions<UserState>
  )
);

export default useUserStore;
