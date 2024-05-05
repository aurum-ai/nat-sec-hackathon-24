import Logo from '../logo';
import styles from './sidebar.module.scss';
import SidebarButton from './sidebar-button';
import { TbMap, TbActivity, TbSettings } from "react-icons/tb"

export default function Sidebar() {
  return (
    <nav className={styles.container}>
      <div className={styles.buttonContainer}>
        <div className={styles.logoContainer}>
          <Logo small={true} />
        </div>
        <SidebarButton icon={<TbMap />} link="/map" label="Map" />
        <SidebarButton icon={<TbActivity />} link="/activity" label="Activity" />
      </div>
      <div className={styles.buttonContainer}>
        <SidebarButton icon={<TbSettings />} link="/settings" label="Setting" />
      </div>
    </nav>
  );
}