'use client'

import { useEffect, useState } from 'react';
import styles from './settings.module.scss';
import TriggerComp, { Trigger } from './trigger';
import { getTriggers, addTrigger, removeTrigger } from './actions';

function generateId() {
  return (Math.random() + 1).toString(36);
}

export default function Settings() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    getTriggers().then(results => {
      setTriggers(results);
    })
  }, []);

  const createTrigger = () => {
    const newTrigger = { id: generateId(), description: input };
    addTrigger(newTrigger);
    setTriggers(prev => [...prev, newTrigger]);
    setInput('');
  };

  const deleteTrigger = (trigger: Trigger) => {
    removeTrigger(trigger.id);
    setTriggers(prev => prev.filter(elem => elem.id !== trigger.id))
  };

  const handleEnterHit = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      createTrigger();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Configuration</h1>
        {triggers.map(trigger => (
          <TriggerComp trigger={trigger} key={trigger.id} onClick={deleteTrigger} />
        ))}
        {triggers.length === 0 && <p>No triggers currently set.</p>}
      </div>

      <div className={styles.inputContainer}>
        <input type="text" className={styles.input} value={input} onChange={(event) => setInput(event.target.value)} onKeyUp={handleEnterHit} />
      </div>
    </div>
  );
}