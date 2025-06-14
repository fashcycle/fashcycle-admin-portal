import CryptoJS from "crypto-js";
import { LOCAL_SECRET } from "../BaseUrl";

type CryptoType = "en" | "de";

const encryptDCrypt = (type: CryptoType = "en", value: string = ""): string => {
  const secret = LOCAL_SECRET;
  if (type === "en") {
    return CryptoJS.AES.encrypt(value, secret).toString();
  } else {
    const decrypted = CryptoJS.AES.decrypt(value, secret);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};

export default encryptDCrypt;
