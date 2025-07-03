import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPrivateRoute = createRouteMatcher(['/dashbord']);
const loginUrl = "https://www.qbzx-blog.top/login";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  
  // 检查是否是 /login 路径
  if (url.pathname === '/login') {
    // 检查当前域名是否需要重定向
    if (url.hostname.endsWith('qbzx-blog.top') && url.hostname !== 'www.qbzx-blog.top' || 
        url.hostname.endsWith('blog.qbzx.dpdns.org')) {
      // 构建重定向URL
      const redirectUrl = new URL(url.pathname, 'https://www.qbzx-blog.top');
      // 保留所有查询参数
      redirectUrl.search = url.search;
      
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  if (isPrivateRoute(req)) {
    await auth.protect()
    const redirectUrl = new URL(loginUrl);
    redirectUrl.search = url.search;
    return NextResponse.redirect(redirectUrl.toString());
  }


  return NextResponse.next();
});

