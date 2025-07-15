import { redirect } from 'next/navigation';

// import Link from 'next/link';
// import { Button } from '@/core/components/ui/button';

export default async function MainPage() {
  // return (
  //   <div className="flex-center flex-col flex-1 gap-4 cursor-default">
  //     <Link href="/dudo">
  //       <Button variant="accent">Dudo / Perudo</Button>
  //     </Link>
  //   </div>
  // );

  return redirect('/dudo');
}
