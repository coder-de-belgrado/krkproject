'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function RvanjeUnosDetalja({ clanId }) {
  const supabase = createClient()

  const [imeRoditelja, setImeRoditelja] = useState('')
  const [kontaktRoditelja, setKontaktRoditelja] = useState('')
  const [kontaktClana, setKontaktClana] = useState('')
  const [jmbg, setJmbg] = useState('')
  const [slikaClanaUrl, setSlikaClanaUrl] = useState('')
  const [slikaKartonPath, setSlikaKartonPath] = useState('')
  const [slikaDokumentPath, setSlikaDokumentPath] = useState('')
  const [status, setStatus] = useState(null)

  async function uploadFile(file, bucket, folder) {
    const filePath = `${folder}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      console.error('Greška pri uploadu u bucket:', bucket, uploadError)
      return ''
    }

    if (bucket === 'clanovi-javno') {
      const { data: urlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath)
      console.log('Javni URL:', urlData.publicUrl)
      return urlData.publicUrl
    } else {
      console.log('Privatni path:', filePath)
      return filePath
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    console.log('Podaci koji se upisuju u detalje:', {
      clan_id: clanId,
      ime_roditelja: imeRoditelja,
      kontakt_roditelja: kontaktRoditelja,
      kontakt_clana: kontaktClana,
      jmbg,
      slika_clana_url: slikaClanaUrl,
      slika_karton_url: slikaKartonPath,
      slika_dokument_url: slikaDokumentPath,
    })

    const { error } = await supabase.from('rvanje_clan_detalji').insert([
      {
        clan_id: clanId,
        ime_roditelja: imeRoditelja || null,
        kontakt_roditelja: kontaktRoditelja || null,
        kontakt_clana: kontaktClana || null,
        jmbg: jmbg || null,
        slika_clana_url: slikaClanaUrl || null,
        slika_karton_url: slikaKartonPath || null,
        slika_dokument_url: slikaDokumentPath || null,
      },
    ])

    if (error) {
      console.error('Greška prilikom upisa u bazu:', error)
      setStatus('❌ Greška prilikom unosa.')
    } else {
      setStatus('✅ Uspešno uneto!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Ime roditelja"
        value={imeRoditelja}
        onChange={(e) => setImeRoditelja(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="text"
        placeholder="Kontakt roditelja"
        value={kontaktRoditelja}
        onChange={(e) => setKontaktRoditelja(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="text"
        placeholder="Kontakt člana"
        value={kontaktClana}
        onChange={(e) => setKontaktClana(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="text"
        placeholder="JMBG"
        value={jmbg}
        onChange={(e) => setJmbg(e.target.value)}
        className="w-full border p-2"
      />

      <label className="block font-medium">📸 Slika člana (javna)</label>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0]
          const url = await uploadFile(file, 'clanovi-javno', 'profilne')
          setSlikaClanaUrl(url)
        }}
      />

      <label className="block font-medium">🗂️ Registracioni karton (privatno)</label>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0]
          const path = await uploadFile(file, 'clanovi-privatno', 'kartoni')
          setSlikaKartonPath(path)
        }}
      />

      <label className="block font-medium">🆔 Lična karta (privatno)</label>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0]
          const path = await uploadFile(file, 'clanovi-privatno', 'licne')
          setSlikaDokumentPath(path)
        }}
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Sačuvaj detalje
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  )
}
