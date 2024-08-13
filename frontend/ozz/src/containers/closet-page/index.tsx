import { useInfiniteQuery, useQueries } from '@tanstack/react-query'
import { useCategorySidebar } from '@/contexts/CategorySidebarContext'
import CategorySidebar from '@/components/Button/CategorySidebar'
import ClothesRegistButton from '@/components/Button/ClothesRegistButton'
import ClothesList from '@/components/ClothesList'
import SearchArea, { OrderValue } from '@/containers/closet-page/SearchArea'
import EmptyCloset from '@/containers/closet-page/EmptyCloset/page'
import { fetchImage, fetchUserClothes } from '@/services/clothingApi'
import Loading from '@/app/closet/loading'
import { useEffect, useRef, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { categoryMap, categoryNameToLowIdMap } from '@/types/clothing'

const queryKeys = {
  userClothes: 'userClothes',
}

export default function ClosetPageContainer() {
  const { isSidebarOpen, selectedCategory, selectedSubcategory } =
    useCategorySidebar()
  const observerElem = useRef(null)

  const [order, setOrder] = useState<OrderValue>('createdDate')
  const [searchKeyword, setSearchKeyword] = useState('')

  // 카테고리 이름을 ID로 변환
  const categoryHighId =
    selectedCategory && selectedCategory
      ? categoryMap[selectedCategory]?.id
      : ''
  const categoryLowId =
    selectedSubcategory && selectedSubcategory !== '전체'
      ? categoryNameToLowIdMap[selectedSubcategory]
      : ''

  // Using useInfiniteQuery to handle infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKeys.userClothes, selectedCategory, selectedSubcategory],
    queryFn: ({ pageParam = 0 }) => {
      return fetchUserClothes(
        { page: pageParam, size: 20, sort: [`${order},desc`] },
        {
          categoryHighId,
          categoryLowId,
          keyword: searchKeyword,
        },
      )
    },
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  })

  // Submit 핸들러 정의
  const handleSubmit = () => {
    refetch().then()
  }

  useEffect(() => {
    refetch().then()
  }, [order, refetch])

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

  if (isLoading) return <Loading />

  return (
    <div>
      {isSidebarOpen && <CategorySidebar />}
      {isError || clothingWithImages.length === 0 ? (
        <EmptyCloset />
      ) : (
        <>
          <SearchArea
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            order={order}
            setOrder={setOrder}
            onSubmit={handleSubmit}
          />
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
