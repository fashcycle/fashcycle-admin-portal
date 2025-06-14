import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import addDeleteGetLocalStorage from "./addDeleteGetLocalStorage";
import { STORAGE } from "./localVariables";
import { CONSTANTS } from "../utils/constants";
import { decodedToken, DecodedJWT } from "../utils/tokenDecode";
import { API_KEY, BASE_URL } from "../BaseUrl";

/**
 * Clears local and session storage and redirects to home.
 */
export const sessionLogout = (): void => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";
};

/**
 * Saves the current timestamp as session time in local storage.
 */
const startSessionTime = (): void => {
  const time = new Date().getTime().toString();
  addDeleteGetLocalStorage(STORAGE.SESSION_TIME, time, "add", "single");
};

/**
 * Makes a third-party HTTP request using Axios.
 */
export const ThirdPartyRequest = async (
  url: string,
  method: "get" | "post" | "put" | "delete" = "get",
  headers: Record<string, string> = {},
  data: any = {},
  options: AxiosRequestConfig = {}
): Promise<any> => {
  startSessionTime();

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    data,
    ...options,
  };

  try {
    const response: AxiosResponse = await axios(config);
    if (response?.data?.status === 401) sessionLogout();
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 401) sessionLogout();
    throw err;
  }
};

/**
 * Refreshes the access token using a GET call.
 */
export const TokenRefresh = async (
  url: string,
  headers: Record<string, string>
): Promise<void> => {
  try {
    const res = await axios.get(url, { headers });
    if (res?.data?.status === "SUCCESS") {
      const accessToken = res?.data?.data?.token;
      addDeleteGetLocalStorage(STORAGE.USER_TOKEN, accessToken, "add", "single");
    } else {
      console.error(res);
    }
  } catch (err) {
    console.error(err);
    localStorage.clear();
  }
};

/**
 * Global API request function that manages token, headers, and error handling.
 */
const globalRequest = (
  url: string,
  method: "get" | "post" | "put" | "delete" = "get",
  data: any = {},
  options: AxiosRequestConfig = {},
  token: boolean = true
): Promise<any> => {
  const headers: Record<string, string> = {
    "x-api-key": API_KEY,
  };

  const userToken = addDeleteGetLocalStorage(STORAGE.USER_TOKEN, {}, "get") as string | null;

  if (token && userToken) {
    headers.authorization = `Bearer ${userToken}`;

    const decoded = decodedToken(userToken) as DecodedJWT | null;
    if (decoded?.exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTimestamp;
      if (timeLeft > 0 && timeLeft < 18000) {
        // TokenRefresh(BASE_URL + "/refresh-token", headers); // Optional refresh logic
      }
    }
  }

  const sendData: AxiosRequestConfig = {
    method,
    url: BASE_URL + url,
    headers,
    ...options,
  };

  if (data && ["post", "put"].includes(method)) {
    sendData.data = data;
  }

  startSessionTime();

  return axios(sendData)
    .then((response) => {
      if ([200, 201].includes(response?.status)) {
        return response.data;
      }
      return { data: null, message: CONSTANTS.errMsg };
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) sessionLogout();
      throw err;
    });
};

export default globalRequest;
