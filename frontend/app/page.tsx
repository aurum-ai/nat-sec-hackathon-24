import Link from 'next/link'
import "./page.module.scss"

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/map">Map</Link>
      </li>
    </ul>
  );
}
