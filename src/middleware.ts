import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const runtime = "experimental-edge";

const isPrivateRoute = createRouteMatcher([''])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url)
  
  // 检查是否是 /login 路径
  if (url.pathname === '/login') {
    // 检查当前域名是否需要重定向
    if (url.hostname.endsWith('qbzx.dpdns.org') && url.hostname !== 'blog.qbzx.dpdns.org' || 
        url.hostname.endsWith('restonehub.top')) {
      // 构建重定向URL
      const redirectUrl = new URL(url.pathname, 'https://blog.qbzx.dpdns.org')
      // 保留所有查询参数
      redirectUrl.search = url.search
      
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  if (isPrivateRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};