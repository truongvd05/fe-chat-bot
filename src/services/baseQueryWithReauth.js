import baseQuery from "./baseQuery";
import { logOut } from "@/feature/User/userSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // access token hết hạn
  if (result.error && result.error?.status === 401) {
    // không có api refresh thì lock
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        if (!refresh_token) {
          console.log("NO REFRESH TOKEN");
          api.dispatch(logOut());
          localStorage.clear();
          return result;
        }
        // gọi refresh token
        console.log("refresh token");
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refresh_token },
          },
          api,
          extraOptions,
        );
        console.log(refreshResult);

        // refresh thành công
        if (refreshResult.data) {
          localStorage.setItem("access_token", refreshResult.data.access_token);
        }
        // retry request cũ
        result = await baseQuery(args, api, extraOptions);
      } catch (err) {
        api.dispatch(logOut());
        localStorage.clear();
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
