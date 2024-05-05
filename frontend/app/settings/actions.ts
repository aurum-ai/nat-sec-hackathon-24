'use server'

import { Trigger } from './trigger';

export async function getTriggers(): Promise<Trigger[]> {
  const result = await fetch('http://127.0.0.1:5000/get_triggers').then(res => res.json());
  return result.triggers;
}

export async function addTrigger(trigger: Trigger): Promise<boolean> {
  const result = await fetch('http://127.0.0.1:5000/add_trigger', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trigger),
  }).then(res => res.json());
  return result.success;
}

export async function removeTrigger(triggerId: string): Promise<boolean> {
  const result = await fetch('http://127.0.0.1:5000/remove_trigger', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ triggerId }),
  }).then(res => res.json());
  return result.success;
} 