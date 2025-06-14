'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const dolasciOpcije = [
  { value: 'trening', label: 'Trening' },
  { value: 'takmicenje', label: 'Takmi\u010Denje' },
  { value: 'odsustvo', label: 'Odsustvo' },
  { value: 'drugo', label: 'Drugo' },
]

export default function RvanjeDolaznostForm({ onSelectClan, onInserted }) {
  const supabase = createClient()
  const [clanovi, setClanovi] = useState([])
  const [selectedClanId, setSelectedClanId] = useState('')
  const [type, setType] = useState(dolasciOpcije[0].value)
  const [datum, setDatum] = useState(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const fetchClanovi = async () => {
      const { data, error } = await supabase
        .from('rvanje_clanovi')
        .select('id, ime, prezime')
      if (!error) {
        setClanovi(data)
      } else {
        console.error('Greska pri dohvatanju clanova', error)
      }
    }

    fetchClanovi()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedClanId) {
      setStatus('Izaberite clana')
      return
    }
    const { error } = await supabase.from('rvanje_dolaznost').insert([
      {
        dolaznost_type: type,
        dolaznost_clan: selectedClanId,
        dolaznost_datum: new Date(datum).toISOString(),
      },
    ])

    if (error) {
      console.error('Greska pri upisu dolaznosti:', error)
      setStatus('❌ Greska pri upisu')
    } else {
      setStatus('✅ Uspesno sacuvano')
      onInserted && onInserted()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <select
        value={selectedClanId}
        onChange={(e) => {
          setSelectedClanId(e.target.value)
          onSelectClan && onSelectClan(e.target.value)
        }}
        className="w-full border p-2"
      >
        <option value="">Odaberite \u010Clana</option>
        {clanovi.map((clan) => (
          <option key={clan.id} value={clan.id}>
            {clan.ime} {clan.prezime}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2"
      >
        {dolasciOpcije.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
        className="w-full border p-2"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Dodaj dolazak
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  )
}
