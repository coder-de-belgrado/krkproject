'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function RootLayout({ children }) {
  useEffect(() => {
    const supabase = createClient()

    // Pokreće sesiju da bi Supabase znao da je korisnik "authenticated"
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Aktivna sesija:', session)
      if (error) console.error('Greška pri dobijanju sesije:', error)
    })
  }, [])

  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  )
}
