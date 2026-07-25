# JWT Access Token and Refresh Token Explanation (HttpOnly Cookies Enabled)

এই ফাইলে আপনার backend-এ ইমপ্লিমেন্ট করা **Access Token** এবং **Refresh Token** সিস্টেমের পুরো মেকানিজম সহজ ভাষায় (বাংলা এবং ইংরেজি মিক্সড) ব্যাখ্যা করা হলো। 

বর্তমানে প্রজেক্টে **সর্বোচ্চ সিকিউর ইন্ডাস্ট্রি স্ট্যান্ডার্ড (HttpOnly Cookies)** সাকসেসফুলি ইমপ্লিমেন্ট করা হয়েছে।

---

## ১. Access Token এবং Refresh Token কী? কেন দুটোই লাগবে?

| ফিচার | Access Token (অ্যাক্সেস টোকেন) | Refresh Token (রিফ্রেশ টোকেন) |
| :--- | :--- | :--- |
| **মূল কাজ** | Protected route (যেমন: `/auth/me`, `/portfolio`, ইত্যাদি API) অ্যাক্সেস করার জন্য ব্যবহৃত হয়। | Access token এক্সপায়ার হয়ে গেলে নতুন access token জেনারেট করতে ব্যবহৃত হয়। |
| **লাইফটাইম (Lifespan)** | খুবই কম সময় সচল থাকে (আপনার কোডে এটি **`15m`** বা ১৫ মিনিট করা আছে)। | অনেক বেশি সময় সচল থাকে (আপনার কোডে এটি **`7d`** বা ৭ দিন করা আছে)। |
| **সিকিউরিটি** | যদি হ্যাকার কোনোভাবে এটি চুরি করে, তবে সে সর্বোচ্চ ১৫ মিনিট অ্যাক্সেস পাবে। | ব্রাউজারের `HttpOnly` কুকিতে স্টোর করা থাকে। ফলে জাভাস্ক্রিপ্ট এটি পড়তে পারে না (XSS প্রুফ)। এটি দিয়ে সরাসরি কোনো API অ্যাক্সেস করা যায় না (শুধু `/auth/refresh` ছাড়া)। |

---

## ২. ব্যাকএন্ডে কীভাবে ইমপ্লিমেন্ট করা হয়েছে?

### ক) `main.ts` এ Cookie Parser রেজিস্টার করা হয়েছে:
কুকি রিড করার জন্য আমরা `cookie-parser` মিডলওয়্যার ইন্টিগ্রেট করেছি:
```typescript
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

### খ) `auth.controller.ts` এ কুকি সেট ও ডিলিট করা হচ্ছে:
যখন ইউজার `/auth/login` এ রিকোয়েস্ট পাঠায় অথবা `/auth/refresh` করে, ব্যাকএন্ড সরাসরি **`accessToken`** এবং **`refreshToken`** রেসপন্স হেডারে **HttpOnly Cookie** হিসেবে সেট করে দেয়:

```typescript
// Set Access Token cookie (15 mins)
res.cookie('accessToken', result.accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
});

