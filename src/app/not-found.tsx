import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Sorry, we couldn't find the page you are looking for.</p>
      <Link href="/">
        <Button className="">Back to Home</Button>
      </Link>
    </div>
  );
}
