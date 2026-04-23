import logger from "@/utils/logger";
import baseQuery from "./baseQuery";
import { logOut, setAccessToken } from "@/feature/User/userSlice";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { toast } from "sonner";

const mutex = new Mutex();

const publicQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status >= 500) {
    toast.error("Lỗi không xác định");
  }

  // access token hết hạn
  if (result.error && result.error?.status === 401) {
    // không có api refresh thì lock
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) {
          logger.log("NO REFRESH TOKEN");
          api.dispatch(logOut());
          return result;
        }

        // gọi refresh token
        const refreshResult = await publicQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refresh_token },
          },
          api,
          extraOptions,
        );

        logger.log("refreshResult:", refreshResult);
        // refresh thành công
        if (refreshResult.data) {
          api.dispatch(setAccessToken(refreshResult.data.data.access_token));
          // retry request cũ
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } catch (err) {
        api.dispatch(logOut());
      } finally {
        release();
      }
    } else {
      // nếu đang refresh thì api khác đợi
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export default baseQueryWithReauth;
