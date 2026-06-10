'use server'

import { login, setSessionCookie, logout as doLogout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(_prev: unknown, formData: FormData) {
  const modo = String(formData.get('modo') || 'legajo')

  if (modo === 'rfid') {
    const rfid = String(formData.get('rfid') || '').trim()
    if (!rfid) return { error: 'Acerque la tarjeta RFID al lector.' }
    const res = await login({ rfid })
    if (!res) return { error: 'Tarjeta RFID no reconocida.' }
    await setSessionCookie(res.sessionId)
  } else {
    const legajo = String(formData.get('legajo') || '').trim()
    const pin = String(formData.get('pin') || '').trim()
    if (!legajo) return { error: 'Ingrese su número de legajo.' }
    const res = await login({ legajo, pin })
    if (!res) return { error: 'Legajo o PIN incorrectos.' }
    await setSessionCookie(res.sessionId)
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  await doLogout()
  redirect('/login')
}
