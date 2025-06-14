"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"

const supabase = createClient(
  "https://ramybslokcpwehmekpky.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const getImageUrl = (path) => {
  if (!path) return ""
  return `https://ramybslokcpwehmekpky.supabase.co/storage/v1/object/public/clanovi-javno/${encodeURIComponent(path)}`
}

export default function RvanjePrikazDetalja() {
  const [detalji, setDetalji] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("rvanje_clan_detalji")
        .select(
          "*, rvanje_clanovi (ime, prezime)"
        )

      if (error) {
        console.error("Greška pri dohvatanju podataka:", error)
      } else {
        setDetalji(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prikaz Detalja Članova</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detalji.map((detalj) => (
          <div
            key={detalj.id}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold mb-1">
              {detalj.rvanje_clanovi?.ime} {detalj.rvanje_clanovi?.prezime}
            </h2>
            <p className="text-sm mb-2">JMBG: {detalj.jmbg}</p>
            <p className="text-sm mb-2">Kontakt: {detalj.kontakt_clana}</p>
            <p className="text-sm mb-2">Roditelj: {detalj.ime_roditelja}</p>
            <p className="text-sm mb-2">
              Kontakt roditelja: {detalj.kontakt_roditelja}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Image
                src={getImageUrl(detalj.slika_clana_url)}
                alt="Slika člana"
                width={150}
                height={150}
                className="rounded"
                unoptimized
              />
              <Image
                src={getImageUrl(detalj.slika_karton_url)}
                alt="Registracioni karton"
                width={150}
                height={150}
                className="rounded"
                unoptimized
              />
              <Image
                src={getImageUrl(detalj.slika_dokument_url)}
                alt="Dokument"
                width={150}
                height={150}
                className="rounded"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
