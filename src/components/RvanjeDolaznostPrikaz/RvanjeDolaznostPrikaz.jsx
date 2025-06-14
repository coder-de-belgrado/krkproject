'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function RvanjeDolaznostPrikaz({ clanId, refreshKey }) {
  const supabase = createClient()
  const [dolasci, setDolasci] = useState([])

  useEffect(() => {
    if (!clanId) return
    const fetchDolasci = async () => {
      const { data, error } = await supabase
        .from('rvanje_dolaznost')
        .select('dolaznost_type, dolaznost_datum')
        .eq('dolaznost_clan', clanId)
        .order('dolaznost_datum', { ascending: false })

      if (!error) {
        setDolasci(data)
      } else {
        console.error('Greska pri dohvatanju dolazaka', error)
      }
    }

    fetchDolasci()
  }, [clanId, refreshKey])

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Evidencija dolazaka</h2>
      {dolasci.length === 0 ? (
        <p className="text-sm text-gray-500">Nema zabele\u017Eenih dolazaka.</p>
      ) : (
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Datum</th>
              <th className="p-2 border">Tip</th>
            </tr>
          </thead>
          <tbody>
            {dolasci.map((d, idx) => (
              <tr key={idx}>
                <td className="p-2 border">
                  {new Date(d.dolaznost_datum).toLocaleString()}
                </td>
                <td className="p-2 border">{d.dolaznost_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
