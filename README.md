# PrinNes

A web-based printing service order management system that streamlines order
tracking, queue management, and payment verification for print shops.
Customers submit print jobs online; admins manage the workflow in real-time
from order creation through queue processing to payment confirmation.

## Tech Stack

- **Vite** — build tool
- **React 19** — UI framework
- **React Router v7** — routing
- **Supabase** — database, auth, storage, realtime
- **TanStack React Query** — server state management
- **Tailwind CSS v4** — styling
- **Zod + react-hook-form** — form validation
- **recharts** — admin charts
- **lucide-react** — icons
- **date-fns** — date utilities
- **pdfjs-dist** — PDF page counting

## Features

**Customer**
- Create print orders with file uploads (PDF, DOCX, images)
- Configure print type (black & white / color), paper size (A4 / F4 / A3), and copies
- Auto-calculated pricing with page count detection
- Real-time queue number assignment (resets daily)
- QRIS payment with proof upload (triggers admin verification)
- Track active orders and view order history

**Admin**
- **Queue management** — process orders through menunggu → diproses → selesai
  with date-grouped layout and real-time updates
- **Payment verification** — review QRIS proof images, approve or reject with notes
- **Dashboard** — toggle store open/closed, paper usage estimates, hourly order
  chart, today's revenue from completed orders
- **Reports** — filter by date range (today / 7 days / month / all time), summary
  cards, print breakdown, revenue trend chart, CSV export
- **Price management** — update per-page pricing per print type and paper size

**Platform**
- Role-based authentication (customer / admin) with protected routes
- Real-time queue and store status updates via Supabase Realtime
- File storage in Supabase Storage buckets with size limits
- SPA routing with Vercel deployment support
