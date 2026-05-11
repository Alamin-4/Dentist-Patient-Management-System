import type { NextConfig } from "next";
/*

## Error Type
Runtime Error

## Error Message
Invalid src prop (https://i.pravatar.cc/150?u=1) on `next/image`, hostname "i.pravatar.cc" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host


    at <unknown> (src/app/(public)/_components/module/DentistAllComponents/DentistProfile/ReviewSection.tsx:71:17)
    at Array.map (<anonymous>:null:null)
    at ReviewSection (src/app/(public)/_components/module/DentistAllComponents/DentistProfile/ReviewSection.tsx:67:17)
    at DentistProfile (src/app/(public)/_components/module/DentistAllComponents/DentistProfile/ProfilePage.tsx:17:11)
    at ViewDentistProfile (src/app/(public)/find-dentist/[slug]/page.tsx:38:7)

## Code Frame
  69 |             <div className="flex items-center gap-3">
  70 |               <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relat...
> 71 |                 <Image
     |                 ^
  72 |                   src={`https://i.pravatar.cc/150?u=${review}`}
  73 |                   alt="User"
  74 |                   fill

Next.js version: 16.2.4 (Turbopack)
*/
const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc"],
  },
};

export default nextConfig;
