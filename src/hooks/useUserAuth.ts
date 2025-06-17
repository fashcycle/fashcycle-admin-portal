import globalRequest from "../services/globalRequest";
import addDeleteGetLocalStorage from "../services/addDeleteGetLocalStorage";
import { STORAGE } from "../services/localVariables";
import apiRoutes from "../utils/apiRoutes";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";

interface LoginResponse {
  token: string;
  user: any;
}

export const useUserAuth = () => {
  const { setLoading, setMessage } = useAppState();
  const { setAuthDetails } = useAuth();

  // ✅ Admin Login API
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await globalRequest(
        apiRoutes.login, // ✅ use from apiRoutes
        "post",
        { email, password },
        {},
        false
      );

      const { token, user }: LoginResponse = response;
      setAuthDetails(user, token);
      addDeleteGetLocalStorage(STORAGE.USER_TOKEN, token, "add", "single");
      addDeleteGetLocalStorage(
        STORAGE.USER_DETAILS,
        user,
        "add",
        "single"
      );
      

      setMessage("Login successful!", "success");
      return { success: true, user: user };
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      setMessage(message, "error");
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password API
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      await globalRequest(
        apiRoutes.changePassword, // ✅ use from apiRoutes
        "post",
        { currentPassword, newPassword }
      );

      setMessage("Password changed successfully", "success");
      return { success: true, message: "Password changed successfully" };
    } catch (err: any) {
      const message = err?.response?.data?.message || "Password change failed";
      setMessage(message, "error");
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    changePassword,
  };
};
