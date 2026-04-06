import { redirect } from 'next/navigation';

// Root redirects to login — authenticated users are handled client-side
export default function Home() {
  redirect('/login');
}
