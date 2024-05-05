import styles from './trigger.module.scss';
import { TbCircleX } from "react-icons/tb";

export type Trigger = {
  id: string;
  description: string;
};

export default function Trigger({ trigger, onClick }: TriggerProps) {
  const click = () => {
    if (onClick) {
      onClick(trigger);
    }
  };

  return (
    <div className={styles.container} onClick={click}>
      <div className={styles.content}>
        {trigger.description}
      </div>
      <button className={styles.removeButton}>
        <TbCircleX />
      </button>
    </div>
  );
}

type TriggerProps = {
  trigger: Trigger;
  onClick?: (trigger: Trigger) => void;
};