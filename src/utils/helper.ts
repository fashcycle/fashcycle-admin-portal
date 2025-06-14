import moment from "moment";

export const helpers = {
  validateEmail: (email: string): boolean => {
    const mail = email?.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(mail);
  },

  validatePassword: (password: string): boolean => {
    if (!password || password.length < 10 || password.length > 25) return false;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9@#$%^&*!()+=_-]{10,25}$/;
    return passwordRegex.test(password);
  },

  image_to_base64: async (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => console.error(error);
      reader.readAsDataURL(file);
    });
  },

  reduce_image_file_size: async (
    base64Str: string,
    MAX_WIDTH = 650,
    MAX_HEIGHT = 650
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  },

  handleUploadImage: async (base64Img: string): Promise<{ res: string; data: string }> => {
    const compressed = await helpers.reduce_image_file_size(base64Img);
    const binaryData = atob(compressed.split(",")[1]);
    const sizeInMB = (binaryData.length / (1024 * 1024)).toFixed(2);
    return parseFloat(sizeInMB) <= 5
      ? { res: "success", data: compressed }
      : { res: "error", data: "File size should be less than 5MB" };
  },

  removeCountryCode: (phone: string, code: string): string =>
    phone?.startsWith(code) ? phone.slice(code.length) : phone,

  removeNonAlphabets: (text: string): string => text.replace(/[^a-zA-Z\s]/g, ""),

  getTextLengthOfTextEditor: (text: string): number =>
    text.replace(/<[^>]*>/g, "").replace(/\n/g, "").length,

  debounceFunction: <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  getDayOfWeek: (dateStr: string, type: "short" | "full" = "short"): string | null => {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split("/");
    const date = new Date(`${y}-${m}-${d}`);
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIdx = date.getDay();
    return type === "full" ? fullDays[dayIdx] : shortDays[dayIdx];
  },

  handleOpenPdfInNewTab: (pdfUrl: string): void => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  convertToCSV: (data: Record<string, any>[]): string => {
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        const value = row[h];
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  },

  downloadCsvFile: (data: Record<string, any>[], fileName: string): void => {
    const csv = helpers.convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  },

  getDateRange: (option: string): { startDate: Date; endDate: Date } => {
    const today = new Date();
    let startDate = today;
    let endDate = today;

    switch (option) {
      case "this_week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "last_week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay() - 6));
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "last_month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
    }

    return { startDate, endDate };
  },

  getItemFromArray: <T>(array: T[], conditionFn: (item: T) => boolean): T | undefined => {
    return array.find(conditionFn);
  },

  deepCopy: <T>(obj: T): T => JSON.parse(JSON.stringify(obj)),

  removeSpecialCharactersFromString: (str: string): string =>
    str.replace(/[^a-zA-Z0-9\s]/g, ""),

  formatDate: (date: string | Date = new Date(), format = "DD/MM/YYYY"): string => {
    return moment(new Date(date)).format(format);
  },

  isDateLessThanToday: (inputDate: string, format = "MM/DD/YYYY"): boolean => {
    if (!inputDate) return false;
    const [part1, part2, part3] = inputDate.split("/");
    let day: number, month: number, year: number;

    if (format === "MM/DD/YYYY") {
      [month, day, year] = [parseInt(part1), parseInt(part2), parseInt(part3)];
    } else {
      [day, month, year] = [parseInt(part1), parseInt(part2), parseInt(part3)];
    }

    const input = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return input < today;
  },

  handelImgCrashErr: (e: Event, alternateImg: string): void => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = alternateImg;
  },

  formatDateFunction: (
    inputDate: string,
    format: "dd/mm/yyyy" | "yyyy-mm-dd" | "mm/dd/yyyy" = "dd/mm/yyyy",
    time: boolean = false
  ): string => {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return "Invalid Date";
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
  
    let timeOfDate = "";
    if (time) {
      let hours = date.getHours();
      const amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, "0");
      timeOfDate = `${hours}:${minutes} ${amOrPm}`;
    }
  
    let formattedDate = "";
  
    switch (format) {
      case "dd/mm/yyyy":
        formattedDate = `${day}/${month}/${year}`;
        break;
      case "yyyy-mm-dd":
        formattedDate = `${year}-${month}-${day}`;
        break;
      case "mm/dd/yyyy":
        formattedDate = `${month}/${day}/${year}`;
        break;
      default:
        formattedDate = `${day}/${month}/${year}`;
    }
  
    return time ? `${formattedDate}, ${timeOfDate}` : formattedDate;
  },
};
