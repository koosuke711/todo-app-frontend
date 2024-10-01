// components/utils.ts
export function formatDate(dateString: string | undefined) {
    if (!dateString) return '未設定';
    try {
      const date = new Date(dateString.includes("+") ? dateString.split("+")[0] : dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString().split('T')[0];
    } catch {
      return '未設定';
    }
  }
  