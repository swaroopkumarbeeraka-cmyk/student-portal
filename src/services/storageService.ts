const STORAGE_KEYS = {
  PREFERENCES: 'aits_student_preferences',
  AUTH: 'aits_student_auth',
  ACADEMIC_YEAR: 'aits_student_academic_year',
  TASKS: 'aits_student_tasks',
  COMPLAINTS: 'aits_student_complaints',
  NOTIFICATIONS: 'aits_student_notifications',
  SELF_DECLARATION: 'aits_student_self_declaration',
  FEES_2026: 'aits_student_fees_2026',
  FEES_2025: 'aits_student_fees_2025',
  CHAT_MESSAGES: 'aits_student_chat_messages',
  HALL_BOOKINGS: 'aits_student_hall_bookings',
  EXAM_FORMS: 'aits_student_exam_forms',
  PLACEMENT_REG: 'aits_student_placement_reg',
  DEMO_OVERRIDES: 'aits_student_demo_overrides'
};

export class StorageService {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Error reading localStorage key ${key}`, e);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving localStorage key ${key}`, e);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing localStorage key ${key}`, e);
    }
  }

  clearAllDemoData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => {
      localStorage.removeItem(k);
    });
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
