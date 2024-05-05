'use client'

import { KeyboardEventHandler, useState } from 'react';
import styles from './settings.module.scss';
import TriggerComp, { Trigger } from './trigger';

function generateId() {
  return (Math.random() + 1).toString(36);
}


export default function Settings() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [input, setInput] = useState('');

  const addTrigger = () => {
    const newTrigger = { id: generateId(), description: input };
    setTriggers(prev => [...prev, newTrigger]);
    setInput('');
  };

  const removeTrigger = (trigger: Trigger) => {
    setTriggers(prev => prev.filter(elem => elem.id !== trigger.id))
  };

  const handleEnterHit = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTrigger();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Configuration</h1>
        {triggers.map(trigger => (
          <TriggerComp trigger={trigger} key={trigger.id} onClick={removeTrigger} />
        ))}
        {triggers.length === 0 && <p>No triggers currently set.</p>}
      </div>

      <div className={styles.inputContainer}>
        <input type="text" className={styles.input} value={input} onChange={(event) => setInput(event.target.value)} onKeyUp={handleEnterHit} />
      </div>
    </div>
  );
}