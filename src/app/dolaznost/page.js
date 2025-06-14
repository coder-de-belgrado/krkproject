'use client'

import { useState } from 'react'
import RvanjeDolaznostForm from '@/components/RvanjeDolaznostForm/RvanjeDolaznostForm'
import RvanjeDolaznostPrikaz from '@/components/RvanjeDolaznostPrikaz/RvanjeDolaznostPrikaz'

export default function DolaznostPage() {
  const [clanId, setClanId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="p-6">
      <RvanjeDolaznostForm
        onSelectClan={setClanId}
        onInserted={() => setRefreshKey((k) => k + 1)}
      />
      {clanId && <RvanjeDolaznostPrikaz clanId={clanId} refreshKey={refreshKey} />}
    </main>
  )
}
