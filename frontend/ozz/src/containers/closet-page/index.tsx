import { useInfiniteQuery, useQueries } from '@tanstack/react-query'
import { useCategorySidebar } from '@/contexts/CategorySidebarContext'
import CategorySidebar from '@/components/Button/CategorySidebar'
import ClothesRegistButton from '@/components/Button/ClothesRegistButton'
import ClothesList from '@/components/ClothesList'
import SearchArea from '@/containers/closet-page/SearchArea'
import EmptyCloset from '@/containers/closet-page/EmptyCloset/page'
import { fetchUserClothes, fetchImage } from '@/services/clothingApi'
import Loading from '@/app/closet/loading'
import { useEffect, useRef } from 'react'
import { ImSpinner8 } from 'react-icons/im'

const queryKeys = {
  userClothes: 'userClothes',
}

export default function ClosetPageContainer() {
  const { isSidebarOpen } = useCategorySidebar()
  const observerElem = useRef(null)

  // Using useInfiniteQuery to handle infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [queryKeys.userClothes],
    queryFn: ({ pageParam = 0 }) =>
      fetchUserClothes({ page: pageParam, size: 20 }, {}),
    getNextPageParam: (lastPage) =>
      // If last page's 'last' field is true, there are no more pages
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  })

  // Flatten the pages into a single list
  const clothingList = data?.pages.flatMap((page) => page.content) || []

  useEffect(() => {
    const currentElem = observerElem.current

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          await fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )

    if (currentElem) {
      observer.observe(currentElem)
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem)
      }
    }
  }, [hasNextPage, fetchNextPage])

  // Fetch images for each clothing item
  const imageQueries = clothingList.map((item) => ({
    queryKey: ['image', item.imageFile?.filePath],
    queryFn: () => fetchImage(item.imageFile?.filePath || ''),
    enabled: !!item.imageFile?.filePath,
  }))

  const imageResults = useQueries({ queries: imageQueries })

  const defaultImageUrl = '/images/mockup/tops11.png'

  const clothingWithImages = clothingList.map((item, index) => ({
    ...item,
    imageUrl: imageResults[index]?.data || defaultImageUrl,
  }))

  return (
    <div className="h-full">
      {isSidebarOpen && <CategorySidebar />}
      {isLoading && <Loading />}
      {isError || clothingWithImages.length === 0 ? (
        <EmptyCloset />
      ) : (
        <>
          <SearchArea />
          <ClothesList clothingList={clothingWithImages} isSelectable={false} />
          <div ref={observerElem}>
            {isFetchingNextPage && (
              <div className="flex justify-center p-4 text-gray-dark">
                <ImSpinner8 className="animate-spin" />
              </div>
            )}
          </div>
          <ClothesRegistButton />
        </>
      )}
    </div>
  )
}
