import kanjiData from '@/data/kanji-data.json'

// Mock API data for static export
const mockApiData = {
  '/api/kanji': () => {
    const limit = 50
    const offset = 0
    const kanjis = Object.values(kanjiData).flat()
    const paginatedKanjis = kanjis.slice(offset, offset + limit)
    
    return {
      success: true,
      data: paginatedKanjis,
      pagination: {
        total: kanjis.length,
        limit,
        offset,
        hasMore: offset + limit < kanjis.length
      },
      levels: {
        N5: kanjiData.N5.length,
        N4: kanjiData.N4.length,
        N3: kanjiData.N3.length,
        N2: kanjiData.N2.length,
        N1: kanjiData.N1.length
      }
    }
  }
}

export async function getMockApiResponse(path: string, searchParams?: URLSearchParams) {
  const mockFunction = mockApiData[path as keyof typeof mockApiData]
  if (mockFunction) {
    return mockFunction()
  }
  return null
}