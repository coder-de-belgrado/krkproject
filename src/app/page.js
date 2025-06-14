'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function HomePage() {
  const [clanovi, setClanovi] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchClanovi() {
      const { data, error } = await supabase.from('rvanje_clanovi').select('*')

      if (error) {
        console.error('Greška pri dohvaćanju članova:', error)
      } else {
        setClanovi(data)
      }
    }

    fetchClanovi()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Članovi rvačkog kluba</h1>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Ime</th>
            <th className="p-2 border">Prezime</th>
            <th className="p-2 border">Datum rođenja</th>
          </tr>
        </thead>
        <tbody>
          {clanovi.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-2 text-center text-gray-500">
                Nema učitanih članova.
              </td>
            </tr>
          ) : (
            clanovi.map((clan) => (
              <tr key={clan.id}>
                <td className="p-2 border">{clan.ime}</td>
                <td className="p-2 border">{clan.prezime}</td>
                <td className="p-2 border">{clan.datum_rodjenja}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
