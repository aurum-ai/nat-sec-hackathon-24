import styles from './logo.module.scss';
import localFont from "next/font/local";

const logoFont = localFont({
  src: "./equinox-regular.woff",
  display: "swap",
});

export default function Logo({ small }: LogoProps) {
  const text = small ? 'A' : 'Aurum';
  return <div className={`${logoFont.className} ${styles.container}`}>{text}</div>;
}

type LogoProps = {
  small: boolean,
};

