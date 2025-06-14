import encryptDCrypt from "./encryptDcrypt";

type LocalStorageType = "add" | "get" | "delete" | "remove";
type AddType = "single" | "multiple";

const addDeleteGetLocalStorage = (
  name: string,
  dataObj: any = {},
  type: LocalStorageType = "add",
  addType: AddType = "multiple"
): string | null | void => {
  if (type === "add") {
    if (addType === "single") {
      const encrypted = encryptDCrypt("en", typeof dataObj === "object" ? JSON.stringify(dataObj) : dataObj);
      localStorage.setItem(name, encrypted);
    } else {
      const existing = localStorage.getItem(name);
      if (existing !== null && existing !== undefined) {
        const decrypted = encryptDCrypt("de", existing);
        const parsed = JSON.parse(decrypted);
        const array = Array.isArray(parsed) ? parsed : [];
        array.push(dataObj);
        const encrypted = encryptDCrypt("en", JSON.stringify(array));
        localStorage.setItem(name, encrypted);
      } else {
        const encrypted = encryptDCrypt("en", JSON.stringify([dataObj]));
        localStorage.setItem(name, encrypted);
      }
    }
  } else if (type === "get") {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;
      return encryptDCrypt("de", value);
    } catch {
      return null;
    }
  } else if (type === "delete") {
    localStorage.removeItem(name);
  } else if (type === "remove") {
    const existing = localStorage.getItem(name);
    if (existing !== null && existing !== undefined) {
      const decrypted = encryptDCrypt("de", existing);
      const parsed = JSON.parse(decrypted);
      const filtered = parsed.filter((obj: any) => obj.id !== dataObj.id);
      const encrypted = encryptDCrypt("en", JSON.stringify(filtered));
      localStorage.setItem(name, encrypted);
    } else {
      localStorage.removeItem(name);
    }
  }
};

export default addDeleteGetLocalStorage;
