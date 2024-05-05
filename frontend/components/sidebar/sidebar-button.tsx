import Link from "next/link";
import { ReactNode } from "react";
import styles from './sidebar-button.module.scss';

export default function SidebarButton({ icon, link, label }: SidebarButtonProps) {
  return (
    <Link className={styles.link} href={link}>{icon}</Link>
  );
}

type SidebarButtonProps = {
  icon: ReactNode,
  link: string,
  label: string,
};