// Set Refresh Token cookie (7 days)
res.cookie('refreshToken', result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

* **Logout করার সময়:** আমরা কুকি দুটিকে ক্লিয়ার করে দিচ্ছি:
```typescript
@Post('logout')
logout(@Res({ passthrough: true }) res: express.Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return { message: 'Logged out successfully' };
}
```

### গ) `jwt.strategy.ts` এবং `refresh-token.strategy.ts` এ টোকেন এক্সট্রাকশন (Hybrid Approach):
পাসপোর্ট স্ট্র্যাটেজিগুলো এখন **কুকি থেকে টোকেন এক্সট্র্যাক্ট করে**। তবে টেস্টিং সুবিধার জন্য (যেমন: Postman, Mobile App) আমরা **Bearer Token (Header)** ও সচল রেখেছি।

```typescript
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken']; // অথবা 'refreshToken'
  }
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};
```

---

## ৩. টোকেনগুলোর লাইফসাইকেল এবং ব্যবহারের ফ্লো (Sequence Flow)

নিচের ডায়াগ্রামটি লক্ষ্য করুন কীভাবে ব্রাউজার অটোমেটিক কুকি হ্যান্ডেল করে:

```
[ Frontend / Client (Browser) ]                               [ Backend API ]
               |                                                     |
               |----------------- 1. POST /auth/login -------------->|
               |<-- 2. Returns User + Sets HttpOnly Cookies ---------|
               |   (accessToken & refreshToken saved by Browser)     |
               |                                                     |
               |-- 3. GET /auth/me (Browser automatically sends)---->|
               |      (Cookie: accessToken=...)                      |
               |<---------------- 4. Profile Data (200) -------------|
               |                                                     |
        (15 minutes pass...)                                         |
               |                                                     |
               |-- 5. GET /auth/me (Cookie: accessToken=...)-------->|
               |<---------------- 6. Token Expired (401) ------------|
               |                                                     |
               |-- 7. POST /auth/refresh (Sends refreshToken cookie)->|
               |<-- 8. Returns 200 + Updates HttpOnly Cookies -------|
               |                                                     |
               |-- 9. GET /auth/me (Cookie: new accessToken=...)---->|
               |<---------------- 10. Profile Data (200) ------------|
```

---

## ৪. ফ্রন্টএন্ডে (React/Next.js) আপনার কী করা লাগবে?

যেহেতু ব্যাকএন্ড নিজেই কুকি সেট এবং রিড করছে, তাই ফ্রন্টএন্ডে টোকেন ম্যানেজ করার কোন ঝামেলা নেই! আপনাকে শুধু নিচের দুটি বিষয় নিশ্চিত করতে হবে:

### ক) Axios Instance এ `withCredentials: true` চালু রাখা:
এর মাধ্যমে ব্রাউজারকে অনুমতি দেওয়া হয় যাতে সে প্রতিটি রিকোয়েস্টের সাথে কুকি ব্যাকএন্ডে পাঠায়।

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // এটি অত্যন্ত গুরুত্বপূর্ণ!
});
```

### খ) Axios Interceptor দিয়ে ৪০১ (Unauthorized) হলে অটোমেটিক রিফ্রেশ কল করা:
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // যদি ৪০১ এরর আসে এবং আমরা অলরেডি রিফ্রেশ করার ট্রাই না করে থাকি
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // রিফ্রেশ রিকোয়েস্ট (Browser অটোমেটিক refreshToken কুকি পাঠাবে)
        await api.post('/auth/refresh');
        
        // রিফ্রেশ সফল হলে পূর্বের রিকোয়েস্টটি পুনরায় পাঠানো হবে
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Session expired. Redirecting to login...');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

---

## সংক্ষেপে সারসংক্ষেপ (TL;DR)

1. **কুকি স্টোরেজ সচল:** ব্যাকএন্ড এখন সফলভাবে লগইন এবং রিফ্রেশ হওয়ার সাথে সাথে `accessToken` এবং `refreshToken` কুকি ব্রাউজারে সেট করে দেয়।
2. **XSS নিরাপদ:** কুকিগুলো `HttpOnly` হওয়ায় জাভাস্ক্রিপ্ট হ্যাকিং স্ক্রিপ্ট দিয়ে এগুলো অ্যাক্সেস করা যাবে না।
3. **ডেভেলপার ফ্রেন্ডলি:** ফ্রন্টএন্ডে ম্যানুয়ালি কুকি স্টোর করার কোন কোড লিখতে হবে না। শুধু Axios রিকোয়েস্টে `withCredentials: true` ব্যবহার করলেই ব্রাউজার নিজে থেকেই সব কাজ ব্যাকগ্রাউন্ডে করবে।
